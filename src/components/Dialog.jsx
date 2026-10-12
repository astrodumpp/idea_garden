import { useEffect, useId, useRef } from 'react';

export default function Dialog({ title, children, onClose, contentKey }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    // Native dialogs provide modal semantics and keyboard focus containment.
    dialog.showModal();
    return () => {
      dialog.close();
      const focusTarget = previousFocus instanceof Element && previousFocus.isConnected && typeof previousFocus.focus === 'function'
        ? previousFocus : document.getElementById('capture-idea');
      focusTarget?.focus();
    };
  }, []);

  useEffect(() => {
    // Changing an idea or switching form/details removes the old focused control.
    const focusTarget = dialogRef.current.querySelector('input') ?? titleRef.current;
    focusTarget.focus();
  }, [contentKey]);

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    // Wrap at the ends instead of allowing focus to move into browser chrome.
    if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onKeyDown={handleKeyDown} onCancel={(event) => { event.preventDefault(); onClose(); }} className="garden-dialog">
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-5 sm:px-8">
        <h2 ref={titleRef} id={titleId} tabIndex={-1} className="font-display text-2xl">{title}</h2>
        <button type="button" onClick={onClose} className="close-button" aria-label="Close dialog">×</button>
      </div>
      <div className="px-6 py-6 sm:px-8">{children}</div>
    </dialog>
  );
}
