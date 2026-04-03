import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard focus within `containerRef` while `isOpen` is true.
 *
 * On open:  focuses the container itself first (so VoiceOver announces the
 *           dialog name), then lets the user Tab to the first interactive element.
 * On close: returns focus to the element that was active when the trap opened.
 *
 * Requires the container element to have tabIndex={-1} so it can receive
 * programmatic focus without appearing in the natural Tab order.
 */
function useFocusTrap<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
  isOpen: boolean,
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));

    // Defer focus to the next paint so the dialog is fully rendered in the DOM.
    // Focus the container first — VoiceOver reads the dialog's aria-labelledby
    // name and announces "web dialog" before the user navigates its contents.
    const frameId = requestAnimationFrame(() => {
      container.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab from first focusable (or the container itself) → wrap to last
        if (document.activeElement === first || document.activeElement === container) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab from last focusable → wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, containerRef]);
}

export default useFocusTrap;
