import { CheckCircle2 } from 'lucide-react';

const plans = [
  {
    name: 'Beginner',
    emoji: '🌱',
    description: 'Perfect for fitness newcomers',
    features: ['3 days per week', 'Full body workouts', 'Basic exercises', 'Form tutorials', '20-30 min sessions'],
  },
  {
    name: 'Intermediate',
    emoji: '💪',
    description: 'Level up your training',
    features: ['4-5 days per week', 'Split routines', 'Progressive overload', 'Advanced tracking', '30-45 min sessions'],
  },
  {
    name: 'Home Workout',
    emoji: '🏠',
    description: 'No equipment needed',
    features: ['Flexible schedule', 'Bodyweight exercises', 'Minimal space required', 'Follow-along videos', '15-30 min sessions'],
  },
  {
    name: 'Advanced',
    emoji: '⚡',
    description: 'Maximum performance',
    features: ['6 days per week', 'Specialized splits', 'Competition prep', 'Advanced analytics', '45-60 min sessions'],
  },
];

const WorkoutPlans = () => {
  return (
    <section className="min-h-screen px-6 pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Workout Plans
        </h2>
        <p className="text-center text-slate-400 mb-16 text-lg">
          Choose the perfect plan for your fitness level and goals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col"
            >
              <div className="text-6xl mb-4 text-center">{plan.emoji}</div>
              <h3 className="text-3xl font-bold text-cyan-400 mb-3 text-center">{plan.name}</h3>
              <p className="text-slate-400 mb-6 text-center">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300">
                Start Free
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkoutPlans;
