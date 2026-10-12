export default function IdeaCard({ idea, connectionCount, onOpen, index }) {
  return (
    <button type="button" onClick={() => onOpen(idea.id)} className="idea-card group" aria-label={`Open idea: ${idea.title}`}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className={`idea-dot ${index % 2 === 0 ? 'bg-peach' : 'bg-lavender'}`} aria-hidden="true" />
        <time dateTime={idea.createdAt} className="text-xs text-muted">{new Date(idea.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
      </div>
      <h3 className="font-display mb-3 text-2xl leading-snug wrap-anywhere">{idea.title}</h3>
      <p className="mb-8 line-clamp-3 whitespace-pre-wrap text-sm leading-7 text-muted wrap-anywhere">{idea.description || 'A little seed of an idea. Open it to let it grow.'}</p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4 text-xs text-muted">
        <span>{connectionCount === 0 ? 'Room to grow' : `${connectionCount} ${connectionCount === 1 ? 'connection' : 'connections'}`}</span>
        <span className="text-ink transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
      </div>
    </button>
  );
}
