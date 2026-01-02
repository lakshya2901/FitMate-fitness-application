import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Exercises from './components/Exercises';
import Features from './components/Features';
import DietCalculator from './components/DietCalculator';
import WorkoutPlans from './components/WorkoutPlans';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FitnessChatBot from './components/FitnessChatBot';
import AITrainer from './components/AITrainer'; // Add this import

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
  }, [mobileMenuOpen]);

  // Handle Shopping redirect
  useEffect(() => {
    if (currentSection === 'Shopping') {
      window.location.href = "https://fit-mate-shopping.vercel.app/";
    }
  }, [currentSection]);

  const showSection = (section: string) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation
        currentSection={currentSection}
        showSection={showSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {currentSection === 'hero' && <Hero showSection={showSection} />}
      {currentSection === 'exercises' && <Exercises showSection={showSection} />}
      {currentSection === 'features' && <Features />}
      {currentSection === 'diet' && <DietCalculator />}
      {currentSection === 'workouts' && <WorkoutPlans />}
      {currentSection === 'dashboard' && <Dashboard />}
      {currentSection === 'chatbot' && <FitnessChatBot />}
      {currentSection === 'trainer' && <AITrainer showSection={showSection} />} {/* Add this line */}
      {/* Shopping redirect is handled in useEffect above */}
      {currentSection === 'about' && <About />}
      {currentSection === 'contact' && <Contact />}

      <Footer showSection={showSection} />
    </div>
  );
}

export default App;