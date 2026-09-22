import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import type { Language } from '../types';

export function LanguageMenu() {
  const { language, setLanguage, copy } = usePortfolio();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', closeOnEscape);
    window.requestAnimationFrame(() => firstOptionRef.current?.focus());
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const choose = (next: Language) => {
    setLanguage(next);
    setOpen(false);
  };

  return (
    <div className="language-menu" ref={rootRef}>
      <button
        className="icon-button language-menu__trigger"
        type="button"
        aria-label={copy.a11y.languageMenu}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{copy.languages.active}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </button>
      {open && (
        <div className="language-menu__popover" role="menu" aria-label={copy.a11y.languageOptions}>
          {([
            ['fr', copy.languages.french],
            ['en', copy.languages.english],
          ] as const).map(([code, label], index) => (
            <button
              key={code}
              ref={index === 0 ? firstOptionRef : undefined}
              type="button"
              role="menuitemradio"
              aria-checked={language === code}
              onClick={() => choose(code)}
              onKeyDown={(event) => {
                if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const options = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]');
                if (!options?.length) return;
                const next = event.key === 'Home' ? 0
                  : event.key === 'End' ? options.length - 1
                    : event.key === 'ArrowDown' ? (index + 1) % options.length
                      : (index - 1 + options.length) % options.length;
                options[next].focus();
              }}
            >
              <span>{label}</span>
              {language === code && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
