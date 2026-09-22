import resumeContent from '../data/resumeContent.json';
import type { Language } from '../types';

const frResume = resumeContent.fr;
const enResume = resumeContent.en;

const frExperienceMeta = {
  'abd-technology': {
    kind: 'Responsabilité IT',
    summary: "J'ai commencé mon parcours en supervisant les services et les infrastructures informatiques, tout en coordonnant les activités de développement et de maintenance.",
  },
  'sep-congo': {
    kind: 'Freelance',
    summary: "Cette mission m'a permis d'étendre mon expérience au développement web, au déploiement et à la maintenance d'applications.",
  },
  'bemprodec': {
    kind: 'Management IT',
    summary: "Je combine développement de plateformes web, administration, maintenance et responsabilité sur leur performance, leur sécurité et leur disponibilité.",
  },
  'innovate-for-future Tech': {
    kind: 'Freelance',
    summary: "J'ai développé et maintenu des applications web en collaboration avec une équipe technique, avec intégration de bases de données et d'API REST.",
  },
  'education-ministry': {
    kind: 'Stage professionnel',
    summary: "Je contribue au développement, aux tests, à la correction des anomalies et à la maintenance des applications informatiques du ministère.",
  },
} as const;

const enExperienceMeta = {
  'abd-technology': {
    kind: 'IT responsibility',
    summary: 'I began my career by supervising IT services and infrastructure while coordinating development and maintenance activities.',
  },
  'sep-congo': {
    kind: 'Freelance',
    summary: 'This assignment expanded my experience into web development, application deployment and maintenance.',
  },
  bemprodec: {
    kind: 'IT management',
    summary: 'I combine web platform development, administration and maintenance with responsibility for performance, security and availability.',
  },
  'innovate-for-future Tech': {
    kind: 'Freelance',
    summary: 'I developed and maintained web applications with a technical team, including database and REST API integrations.',
  },
  'education-ministry': {
    kind: 'Professional internship',
    summary: "I contribute to the development, testing, defect correction and maintenance of the ministry's software applications.",
  },
} as const;

const frExperiences = [...frResume.experiences].reverse().map((item) => ({
  ...item,
  ...frExperienceMeta[item.id as keyof typeof frExperienceMeta],
  current: item.id === 'bemprodec' || item.id === 'education-ministry',
}));

const enExperiences = [...enResume.experiences].reverse().map((item) => ({
  ...item,
  ...enExperienceMeta[item.id as keyof typeof enExperienceMeta],
  current: item.id === 'bemprodec' || item.id === 'education-ministry',
}));

const fr = {
  meta: {
    title: 'GloDi MPUTU — Software Engineer & Back-End Developer',
    description: "Portfolio professionnel de GloDi MPUTU, Software Engineer, Back-End Developer et IT Manager : applications web et de gestion, PHP, JavaScript, API REST, bases de données et systèmes d'information.",
    socialDescription: "Je conçois, développe et maintiens des applications web et des systèmes d'information adaptés aux besoins des organisations.",
    siteName: 'GloDi MPUTU — Portfolio professionnel',
    imageAlt: 'Portfolio professionnel de GloDi MPUTU',
  },
  a11y: {
    skipLink: 'Aller au contenu principal',
    mainNavigation: 'Navigation principale',
    mobileNavigation: 'Navigation mobile',
    footerNavigation: 'Navigation du pied de page',
    homeLink: 'GloDi MPUTU — Accueil',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    lightTheme: 'Activer le thème clair',
    darkTheme: 'Activer le thème sombre',
    languageMenu: 'Choisir la langue',
    languageOptions: 'Langues disponibles',
    portrait: 'Portrait professionnel de GloDi MPUTU',
    portraitFallback: 'Initiales de GloDi MPUTU',
    heroFocus: 'Domaines techniques principaux',
    contactDetails: 'Présentation de GloDi MPUTU',
    experienceDetails: 'Afficher les responsabilités',
    experienceDetailsClose: 'Masquer les responsabilités',
    projectDetails: 'Découvrir la réalisation',
    downloadResume: 'Télécharger le CV de GloDi MPUTU en français',
  },
  nav: {
    home: 'Accueil', profile: 'Profil', expertise: 'Expertise', experience: 'Expérience',
    projects: 'Réalisations', approach: 'Approche', education: 'Formation', contact: 'Contact', resume: 'CV',
  },
  languages: { active: 'FR', french: 'Français', english: 'English' },
  hero: {
    title: 'GloDi MPUTU',
    role: 'Software Engineer / Back-End Developer / IT Manager',
    intro: "Je conçois, développe et maintiens des applications web et de gestion fiables, pensées pour répondre aux besoins réels des entreprises et des institutions.",
    primaryCta: 'Découvrir mon parcours',
    secondaryCta: 'Me contacter',
    resumeCta: 'Télécharger mon CV',
    skills: ['PHP', 'JavaScript', 'API REST', 'Bases de données'],
    focusLabel: 'Ce que je prends en charge',
    focus: [
      "Développement d'applications web et de gestion",
      'Services back-end, API REST et bases de données',
      'Administration, sécurité et supervision IT',
    ],
    summary: ['Développement applicatif', 'Back-end & données', 'Systèmes & supervision'],
  },
  profile: {
    eyebrow: 'À propos',
    title: "Je développe des applications et je veille aussi aux systèmes qui les font fonctionner.",
    intro: "Mon parcours relie le développement logiciel aux responsabilités concrètes d'un service informatique.",
    body: "J'ai commencé par superviser les services informatiques chez ABD Technology. J'ai ensuite élargi mon activité au développement web et au freelance, tout en poursuivant des responsabilités d'IT Manager. Aujourd'hui, je contribue également au développement et à la maintenance d'applications dans un environnement institutionnel.",
    highlightsTitle: 'Mes domaines de travail',
    highlights: [
      'Applications web et applications de gestion',
      'Back-end, API REST et bases de données',
      'Maintenance, déploiement et sécurité des systèmes',
      'Supervision et coordination des services IT',
    ],
    languagesLabel: 'Langues',
    languages: frResume.languages,
  },
  expertise: {
    eyebrow: "Domaines d'expertise",
    title: 'Une double compétence en développement et en systèmes IT.',
    intro: "J'adapte ces compétences au contexte, aux contraintes et aux usages de chaque organisation.",
    domains: [
      {
        id: 'software-engineering', title: 'Software Engineering', eyebrow: 'Analyse & conception',
        description: "J'analyse les besoins et je structure des applications web ou de gestion autour des usages attendus.",
        competencies: ['Analyse des besoins', 'Conception de solutions', 'Applications web', 'Applications de gestion'],
        icon: 'workflow' as const,
      },
      {
        id: 'backend-development', title: 'Back-End Development', eyebrow: 'Services & données',
        description: "Je développe les services qui portent la logique métier, les données et les échanges entre applications.",
        competencies: ['PHP', 'JavaScript', 'API REST', 'Bases de données'], icon: 'braces' as const,
      },
      {
        id: 'it-management', title: 'IT Management', eyebrow: 'Exploitation & supervision',
        description: "J'assure le fonctionnement durable des plateformes et des services IT, de l'administration à la sécurité.",
        competencies: ['Administration systèmes', 'Sécurité SI', 'Maintenance', 'Déploiement', 'Supervision IT'],
        icon: 'server' as const,
      },
    ],
  },
  experience: {
    eyebrow: 'Mon Parcours',
    title: "Des services informatiques au développement d'applications institutionnelles.",
    intro: "Mon parcours s'est construit progressivement : responsabilité IT, développement web, missions freelance, management informatique puis travail sur des applications ministérielles.",
    direction: "2019 à aujourd'hui", current: 'En cours', details: 'Responsabilités', items: frExperiences,
  },
  projects: {
    eyebrow: 'Réalisations',
    title: "Quelques solutions sur lesquelles j'ai travaillé.",
    intro: 'Des applications réalisées dans différents contextes, de la gestion métier aux plateformes web collaboratives.',
    view: 'Découvrir la réalisation', close: 'Fermer la réalisation',
    context: 'Contexte', contribution: "Ce que j'ai réalisé", solution: 'La solution',
    features: 'Fonctionnalités principales', technologies: 'Technologies', screenshots: 'Aperçus',
    demo: 'Voir la démonstration', repository: 'Voir le code sur GitHub',
    openScreenshot: "Ouvrir l'aperçu en grand",
  },
  approach: {
    eyebrow: 'Ma façon de travailler',
    title: 'Une méthode claire, du besoin à la mise en service.',
    intro: "Je commence par comprendre le contexte avant de choisir et de mettre en œuvre la réponse technique.",
    steps: [
      { number: '01', title: 'Analyser', description: 'Clarifier le besoin, les utilisateurs et les contraintes.' },
      { number: '02', title: 'Concevoir', description: 'Structurer la solution, les données et les échanges.' },
      { number: '03', title: 'Développer', description: 'Réaliser les composants applicatifs et les services.' },
      { number: '04', title: 'Déployer', description: 'Préparer une mise en service maîtrisée et vérifiable.' },
      { number: '05', title: 'Superviser', description: 'Suivre le fonctionnement, la maintenance et la sécurité.' },
    ],
  },
  education: {
    eyebrow: 'Formation', title: 'Informatique de Gestion — ISP-GOMBE',
    intro: "Ma formation porte sur l'utilisation de l'informatique pour répondre aux besoins de gestion des organisations.",
    items: frResume.education,
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet.',
    intro: "Vous avez un projet, un besoin technique ou souhaitez simplement échanger ? Envoyez-moi un message.",
    asideTitle: 'Échangeons simplement',
    asideBody: "Présentez-moi votre contexte, votre besoin ou la difficulté que vous cherchez à résoudre. Je prendrai connaissance de votre message avec attention.",
    formTitle: 'Envoyez-moi un message',
    name: 'Nom', email: 'Email', organization: 'Organisation', subject: 'Sujet', message: 'Message',
    optional: 'facultatif', required: 'Champ obligatoire', submit: 'Envoyer le message', loading: 'Envoi en cours…',
    success: "Merci. Votre message a bien été reçu. Un accusé de réception vient de vous être envoyé.",
    stored: "Merci. Votre message a bien été reçu et je pourrai vous répondre à l'adresse indiquée.",
    error: "Le message n'a pas pu être transmis. Vérifiez votre connexion et réessayez.",
    rateLimited: 'Trop de tentatives ont été effectuées. Veuillez réessayer dans quelques minutes.',
    privacy: 'Vos informations servent uniquement à traiter votre demande et à vous répondre.',
    validation: {
      required: 'champ est requis.', nameLength: 'Saisissez au moins 2 caractères.',
      email: 'Saisissez une adresse email valide.', subjectLength: "Saisissez un sujet d'au moins 3 caractères.",
      messageLength: 'Décrivez votre demande en au moins 20 caractères.',
    },
  },
  footer: {
    description: 'Software Engineer / Back-End Developer / IT Manager',
    rights: 'Tous droits réservés.', backToTop: 'Retour en haut',
  },
} as const;

const en = {
  meta: {
    title: 'GloDi MPUTU — Software Engineer & Back-End Developer',
    description: 'Professional portfolio of GloDi MPUTU, Software Engineer, Back-End Developer and IT Manager working across web and business applications, PHP, JavaScript, REST APIs, databases and information systems.',
    socialDescription: 'I design, build and maintain web applications and information systems shaped around organizational needs.',
    siteName: 'GloDi MPUTU — Professional portfolio', imageAlt: 'Professional portfolio of GloDi MPUTU',
  },
  a11y: {
    skipLink: 'Skip to main content', mainNavigation: 'Main navigation',
    mobileNavigation: 'Mobile navigation', footerNavigation: 'Footer navigation',
    homeLink: 'GloDi MPUTU — Home', openMenu: 'Open menu', closeMenu: 'Close menu',
    lightTheme: 'Switch to light theme', darkTheme: 'Switch to dark theme',
    languageMenu: 'Choose language', languageOptions: 'Available languages',
    portrait: 'Professional portrait of GloDi MPUTU', portraitFallback: 'Initials of GloDi MPUTU',
    heroFocus: 'Main technical areas', contactDetails: 'About GloDi MPUTU',
    experienceDetails: 'Show responsibilities', experienceDetailsClose: 'Hide responsibilities',
    projectDetails: 'Explore the project', downloadResume: "Download GloDi MPUTU's English resume",
  },
  nav: {
    home: 'Home', profile: 'Profile', expertise: 'Expertise', experience: 'Experience',
    projects: 'Selected Work', approach: 'Approach', education: 'Education', contact: 'Contact', resume: 'Resume',
  },
  languages: { active: 'EN', french: 'Français', english: 'English' },
  hero: {
    title: 'GloDi MPUTU', role: 'Software Engineer / Back-End Developer / IT Manager',
    intro: 'I design, build and maintain reliable web and business applications shaped around the real needs of companies and institutions.',
    primaryCta: 'Explore my experience', secondaryCta: 'Contact me', resumeCta: 'Download my resume',
    skills: ['PHP', 'JavaScript', 'REST APIs', 'Databases'],
    focusLabel: 'What I take responsibility for',
    focus: [
      'Web and business application development',
      'Back-end services, REST APIs and databases',
      'IT administration, security and supervision',
    ],
    summary: ['Application development', 'Back-end & data', 'Systems & supervision'],
  },
  profile: {
    eyebrow: 'About me',
    title: 'I build applications and also look after the systems that keep them running.',
    intro: 'My background connects software development with the practical responsibilities of an IT service.',
    body: 'I began by supervising IT services at ABD Technology. I then expanded into web development and freelance work while continuing as an IT Manager. Today, I also contribute to application development and maintenance in an institutional environment.',
    highlightsTitle: 'My areas of work',
    highlights: [
      'Web and business applications',
      'Back-end services, REST APIs and databases',
      'Maintenance, deployment and systems security',
      'IT service supervision and coordination',
    ],
    languagesLabel: 'Languages', languages: enResume.languages,
  },
  expertise: {
    eyebrow: 'Areas of expertise',
    title: 'A combined background in development and IT systems.',
    intro: 'I adapt these skills to the context, constraints and working practices of each organization.',
    domains: [
      {
        id: 'software-engineering', title: 'Software Engineering', eyebrow: 'Analysis & design',
        description: 'I analyze needs and structure web or business applications around expected usage.',
        competencies: ['Needs analysis', 'Solution design', 'Web applications', 'Business applications'],
        icon: 'workflow' as const,
      },
      {
        id: 'backend-development', title: 'Back-End Development', eyebrow: 'Services & data',
        description: 'I build the services behind business logic, data and communication between applications.',
        competencies: ['PHP', 'JavaScript', 'REST APIs', 'Databases'], icon: 'braces' as const,
      },
      {
        id: 'it-management', title: 'IT Management', eyebrow: 'Operations & supervision',
        description: 'I help keep platforms and IT services running reliably, from administration through security.',
        competencies: ['Systems administration', 'Information systems security', 'Maintenance', 'Deployment', 'IT supervision'],
        icon: 'server' as const,
      },
    ],
  },
  experience: {
    eyebrow: 'Professional journey', title: 'From IT services to institutional application development.',
    intro: 'My path has developed progressively through IT responsibility, web development, freelance assignments, IT management and work on ministry applications.',
    direction: '2019 to today', current: 'Current', details: 'Responsibilities', items: enExperiences,
  },
  projects: {
    eyebrow: 'Selected Work',
    title: 'A selection of solutions I have worked on.',
    intro: 'Applications built across different contexts, from business management to collaborative web platforms.',
    view: 'Explore the project', close: 'Close project',
    context: 'Context', contribution: 'What I contributed', solution: 'The solution',
    features: 'Key features', technologies: 'Technologies', screenshots: 'Previews',
    demo: 'View the demo', repository: 'View the code on GitHub',
    openScreenshot: 'Open the full-size preview',
  },
  approach: {
    eyebrow: 'How I work', title: 'A clear process, from need to delivery.',
    intro: 'I begin by understanding the context before choosing and implementing the technical response.',
    steps: [
      { number: '01', title: 'Analyze', description: 'Clarify the need, users and constraints.' },
      { number: '02', title: 'Design', description: 'Structure the solution, data and integrations.' },
      { number: '03', title: 'Build', description: 'Implement the required components and services.' },
      { number: '04', title: 'Deploy', description: 'Prepare a controlled and verifiable release.' },
      { number: '05', title: 'Supervise', description: 'Monitor operation, maintenance and security.' },
    ],
  },
  education: {
    eyebrow: 'Education', title: 'Business Information Systems — ISP-GOMBE',
    intro: 'My education focuses on applying information technology to the management needs of organizations.',
    items: enResume.education,
  },
  contact: {
    eyebrow: 'Contact', title: "Let's discuss your project.",
    intro: 'Have a project, a technical need or simply want to talk? Send me a message.',
    asideTitle: "Let's start with the context",
    asideBody: 'Tell me about your situation, your needs or the problem you are trying to solve. I will read your message carefully.',
    formTitle: 'Send a message',
    name: 'Name', email: 'Email', organization: 'Organization', subject: 'Subject', message: 'Message',
    optional: 'optional', required: 'Required field', submit: 'Send message', loading: 'Sending…',
    success: 'Thank you. Your message has been received. A confirmation email has just been sent to you.',
    stored: 'Thank you. Your message has been received and I can reply to the email address you provided.',
    error: 'Your message could not be delivered. Check your connection and try again.',
    rateLimited: 'Too many attempts were made. Please try again in a few minutes.',
    privacy: 'Your information is used only to process your request and reply to you.',
    validation: {
      required: 'This field is required.', nameLength: 'Enter at least 2 characters.',
      email: 'Enter a valid email address.', subjectLength: 'Enter a subject of at least 3 characters.',
      messageLength: 'Describe your request in at least 20 characters.',
    },
  },
  footer: {
    description: 'Software Engineer / Back-End Developer / IT Manager',
    rights: 'All rights reserved.', backToTop: 'Back to top',
  },
} as const;

export const translations = { fr, en } as const satisfies Record<Language, typeof fr | typeof en>;
export type Translation = (typeof translations)[Language];
