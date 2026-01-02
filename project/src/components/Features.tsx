import { Brain, BarChart3, Target, Award, Smartphone, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Pose Detection',
    description: 'Advanced MediaPipe technology tracks 33 body landmarks for precise form analysis',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Live feedback on rep count, form quality, and muscle activation',
  },
  {
    icon: Target,
    title: 'Personalized Plans',
    description: 'Custom workout routines based on your goals and fitness level',
  },
  {
    icon: Award,
    title: 'Achievement System',
    description: 'Earn rewards and track milestones as you progress',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Train anywhere with responsive design and offline capabilities',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All processing happens on your device - no video uploads required',
  },
];

const Features = () => {
  return (
    <section className="min-h-screen px-6 pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          AI Trainer Features
        </h2>
        <p className="text-center text-slate-400 mb-16 text-lg">
          Cutting-edge technology to transform your fitness journey
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group"
              >
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
