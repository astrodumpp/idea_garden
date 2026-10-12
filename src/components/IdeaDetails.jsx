import { useState } from 'react';

export default function IdeaDetails({ idea, ideas, connections, onOpen, onEdit, onDelete, onConnect, onDisconnect }) {
  const [connectionId, setConnectionId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const connectedIds = connections.filter((pair) => pair.includes(idea.id)).map((pair) => pair.find((id) => id !== idea.id));
  const connectedIdeas = ideas.filter((other) => connectedIds.includes(other.id));
  const availableIdeas = ideas.filter((other) => other.id !== idea.id && !connectedIds.includes(other.id));

  function handleConnect(event) {
    event.preventDefault();
    if (connectionId) {
      onConnect(idea.id, connectionId);
      setConnectionId('');
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-xs text-muted">Captured <time dateTime={idea.createdAt}>{new Date(idea.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time></p>
        <h3 className="font-display mb-4 text-3xl leading-snug wrap-anywhere">{idea.title}</h3>
        <p className="whitespace-pre-wrap leading-7 wrap-anywhere">{idea.description || 'This idea is just beginning. Add a description as it takes shape.'}</p>
        <button type="button" onClick={onEdit} className="button-secondary mt-5">Edit & expand</button>
      </div>
      <section className="border-t border-stone-200 pt-6" aria-label="Idea connections">
        <h4 className="mb-2 font-medium">Connected ideas</h4>
        <p className="mb-4 text-sm text-muted">Follow the threads between your thoughts.</p>
        {connectedIdeas.length === 0 ? <p className="mb-4 text-sm text-muted">No connections yet.</p> : (
          <ul className="mb-4 space-y-2">
            {connectedIdeas.map((other) => (
              <li key={other.id} className="flex items-center gap-3 rounded-xl bg-lavender/15 px-4 py-3">
                <button type="button" onClick={() => onOpen(other.id)} className="min-w-0 flex-1 text-left text-sm underline decoration-stone-300 underline-offset-4 wrap-anywhere">{other.title}</button>
                <button type="button" onClick={() => onDisconnect(idea.id, other.id)} className="shrink-0 rounded-md px-2 py-1 text-xs text-muted hover:bg-white" aria-label={`Remove connection to ${other.title}`}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        {availableIdeas.length > 0 ? (
          <form onSubmit={handleConnect}>
            <label htmlFor="connect-idea" className="field-label">Connect to another idea</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select id="connect-idea" className="field min-w-0 flex-1" value={connectionId} onChange={(event) => setConnectionId(event.target.value)} required>
                <option value="">Choose an idea…</option>
                {availableIdeas.map((other) => <option key={other.id} value={other.id}>{other.title}</option>)}
              </select>
              <button type="submit" disabled={!connectionId} className="button-secondary">Connect</button>
            </div>
          </form>
        ) : <p className="text-sm text-muted">{ideas.length < 2 ? 'Capture another idea to make your first connection.' : 'This idea is connected to every other idea in your garden.'}</p>}
      </section>
      <div className="border-t border-stone-200 pt-5">
        {confirmDelete ? (
          <div className="rounded-xl bg-red-50 p-4">
            <p className="mb-4 text-sm text-red-900">Delete this idea and its connections? This cannot be undone.</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onDelete} className="button-danger">Delete idea</button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="button-secondary">Keep idea</button>
            </div>
          </div>
        ) : <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-lg px-2 py-2 text-sm text-red-800 hover:bg-red-50">Delete idea</button>}
      </div>
    </div>
  );
}
