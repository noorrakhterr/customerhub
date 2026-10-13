import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface SlideOverProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function SlideOver({ title, onClose, children }: SlideOverProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="slide-over-backdrop" onClick={onClose}>
      <div className="slide-over" onClick={(e) => e.stopPropagation()}>
        <div className="slide-over__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="slide-over__body">{children}</div>
      </div>
    </div>
  );
}
