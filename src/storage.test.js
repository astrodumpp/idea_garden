import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGarden, saveGarden, addConnection, deleteIdea, STORAGE_KEY } from './storage.js';

const ideas = ['a', 'b', 'c'].map((id) => ({ id, title: `Idea ${id}`, description: '', createdAt: '2026-10-11T12:00:00.000Z' }));
const garden = () => ({ version: 1, ideas, connections: [] });
// A small storage adapter exercises serialization without depending on a browser.
function memoryStorage(initial = null) {
  const values = new Map(initial === null ? [] : [[STORAGE_KEY, initial]]);
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('an empty store loads an empty garden', () => {
  assert.deepEqual(loadGarden(memoryStorage()), { data: { version: 1, ideas: [], connections: [] }, error: null });
});
test('saving and loading preserves descriptions, dates, and connections', () => {
  const storage = memoryStorage();
  const data = { ...garden(), ideas: [{ ...ideas[0], description: 'First thought\nA new direction' }, ideas[1]], connections: [['a', 'b']] };
  saveGarden(storage, data);
  assert.deepEqual(loadGarden(storage), { data, error: null });
});
test('unreadable data reports an error and leaves the original value untouched', () => {
  for (const raw of ['{broken', 'null', JSON.stringify({ ...garden(), version: 2 }), JSON.stringify({ ...garden(), ideas: [{}] }), JSON.stringify({ ...garden(), ideas: [ideas[0], ideas[0]] }), JSON.stringify({ ...garden(), ideas: [{ ...ideas[0], createdAt: 'bad' }] })]) {
    const storage = memoryStorage(raw);
    const result = loadGarden(storage);
    assert.ok(result.error);
    assert.deepEqual(result.data.ideas, []);
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});
test('invalid stored connections are rejected', () => {
  for (const connections of [[['a', 'a']], [['a', 'missing']], [['a', 'b'], ['b', 'a']], [['a']], [null]]) {
    assert.ok(loadGarden(memoryStorage(JSON.stringify({ ...garden(), connections }))).error);
  }
});
test('storage access and write failures are surfaced', () => {
  assert.ok(loadGarden({ getItem() { throw new Error('Denied'); } }).error);
  assert.throws(() => saveGarden({ setItem() { throw new Error('Quota'); } }, garden()), /Quota/);
});
test('adding connections prevents reversed duplicates, self-links, and dangling IDs', () => {
  const data = addConnection(garden(), 'a', 'b');
  assert.deepEqual(data.connections, [['a', 'b']]);
  for (const pair of [['b', 'a'], ['a', 'b'], ['a', 'a'], ['a', 'missing']]) {
    assert.deepEqual(addConnection(data, ...pair), data);
  }
  assert.deepEqual(garden().connections, []);
});
test('deleting an idea removes its connections and retains unrelated connections', () => {
  const data = { ...garden(), connections: [['a', 'b'], ['c', 'a'], ['b', 'c']] };
  const result = deleteIdea(data, 'a');
  assert.deepEqual(result.ideas.map((idea) => idea.id), ['b', 'c']);
  assert.deepEqual(result.connections, [['b', 'c']]);
  assert.equal(data.ideas.length, 3);
});
