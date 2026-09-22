export type Language = 'fr' | 'en';
export type Theme = 'light' | 'dark';

export type IconName =
  | 'braces'
  | 'database'
  | 'server'
  | 'shield'
  | 'workflow'
  | 'wrench';

export interface ExpertiseDomain {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  competencies: string[];
  icon: IconName;
}

export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  kind: string;
  summary: string;
  responsibilities: string[];
  current: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
}

export interface MethodStep {
  number: string;
  title: string;
  description: string;
}

export type LocalizedText = Record<Language, string>;

export interface ProjectContent {
  title: string;
  projectType: string;
  introduction: string;
  context: string;
  contribution: string;
  solution: string;
  features: string[];
}

export interface Project {
  id: string;
  slug: string;
  year?: number;
  organization?: string;
  content: Record<Language, ProjectContent>;
  technologies: string[];
  screenshots: Array<{ src: string; alt: LocalizedText; caption?: LocalizedText }>;
  cover?: { src: string; alt: LocalizedText };
  demoUrl?: string;
  repositoryUrl?: string;
  repositoryPublic?: boolean;
  visibility: 'public' | 'draft';
  featured: boolean;
  featuredOrder?: number;
  relatedExperience?: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
  website: string;
  startedAt: number;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'success-stored' | 'error' | 'rate-limited';
