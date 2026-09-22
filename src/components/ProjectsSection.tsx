import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { publishedProjects } from '../data/portfolioData';
import { SectionHeading } from './ui/SectionHeading';

export function ProjectsSection() {
  const { copy, language, openProject } = usePortfolio();

  return (
    <section id="projects" className="section section--deep" aria-labelledby="projects-title" data-reveal>
      <div className="container">
        <SectionHeading
          titleId="projects-title"
          eyebrow={copy.projects.eyebrow}
          title={copy.projects.title}
          intro={copy.projects.intro}
          icon={<FolderGit2 size={14} />}
        />

        <ol className="work-list">
          {publishedProjects.map((project, index) => {
            const content = project.content[language];
            return (
              <li
                className={`work-entry ${index % 2 ? 'work-entry--reverse' : ''} ${project.cover ? 'work-entry--with-visual' : 'work-entry--text-only'}`}
                key={project.slug}
                data-reveal-item
              >
                {project.cover && (
                  <figure className="work-entry__visual">
                    <img
                      src={project.cover.src}
                      alt={project.cover.alt[language]}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                )}

                <article className="work-entry__content">
                  <div className="work-entry__meta">
                    {project.year && <time dateTime={String(project.year)}>{project.year}</time>}
                    <span>{content.projectType}</span>
                    {project.organization && <span>{project.organization}</span>}
                  </div>
                  <h3>{content.title}</h3>
                  <p className="work-entry__intro">{content.introduction}</p>
                  <ul className="work-entry__technologies" aria-label={copy.projects.technologies}>
                    {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                  <button
                    className="work-entry__link"
                    type="button"
                    aria-label={`${copy.projects.view} — ${content.title}`}
                    onClick={() => openProject(project)}
                  >
                    {copy.projects.view}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
