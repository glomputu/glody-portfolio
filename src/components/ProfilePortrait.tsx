import { siteConfig } from '../config/siteConfig';
import { usePortfolio } from '../context/ThemeLanguageContext';
import { useState } from 'react';

export function ProfilePortrait() {
  const { copy } = usePortfolio();
  const [unavailable, setUnavailable] = useState(false);

  return (
    <figure className="profile-portrait">
      <div className="profile-portrait__frame">
        {!unavailable ? (
          <picture>
            <source srcSet={siteConfig.portrait.avif} type="image/avif" />
            <source srcSet={siteConfig.portrait.webp} type="image/webp" />
            <img
              src={siteConfig.portrait.fallback}
              alt={copy.a11y.portrait}
              width="720"
              height="900"
              sizes="(min-width: 1152px) 390px, (min-width: 768px) 46vw, 88vw"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={() => setUnavailable(true)}
            />
          </picture>
        ) : (
          <div className="profile-portrait__fallback" role="img" aria-label={copy.a11y.portraitFallback}>
            <span>GM</span>
          </div>
        )}
        <span className="profile-portrait__line" aria-hidden="true" />
      </div>
      <figcaption>
        <strong>GloDi MPUTU</strong>
        <span>{copy.hero.role}</span>
      </figcaption>
    </figure>
  );
}
