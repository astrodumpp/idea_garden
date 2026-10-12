import { useState } from 'react';
import { addConnection, deleteIdea, loadGarden, saveGarden } from './storage.js';
import IdeaCard from './components/IdeaCard.jsx';
import IdeaForm from './components/IdeaForm.jsx';
import IdeaDetails from './components/IdeaDetails.jsx';
import ConnectionMap from './components/ConnectionMap.jsx';
import Dialog from './components/Dialog.jsx';

function GardenDrawing({ small = false }) {
  return (
    <svg viewBox="0 0 120 120" width={small ? 36 : 120} height={small ? 36 : 120} fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="55" fill="#efe9de" />
      <path d="M60 88V49M60 68C35 69 26 54 28 37C50 35 62 48 60 68Z" fill="#C7B8EA" />
      <path d="M60 54C59 32 73 22 92 27C92 46 80 57 60 54Z" fill="#F5B88D" />
      <path d="M60 88V49M60 67L40 49M61 52L79 36M39 89H81" stroke="#655d4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [initialLoad] = useState(() => loadGarden());
  const [garden, setGarden] = useState(initialLoad.data);
  const [saveError, setSaveError] = useState('');
  const [view, setView] = useState('ideas');
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');
  const selectedIdea = garden.ideas.find((idea) => idea.id === dialog?.ideaId);

  function updateGarden(nextGarden, message) {
    setGarden(nextGarden);
    setNotice(message);
    // Only explicit user changes write storage, never the initial empty render.
    if (initialLoad.error) return;
    try {
      saveGarden(undefined, nextGarden);
      setSaveError('');
    } catch {
      setSaveError('Your latest changes could not be saved in this browser. They are available in this session, but may be lost when you close or refresh the page. Check your browser storage settings or available space.');
    }
  }

  function openIdea(ideaId) {
    setDialog({ type: 'details', ideaId });
  }

  function saveIdea(values) {
    if (dialog.type === 'new') {
      const idea = { id: crypto.randomUUID(), ...values, createdAt: new Date().toISOString() };
      updateGarden({ ...garden, ideas: [idea, ...garden.ideas] }, 'Idea captured.');
      openIdea(idea.id);
    } else {
      updateGarden({ ...garden, ideas: garden.ideas.map((idea) => idea.id === selectedIdea.id ? { ...idea, ...values } : idea) }, 'Idea updated.');
      openIdea(selectedIdea.id);
    }
  }

  function rediscoverIdea() {
    const idea = garden.ideas[Math.floor(Math.random() * garden.ideas.length)];
    if (idea) openIdea(idea.id);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <div className="flex items-center gap-3"><GardenDrawing small /><span className="font-display text-2xl tracking-tight">Idea Garden</span></div>
          <button id="capture-idea" type="button" className="button-primary" onClick={() => setDialog({ type: 'new' })}><span aria-hidden="true">＋</span> Capture an idea</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="mb-4 text-xs tracking-[0.18em] text-muted uppercase">A place for possibilities</p>
            <h1 className="font-display text-4xl leading-[1.15] tracking-tight sm:text-5xl">Give your ideas<br />room to grow.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted">Gather little sparks. Follow unexpected connections.<br className="hidden sm:block" /> Come back and see what takes root.</p>
          </div>
          <aside className="rediscover-box lg:w-72">
            <p className="font-display mb-2 text-xl"><span className="mr-2" aria-hidden="true">✧</span>A fresh perspective</p>
            <p className="mb-4 text-sm leading-6 text-muted">An old idea might be the start of something new.</p>
            <button type="button" disabled={garden.ideas.length === 0} onClick={rediscoverIdea} className="rediscover-button">Rediscover an idea <span aria-hidden="true">↗</span></button>
          </aside>
        </div>
        {initialLoad.error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">We couldn’t load your saved garden: {initialLoad.error} Your stored data has been left untouched. You can use the app temporarily, but changes will not be saved until the storage issue is resolved and you reload.</div>}
        {saveError && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">{saveError}</div>}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200">
          <nav aria-label="Garden views" className="flex gap-6">
            <button type="button" className={`nav-button ${view === 'ideas' ? 'nav-active' : ''}`} aria-current={view === 'ideas' ? 'page' : undefined} onClick={() => setView('ideas')}>Ideas</button>
            <button type="button" className={`nav-button ${view === 'connections' ? 'nav-active' : ''}`} aria-current={view === 'connections' ? 'page' : undefined} onClick={() => setView('connections')}>Connections</button>
          </nav>
          <p className="pb-3 text-xs text-muted">{garden.ideas.length} {garden.ideas.length === 1 ? 'idea' : 'ideas'} {view === 'connections' && `· ${garden.connections.length} ${garden.connections.length === 1 ? 'connection' : 'connections'}`}</p>
        </div>
        {garden.ideas.length === 0 ? (
          <section className="empty-garden">
            <GardenDrawing />
            <h2 className="font-display mt-6 text-3xl">Every garden starts with a seed.</h2>
            <p className="mb-7 mt-3 max-w-sm text-sm leading-7 text-muted">Capture your first idea. It doesn’t need to be finished, polished, or even quite make sense yet.</p>
            <button type="button" onClick={() => setDialog({ type: 'new' })} className="button-primary">Capture your first idea <span aria-hidden="true">＋</span></button>
          </section>
        ) : view === 'ideas' ? (
          <section aria-label="Your ideas" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {garden.ideas.map((idea, index) => <IdeaCard key={idea.id} idea={idea} index={index} connectionCount={garden.connections.filter((pair) => pair.includes(idea.id)).length} onOpen={openIdea} />)}
          </section>
        ) : (
          <section aria-label="Your connections">
            <div className="mb-5"><h2 className="font-display text-2xl">See the threads between your ideas.</h2><p className="mt-2 text-sm leading-6 text-muted">Open a node to explore an idea or add a connection. Scroll the map if it needs more room.</p></div>
            <ConnectionMap ideas={garden.ideas} connections={garden.connections} onOpen={openIdea} />
          </section>
        )}
        <footer className="mt-12 flex flex-wrap justify-between gap-3 text-xs text-muted">
          <span>A little thought today. A new possibility tomorrow.</span>
          <span>{initialLoad.error || saveError ? 'Changes are not saved' : 'Saved in this browser'}</span>
        </footer>
        <p role="status" className="sr-only">{notice}</p>
      </main>
      {dialog && (dialog.type === 'new' || selectedIdea) && (
        <Dialog contentKey={`${dialog.type}:${dialog.ideaId ?? ''}`} title={dialog.type === 'new' ? 'Plant a new idea' : dialog.type === 'edit' ? 'Let your idea grow' : 'A closer look'} onClose={() => setDialog(null)}>
          {dialog.type === 'new' || dialog.type === 'edit' ? (
            <IdeaForm key={dialog.type} idea={dialog.type === 'edit' ? selectedIdea : undefined} onSave={saveIdea} onCancel={() => dialog.type === 'edit' ? openIdea(selectedIdea.id) : setDialog(null)} />
          ) : (
            <IdeaDetails key={selectedIdea.id} idea={selectedIdea} ideas={garden.ideas} connections={garden.connections} onOpen={openIdea} onEdit={() => setDialog({ type: 'edit', ideaId: selectedIdea.id })} onDelete={() => { updateGarden(deleteIdea(garden, selectedIdea.id), 'Idea deleted.'); setDialog(null); }} onConnect={(first, second) => updateGarden(addConnection(garden, first, second), 'Ideas connected.')} onDisconnect={(first, second) => updateGarden({ ...garden, connections: garden.connections.filter((pair) => !(pair.includes(first) && pair.includes(second))) }, 'Connection removed.')} />
          )}
        </Dialog>
      )}
    </div>
  );
}
