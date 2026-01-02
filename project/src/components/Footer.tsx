interface FooterProps {
  showSection: (section: string) => void;
}

const Footer = ({ showSection }: FooterProps) => {
  const links = [
    { id: 'hero', label: 'Home' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'features', label: 'Features' },
    { id: 'chatbot', label: 'AI Coach' }, // Add this line
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  // Handle shopping click - open in new tab
  const handleShoppingClick = () => {
    window.open("https://fit-mate-shopping.vercel.app/", '_blank');
  };

  return (
    <footer className="bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/20 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => showSection(link.id)}
              className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              {link.label}
            </button>
          ))}
          {/* Shopping Link */}
          <button
            onClick={handleShoppingClick}
            className="text-slate-400 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1"
          >
            FitMate Shopping
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </button>
        </div>
        <p className="text-center text-slate-500">
          &copy; 2025 FitMate. All features free. Your AI-Powered Fitness Partner.
        </p>
      </div>
    </footer>
  );
};

export default Footer;