import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentSection: string;
  showSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Navigation = ({ currentSection, showSection, mobileMenuOpen, setMobileMenuOpen }: NavigationProps) => {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'features', label: 'Features' },
    { id: 'diet', label: 'Diet Plan' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'chatbot', label: 'AI Coach' }, // Added AI Coach
    { id: 'professionals', label: 'Experts' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
              FitMate
            </div>

            <ul className="hidden md:flex gap-8 items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => showSection(item.id)}
                    className={`font-medium transition-all duration-300 hover:text-cyan-400 ${
                      currentSection === item.id ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-slate-950/98 backdrop-blur-xl border-l border-cyan-500/30 z-50 transform transition-transform duration-300">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <X size={32} />
            </button>
            <ul className="flex flex-col gap-2 pt-24 px-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => showSection(item.id)}
                    className={`w-full text-left font-medium py-4 px-6 rounded-lg transition-all duration-300 border-l-4 ${
                      currentSection === item.id
                        ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400'
                        : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/5 border-transparent hover:border-cyan-400/50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;