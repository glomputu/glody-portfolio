import { GraduationCap } from 'lucide-react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { SectionHeading } from './ui/SectionHeading';

export function EducationSection() {
  const { copy } = usePortfolio();

  return (
    <section id="education" className="section section--deep" aria-labelledby="education-title" data-reveal>
      <div className="container education">
        <SectionHeading
          titleId="education-title"
          eyebrow={copy.education.eyebrow}
          title={copy.education.title}
          intro={copy.education.intro}
          icon={<GraduationCap size={14} />}
        />

        <div className="education__list">
          {copy.education.items.map((item) => (
            <article key={item.degree} className="education__card" data-reveal-item>
              <div>
                <p>{item.period}</p>
                <h3>{item.degree}</h3>
                <strong>{item.institution}</strong>
              </div>
              <GraduationCap size={24} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
