import { ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { SectionHeading } from './ui/SectionHeading';

export function MethodologySection() {
  const { copy } = usePortfolio();

  return (
    <section id="approach" className="section section--raised" aria-labelledby="approach-title" data-reveal>
      <div className="container">
        <SectionHeading
          titleId="approach-title"
          eyebrow={copy.approach.eyebrow}
          title={copy.approach.title}
          intro={copy.approach.intro}
        />

        <ol className="method-flow">
          {copy.approach.steps.map((step, index) => (
            <li key={step.number} data-reveal-item>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < copy.approach.steps.length - 1 && (
                <ArrowRight className="method-flow__arrow" size={18} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
