import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { translations, type Translation } from '../i18n/translations';
import type { Language, Project, Theme } from '../types';

interface PortfolioContextValue {
  theme: Theme;
  language: Language;
  copy: Translation;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  selectedProject: Project | null;
  openProject: (project: Project) => void;
  closeProject: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function getInitialTheme(): Theme {
  const applied = document.documentElement.dataset.theme;
  if (applied === 'light' || applied === 'dark') return applied;
  const stored = window.localStorage.getItem('glodi-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialLanguage(): Language {
  const applied = document.documentElement.lang;
  if (applied === 'fr' || applied === 'en') return applied;
  const stored = window.localStorage.getItem('glodi-language');
  return stored === 'en' ? 'en' : 'fr';
}

function setMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

function applyTranslatedMetadata(language: Language, copy: Translation) {
  const origin = window.location.origin;
  document.documentElement.lang = language;
  document.title = copy.meta.title;
  setMeta('meta[name="description"]', copy.meta.description);
  setMeta('meta[property="og:locale"]', language === 'fr' ? 'fr_FR' : 'en_US');
  setMeta('meta[property="og:site_name"]', copy.meta.siteName);
  setMeta('meta[property="og:title"]', copy.meta.title);
  setMeta('meta[property="og:description"]', copy.meta.socialDescription);
  setMeta('meta[property="og:image:alt"]', copy.meta.imageAlt);
  setMeta('meta[name="twitter:title"]', copy.meta.title);
  setMeta('meta[name="twitter:description"]', copy.meta.socialDescription);
  setMeta('meta[name="twitter:image:alt"]', copy.meta.imageAlt);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `${origin}/`);
  setMeta('meta[property="og:url"]', `${origin}/`);
  setMeta('meta[property="og:image"]', `${origin}/og.jpg`);
  setMeta('meta[name="twitter:image"]', `${origin}/og.jpg`);

  const schema = document.getElementById('person-schema');
  if (schema) {
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'GloDi MPUTU',
      url: `${origin}/`,
      jobTitle: copy.hero.role,
      knowsAbout: Array.from(new Set(copy.expertise.domains.flatMap((domain) => domain.competencies))),
    });
  }
}

export function ThemeLanguageProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [language, updateLanguage] = useState<Language>(getInitialLanguage);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const transitionTimer = useRef<number | undefined>(undefined);
  const languageTimer = useRef<number | undefined>(undefined);
  const copy = translations[language];

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    setMeta('meta[name="theme-color"]', theme === 'dark' ? '#050b14' : '#f3f1eb');
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem('glodi-language', language);
    applyTranslatedMetadata(language, copy);
  }, [copy, language]);

  useEffect(() => () => {
    window.clearTimeout(transitionTimer.current);
    window.clearTimeout(languageTimer.current);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('is-theme-changing');
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(
      () => root.classList.remove('is-theme-changing'),
      180,
    );
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('glodi-theme', next);
      return next;
    });
  }, []);

  const setLanguage = useCallback((next: Language) => {
    if (next === language) return;
    const root = document.documentElement;
    root.classList.add('is-language-changing');
    window.clearTimeout(languageTimer.current);
    languageTimer.current = window.setTimeout(
      () => root.classList.remove('is-language-changing'),
      160,
    );
    updateLanguage(next);
    window.localStorage.setItem('glodi-language', next);
  }, [language]);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      theme,
      language,
      copy,
      toggleTheme,
      setLanguage,
      selectedProject,
      openProject: setSelectedProject,
      closeProject: () => setSelectedProject(null),
    }),
    [copy, language, selectedProject, setLanguage, theme, toggleTheme],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used inside ThemeLanguageProvider');
  return context;
}
