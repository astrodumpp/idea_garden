import { useId, useState } from 'react';

export default function IdeaForm({ idea, onSave, onCancel }) {
  const [title, setTitle] = useState(idea?.title ?? '');
  const [description, setDescription] = useState(idea?.description ?? '');
  const [error, setError] = useState('');
  const formId = useId();

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Give your idea a title before saving.');
      return;
    }
    onSave({ title: title.trim(), description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm leading-relaxed text-muted">{idea ? 'Add a new thought, follow a tangent, or give your idea a little more room.' : 'A passing thought, a wild possibility, a tiny beginning. It all belongs here.'}</p>
      <div>
        <label htmlFor={`${formId}-title`} className="field-label">Title <span className="font-normal text-muted">(required)</span></label>
        <input id={`${formId}-title`} value={title} onChange={(event) => { setTitle(event.target.value); setError(''); }} required className="field" placeholder="What’s on your mind?" aria-invalid={Boolean(error)} aria-describedby={error ? `${formId}-error` : undefined} />
      </div>
      <div>
        <label htmlFor={`${formId}-description`} className="field-label">Description</label>
        <textarea id={`${formId}-description`} rows={7} value={description} onChange={(event) => setDescription(event.target.value)} className="field resize-y" placeholder="Let the thought unfold. You can always come back and add more." />
      </div>
      {error && <p id={`${formId}-error`} role="alert" className="text-sm text-red-800">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onCancel} className="button-secondary">Cancel</button>
        <button type="submit" className="button-primary">{idea ? 'Save changes' : 'Save idea'}</button>
      </div>
    </form>
  );
}
