import {
  Braces,
  Check,
  Layers3,
  Server,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import type { IconName } from '../types';
import { SectionHeading } from './ui/SectionHeading';

const iconMap: Record<IconName, typeof Braces> = {
  braces: Braces,
  database: Layers3,
  server: Server,
  shield: ShieldCheck,
  workflow: Workflow,
  wrench: Layers3,
};

export function ExpertiseSection() {
  const { copy } = usePortfolio();
  const [activeId, setActiveId] = useState('software-engineering');
  const activeDomain = copy.expertise.domains.find((domain) => domain.id === activeId) ?? copy.expertise.domains[0];
  const ActiveIcon = iconMap[activeDomain.icon];

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const count = copy.expertise.domains.length;
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? count - 1
        : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % count
          : (index - 1 + count) % count;
    const nextId = copy.expertise.domains[nextIndex].id;
    setActiveId(nextId);
    document.getElementById(`expertise-tab-${nextId}`)?.focus();
  };

  return (
    <section id="expertise" className="section section--deep" aria-labelledby="expertise-title" data-reveal>
      <div className="container">
        <SectionHeading
          titleId="expertise-title"
          eyebrow={copy.expertise.eyebrow}
          title={copy.expertise.title}
          intro={copy.expertise.intro}
          icon={<Layers3 size={14} />}
        />

        <div className="expertise">
          <div className="expertise__tabs" role="tablist" aria-label={copy.expertise.eyebrow}>
            {copy.expertise.domains.map((domain, index) => {
              const Icon = iconMap[domain.icon];
              const active = domain.id === activeId;
              return (
                <button
                  key={domain.id}
                  id={`expertise-tab-${domain.id}`}
                  className={active ? 'is-active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`expertise-panel-${domain.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveId(domain.id)}
                  onKeyDown={(event) => moveTab(event, index)}
                >
                  <span className="expertise__tab-icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <span>
                    <strong>{domain.title}</strong>
                    <small>{domain.eyebrow}</small>
                  </span>
                  <span className="expertise__indicator" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div
            key={activeDomain.id}
            className="expertise__panel"
            id={`expertise-panel-${activeDomain.id}`}
            role="tabpanel"
            aria-labelledby={`expertise-tab-${activeDomain.id}`}
          >
            <div className="expertise__panel-heading">
              <span className="expertise__panel-icon" aria-hidden="true">
                <ActiveIcon size={23} />
              </span>
              <div>
                <p>{activeDomain.eyebrow}</p>
                <h3>{activeDomain.title}</h3>
              </div>
            </div>
            <p className="expertise__description">{activeDomain.description}</p>
            <ul className="capability-grid">
              {activeDomain.competencies.map((competency) => (
                <li key={competency}>
                  <Check size={15} aria-hidden="true" />
                  <span>{competency}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
