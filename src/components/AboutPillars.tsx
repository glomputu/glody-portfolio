import { Check } from 'lucide-react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { SectionHeading } from './ui/SectionHeading';

export function AboutPillars() {
  const { copy } = usePortfolio();

  return (
    <section id="profile" className="section section--raised" aria-labelledby="profile-title" data-reveal>
      <div className="container">
        <SectionHeading
          titleId="profile-title"
          eyebrow={copy.profile.eyebrow}
          title={copy.profile.title}
          intro={copy.profile.intro}
        />
        <div className="profile__layout">
          <div className="profile__statement" data-reveal-item>
            <p>{copy.profile.body}</p>
            <span className="profile__line" aria-hidden="true" />
          </div>
          <aside className="profile__highlights" aria-labelledby="profile-highlights-title" data-reveal-item>
            <h3 id="profile-highlights-title">{copy.profile.highlightsTitle}</h3>
            <ul>
              {copy.profile.highlights.map((item) => (
                <li key={item}><Check size={15} aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
            <p><strong>{copy.profile.languagesLabel}</strong>{copy.profile.languages.join(' · ')}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
