import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CommunitiesSection from './components/CommunitiesSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import FloatingSpiderman from './components/FloatingSpiderman';

export default function Home() {
  return (
    <main className="page-root">
      <Navbar />
      <FloatingSpiderman />
      <HeroSection />
      <CommunitiesSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
