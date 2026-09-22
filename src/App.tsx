import { AboutPillars } from './components/AboutPillars';
import { ContactSection } from './components/ContactSection';
import { EducationSection } from './components/EducationSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ExpertiseSection } from './components/ExpertiseSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MethodologySection } from './components/MethodologySection';
import { Navbar } from './components/Navbar';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectsSection } from './components/ProjectsSection';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { usePortfolio } from './context/ThemeLanguageContext';
import { publishedProjects } from './data/portfolioData';
import { useScrollReveal } from './hooks/useScrollReveal';

function PortfolioSite() {
  const { copy } = usePortfolio();
  useScrollReveal();

  return (
    <>
      <a className="skip-link" href="#main-content">{copy.a11y.skipLink}</a>
      <div className="site-shell">
        <Navbar />
        <main id="main-content">
          <Hero />
          <AboutPillars />
          <ExpertiseSection />
          <ExperienceTimeline />
          {publishedProjects.length > 0 && <ProjectsSection />}
          <MethodologySection />
          <EducationSection />
          <ContactSection />
        </main>
        <Footer />
        {publishedProjects.length > 0 && <ProjectDetailModal />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeLanguageProvider>
      <PortfolioSite />
    </ThemeLanguageProvider>
  );
}
