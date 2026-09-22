import { ArrowUp, Github, Linkedin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { projects } from '../data/portfolioData';

export function Footer() {
  const { copy } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__top">
        <a className="brand" href="#hero" aria-label={copy.a11y.homeLink}>
          <span className="brand__mark brand__initials" aria-hidden="true">GM</span>
          <span className="brand__copy">
            <strong>GloDi MPUTU</strong>
            <small>{copy.footer.description}</small>
          </span>
        </a>
        <nav aria-label={copy.a11y.footerNavigation}>
          <a href="#profile">{copy.nav.profile}</a>
          <a href="#expertise">{copy.nav.expertise}</a>
          <a href="#experience">{copy.nav.experience}</a>
          {projects.length > 0 && <a href="#projects">{copy.nav.projects}</a>}
          <a href="#contact">{copy.nav.contact}</a>
        </nav>
        {(siteConfig.social.linkedIn || siteConfig.social.github) && (
          <div className="footer__socials">
            {siteConfig.social.linkedIn && (
              <a href={siteConfig.social.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            {siteConfig.social.github && (
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="container footer__bottom">
        <p>© {year} GloDi MPUTU. {copy.footer.rights}</p>
        <a href="#hero">
          {copy.footer.backToTop}
          <ArrowUp size={14} />
        </a>
      </div>
    </footer>
  );
}
