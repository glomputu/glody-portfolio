import type { ReactNode } from 'react';

interface SectionHeadingProps {
  titleId: string;
  eyebrow: string;
  title: string;
  intro: string;
  icon?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHeading({
  titleId,
  eyebrow,
  title,
  intro,
  icon,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <header className={`section-heading ${align === 'center' ? 'section-heading--center' : ''}`}>
      <p className="eyebrow">
        {icon && <span aria-hidden="true">{icon}</span>}
        <span>{eyebrow}</span>
      </p>
      <h2 id={titleId}>{title}</h2>
      <p className="section-intro">{intro}</p>
    </header>
  );
}
