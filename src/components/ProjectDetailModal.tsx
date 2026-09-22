import { ExternalLink, Github, X } from 'lucide-react';
import { useCallback } from 'react';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { useDialog } from '../hooks/useDialog';

export function ProjectDetailModal() {
  const { selectedProject, closeProject, copy, language } = usePortfolio();
  const handleClose = useCallback(() => closeProject(), [closeProject]);
  const dialogRef = useDialog(Boolean(selectedProject), handleClose);

  if (!selectedProject) return null;

  const content = selectedProject.content[language];
  const hasPublicRepository = Boolean(selectedProject.repositoryPublic && selectedProject.repositoryUrl);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeProject();
    }}>
      <div
        className="modal project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        ref={dialogRef}
      >
        <header className="modal__header project-detail__header">
          <div>
            <div className="project-detail__meta">
              {selectedProject.year && <time dateTime={String(selectedProject.year)}>{selectedProject.year}</time>}
              <span>{content.projectType}</span>
              {selectedProject.organization && <span>{selectedProject.organization}</span>}
            </div>
            <h2 id="project-title">{content.title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={closeProject} aria-label={copy.projects.close}>
            <X size={19} />
          </button>
        </header>

        <div className="modal__body project-detail">
          <p className="project-detail__lead">{content.introduction}</p>

          <div className="project-detail__sections">
            <section>
              <h3>{copy.projects.context}</h3>
              <p>{content.context}</p>
            </section>
            <section>
              <h3>{copy.projects.contribution}</h3>
              <p>{content.contribution}</p>
            </section>
            <section>
              <h3>{copy.projects.solution}</h3>
              <p>{content.solution}</p>
            </section>
          </div>

          {content.features.length > 0 && (
            <section className="project-detail__features">
              <h3>{copy.projects.features}</h3>
              <ul>
                {content.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>
          )}

          {selectedProject.technologies.length > 0 && (
            <section>
              <h3>{copy.projects.technologies}</h3>
              <ul className="project-detail__technologies">
                {selectedProject.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </section>
          )}

          {selectedProject.screenshots.length > 0 && (
            <section>
              <h3>{copy.projects.screenshots}</h3>
              <div className="project-detail__screenshots">
                {selectedProject.screenshots.map((screenshot) => (
                  <a
                    href={screenshot.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${copy.projects.openScreenshot} — ${screenshot.alt[language]}`}
                    key={screenshot.src}
                  >
                    <img src={screenshot.src} alt={screenshot.alt[language]} loading="lazy" decoding="async" />
                    {screenshot.caption && <span>{screenshot.caption[language]}</span>}
                  </a>
                ))}
              </div>
            </section>
          )}

          {(selectedProject.demoUrl || hasPublicRepository) && (
            <div className="project-detail__links">
              {selectedProject.demoUrl && (
                <a className="button button--primary" href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer">
                  {copy.projects.demo} <ExternalLink size={15} aria-hidden="true" />
                </a>
              )}
              {hasPublicRepository && selectedProject.repositoryUrl && (
                <a className="button button--quiet" href={selectedProject.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  {copy.projects.repository} <Github size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
