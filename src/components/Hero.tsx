import { ArrowDownRight, Check, FileText } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { ProfilePortrait } from './ProfilePortrait';

export function Hero() {
  const { copy, language } = usePortfolio();

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__layout">
        <div className="hero__copy">
          <div className="hero__identity">
            <h1 id="hero-title">{copy.hero.title}</h1>
            <p className="hero__role">{copy.hero.role}</p>
          </div>
          <p className="hero__intro">{copy.hero.intro}</p>
          <div className="hero__skills" aria-label={copy.a11y.heroFocus}>
            {copy.hero.skills.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="hero__actions">
            <a className="button button--primary button--large" href="#experience">
              {copy.hero.primaryCta}<ArrowDownRight size={17} />
            </a>
            <a className="button button--secondary button--large" href="#contact">{copy.hero.secondaryCta}</a>
            <a
              className="button button--text button--large"
              href={siteConfig.resume[language]}
              download
              aria-label={copy.a11y.downloadResume}
            >
              <FileText size={17} />{copy.hero.resumeCta}
            </a>
          </div>
          <ul className="hero__summary" aria-label={copy.a11y.heroFocus}>
            {copy.hero.summary.map((label) => <li key={label}>{label}</li>)}
          </ul>
        </div>

        <div className="hero__media">
          <ProfilePortrait />
          <aside className="hero-focus" aria-label={copy.hero.focusLabel}>
            <p>{copy.hero.focusLabel}</p>
            <ul>
              {copy.hero.focus.map((item) => <li key={item}><Check size={14} aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
