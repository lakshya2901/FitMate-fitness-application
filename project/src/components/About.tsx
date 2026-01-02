import { Target, Eye, Cpu, Rocket } from 'lucide-react';

const aboutCards = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Democratize fitness through AI technology, making professional training accessible to everyone, everywhere',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'A world where perfect form and personalized training are available at your fingertips',
  },
  {
    icon: Cpu,
    title: 'Technology',
    description: 'MediaPipe AI, TensorFlow, Real-time pose estimation, Advanced biomechanics analysis',
  },
  {
    icon: Rocket,
    title: 'Roadmap',
    description: 'Voice commands, Social features, Nutrition tracking, Wearable integration coming soon',
  },
];

const About = () => {
  return (
    <section className="min-h-screen px-6 pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          About FitMate
        </h2>
        <p className="text-center text-slate-400 mb-16 text-lg max-w-3xl mx-auto">
          We're on a mission to revolutionize fitness with cutting-edge AI technology
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aboutCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
              >
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">{card.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
