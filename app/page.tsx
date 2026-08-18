import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CommunitiesSection from './components/CommunitiesSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';

export default function Home() {
  return (
    <main className="page-root">
      <Navbar />
      <HeroSection />
      <CommunitiesSection />
      <FeaturesSection />
      <AboutSection />
    </main>
  );
}
