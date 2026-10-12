export const STORAGE_KEY = 'idea-garden-v1';

function emptyGarden() {
  return { version: 1, ideas: [], connections: [] };
}

function validateGarden(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.ideas) || !Array.isArray(data.connections)) {
    throw new Error('The saved garden has an unsupported format.');
  }
  const ideaIds = new Set();
  for (const idea of data.ideas) {
    if (!idea || typeof idea.id !== 'string' || !idea.id || ideaIds.has(idea.id)
      || typeof idea.title !== 'string' || !idea.title.trim()
      || typeof idea.description !== 'string' || typeof idea.createdAt !== 'string'
      || !Number.isFinite(Date.parse(idea.createdAt))) {
      throw new Error('A saved idea could not be read.');
    }
    ideaIds.add(idea.id);
  }
  const pairs = new Set();
  for (const pair of data.connections) {
    if (!Array.isArray(pair) || pair.length !== 2 || pair[0] === pair[1]
      || !ideaIds.has(pair[0]) || !ideaIds.has(pair[1])) {
      throw new Error('A saved connection could not be read.');
    }
    const key = JSON.stringify([...pair].sort());
    if (pairs.has(key)) throw new Error('The saved garden contains a duplicate connection.');
    pairs.add(key);
  }
  return data;
}

// Access localStorage inside try/catch: browsers can deny even reading this property.
export function loadGarden(storage) {
  try {
    const raw = (storage ?? window.localStorage).getItem(STORAGE_KEY);
    return { data: raw === null ? emptyGarden() : validateGarden(JSON.parse(raw)), error: null };
  } catch (error) {
    return { data: emptyGarden(), error: error.message || 'Browser storage is unavailable.' };
  }
}

export function saveGarden(storage, data) {
  (storage ?? window.localStorage).setItem(STORAGE_KEY, JSON.stringify(validateGarden(data)));
}

export function addConnection(data, firstId, secondId) {
  const bothExist = [firstId, secondId].every((id) => data.ideas.some((idea) => idea.id === id));
  const alreadyConnected = data.connections.some((pair) => pair.includes(firstId) && pair.includes(secondId));
  if (!bothExist || firstId === secondId || alreadyConnected) return data;
  return { ...data, connections: [...data.connections, [firstId, secondId]] };
}

export function deleteIdea(data, ideaId) {
  return {
    ...data,
    ideas: data.ideas.filter((idea) => idea.id !== ideaId),
    connections: data.connections.filter((pair) => !pair.includes(ideaId)),
  };
}
