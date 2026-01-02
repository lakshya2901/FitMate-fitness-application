import { Dumbbell, TrendingUp, Users } from 'lucide-react';

interface HeroProps {
  showSection: (section: string) => void;
}

const Hero = ({ showSection }: HeroProps) => {
  const stats = [
    { icon: Dumbbell, number: '50+', label: 'AI-Tracked Exercises' },
    { icon: Users, number: '10K+', label: 'Active Users' },
    { icon: TrendingUp, number: '98%', label: 'Accuracy Rate' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight tracking-tight">
          FitMate
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 mb-12 font-light tracking-wide">
          Your AI-Powered Fitness Partner
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 min-w-[200px] hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
              >
                <Icon className="w-10 h-10 mx-auto mb-4 text-cyan-400" />
                <div className="text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <button
            onClick={() => showSection('exercises')}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            Start Training
          </button>
          <button
            onClick={() => showSection('features')}
            className="px-10 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
