import { FileText, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { publishedProjects } from '../data/portfolioData';
import { LanguageMenu } from './LanguageMenu';

const baseSectionIds = ['hero', 'profile', 'expertise', 'experience', 'approach', 'education', 'contact'] as const;
type SectionId = (typeof baseSectionIds)[number] | 'projects';

function currentSection(sectionIds: readonly SectionId[]): SectionId {
  const probe = Math.min(180, window.innerHeight * 0.28) + 76;
  let active = sectionIds[0];
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= probe) active = id;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    active = sectionIds.at(-1) ?? active;
  }
  return active;
}

export function Navbar() {
  const { copy, language, theme, toggleTheme } = usePortfolio();
  const sectionIds = useMemo<SectionId[]>(
    () => publishedProjects.length > 0
      ? ['hero', 'profile', 'expertise', 'experience', 'projects', 'approach', 'education', 'contact']
      : [...baseSectionIds],
    [],
  );
  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    const hash = window.location.hash.slice(1) as SectionId;
    return sectionIds.includes(hash) ? hash : 'hero';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  const navItems = sectionIds.map((id) => [id, {
    hero: copy.nav.home,
    profile: copy.nav.profile,
    expertise: copy.nav.expertise,
    experience: copy.nav.experience,
    projects: copy.nav.projects,
    approach: copy.nav.approach,
    education: copy.nav.education,
    contact: copy.nav.contact,
  }[id]] as const);

  useEffect(() => {
    const syncFromScroll = () => {
      window.cancelAnimationFrame(frame.current ?? 0);
      frame.current = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        const next = currentSection(sectionIds);
        setActiveSection(next);
        if (window.location.hash !== `#${next}`) {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${next}`);
        }
      });
    };

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      const target = sectionIds.includes(hash) ? hash : 'hero';
      window.cancelAnimationFrame(frame.current ?? 0);
      frame.current = window.requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({ block: 'start', behavior: 'auto' });
        setActiveSection(target);
        setScrolled(target !== 'hero' || window.scrollY > 16);
      });
    };

    if (window.location.hash) scrollToHash();
    else syncFromScroll();
    window.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('resize', syncFromScroll, { passive: true });
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.cancelAnimationFrame(frame.current ?? 0);
      window.removeEventListener('scroll', syncFromScroll);
      window.removeEventListener('resize', syncFromScroll);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [sectionIds]);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1) as SectionId;
    if (!sectionIds.includes(hash)) return;
    document.getElementById(hash)?.scrollIntoView({ block: 'start', behavior: 'auto' });
    setActiveSection(hash);
  }, [language, sectionIds]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const followLink = (id: SectionId) => {
    setActiveSection(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'auto' });
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a className="brand" href="#hero" aria-label={copy.a11y.homeLink} onClick={() => followLink('hero')}>
          <span className="brand__mark brand__initials" aria-hidden="true">GM</span>
          <span className="brand__copy">
            <strong>GloDi MPUTU</strong>
            <small>Software Engineer · IT Manager</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label={copy.a11y.mainNavigation}>
          {navItems.map(([id, label]) => (
            <a key={id} className={activeSection === id ? 'is-active' : ''} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={() => followLink(id)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <LanguageMenu />
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? copy.a11y.lightTheme : copy.a11y.darkTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            className="button button--quiet navbar__resume"
            href={siteConfig.resume[language]}
            download
            aria-label={copy.a11y.downloadResume}
          >
            <FileText size={15} />
            {copy.nav.resume}
          </a>
          <a className="button button--primary navbar__contact" href="#contact" onClick={() => followLink('contact')}>
            {copy.nav.contact}
          </a>
          <button className="icon-button navbar__menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? copy.a11y.closeMenu : copy.a11y.openMenu} aria-expanded={menuOpen} aria-controls="mobile-navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label={copy.a11y.mobileNavigation} hidden={!menuOpen}>
        <div className="container mobile-nav__grid">
          {navItems.map(([id, label]) => (
            <a key={id} className={activeSection === id ? 'is-active' : ''} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={() => followLink(id)}>
              <span>{label}</span><span aria-hidden="true">↗</span>
            </a>
          ))}
          <a
            className="button button--quiet mobile-nav__resume"
            href={siteConfig.resume[language]}
            download
            aria-label={copy.a11y.downloadResume}
            onClick={() => setMenuOpen(false)}
          >
            <FileText size={16} />{copy.hero.resumeCta}
          </a>
        </div>
      </nav>
    </header>
  );
}
