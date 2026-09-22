import { CalendarDays, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { SectionHeading } from './ui/SectionHeading';

export function ExperienceTimeline() {
  const { copy } = usePortfolio();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const toggleDetails = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="experience" className="section section--raised" aria-labelledby="experience-title" data-reveal>
      <div className="container">
        <div className="experience-heading">
          <SectionHeading
            titleId="experience-title"
            eyebrow={copy.experience.eyebrow}
            title={copy.experience.title}
            intro={copy.experience.intro}
          />
          <p className="experience-heading__direction">{copy.experience.direction}</p>
        </div>

        <ol className="timeline">
          {copy.experience.items.map((experience) => (
            <li className={`timeline__item ${experience.current ? 'is-current' : ''}`} key={experience.id} data-reveal-item>
              <span className={`timeline__marker ${experience.current ? 'is-current' : ''}`} aria-hidden="true" />
              <article className="timeline__card">
                <div className="timeline__meta">
                  <span><CalendarDays size={14} aria-hidden="true" />{experience.period}</span>
                  <span>{experience.kind}</span>
                  {experience.current && <span className="current-badge">{copy.experience.current}</span>}
                </div>
                <h3>{experience.role}</h3>
                <p className="timeline__organization">{experience.organization}</p>
                <p className="timeline__summary">{experience.summary}</p>
                <div className={`timeline__details ${expanded.has(experience.id) ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={expanded.has(experience.id)}
                    aria-controls={`experience-details-${experience.id}`}
                    aria-label={`${expanded.has(experience.id) ? copy.a11y.experienceDetailsClose : copy.a11y.experienceDetails} — ${experience.organization}`}
                    onClick={() => toggleDetails(experience.id)}
                  >
                    <span>{copy.experience.details}</span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>
                  <div
                    className="timeline__details-reveal"
                    id={`experience-details-${experience.id}`}
                    aria-hidden={!expanded.has(experience.id)}
                  >
                    <div>
                      <ul>
                        {experience.responsibilities.map((responsibility) => (
                          <li key={responsibility}><Check size={14} aria-hidden="true" /><span>{responsibility}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
