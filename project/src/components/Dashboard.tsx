import { TrendingUp, Award, Coins, Calendar } from 'lucide-react';
import { useEffect, useRef } from 'react';

const stats = [
  {
    icon: TrendingUp,
    title: 'Weekly Progress',
    data: ['5 workouts completed', '320 reps tracked', '1,850 calories burned'],
    chartData: [
      { label: 'Workouts', value: 5, color: '#06b6d4' },
      { label: 'Rest Days', value: 2, color: '#3b82f6' },
      { label: 'Missed', value: 0, color: '#1e293b' }
    ]
  },
  {
    icon: Award,
    title: 'Achievements',
    data: ['7-Day Streak', '100 Perfect Reps', 'First Workout Complete'],
    chartData: [
      { label: 'Completed', value: 8, color: '#10b981' },
      { label: 'In Progress', value: 3, color: '#f59e0b' },
      { label: 'Locked', value: 5, color: '#6b7280' }
    ]
  },
  {
    icon: Coins,
    title: 'FitTokens',
    data: ['Current Balance: 1,250', 'Earn more by completing workouts!'],
    chartData: [
      { label: 'Earned', value: 1250, color: '#f59e0b' },
      { label: 'Spent', value: 350, color: '#ef4444' },
      { label: 'Pending', value: 200, color: '#6b7280' }
    ]
  },
  {
    icon: Calendar,
    title: 'Workout Streak',
    data: ['Current: 7 days', 'Best: 21 days', 'Keep it going!'],
    chartData: [
      { label: 'Current Streak', value: 7, color: '#8b5cf6' },
      { label: 'Best Streak', value: 21, color: '#06b6d4' },
      { label: 'Remaining', value: 14, color: '#1e293b' }
    ]
  },
];

const AnimatedDonutChart = ({ data, size = 120, strokeWidth = 12 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth) / 2;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    const drawChart = (progress) => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      // Draw segments with animation
      data.forEach((item, index) => {
        const segmentAngle = (item.value / total) * 2 * Math.PI * progress;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle);
        ctx.strokeStyle = item.color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        currentAngle += segmentAngle;
      });
    };

    const animate = () => {
      progressRef.current += 0.03;
      if (progressRef.current > 1) {
        progressRef.current = 1;
        cancelAnimationFrame(animationRef.current);
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
      drawChart(progressRef.current);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, size, strokeWidth]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="transform rotate-90"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 font-bold text-lg">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </div>
          <div className="text-slate-400 text-xs">Total</div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <section className="min-h-screen px-6 pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Your Dashboard
        </h2>
        <p className="text-center text-slate-400 mb-16 text-lg">
          Track your progress and celebrate your achievements
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-cyan-400">{stat.title}</h3>
                  </div>
                  <AnimatedDonutChart data={stat.chartData} />
                </div>
                <div className="space-y-3">
                  {stat.data.map((item, idx) => (
                    <p key={idx} className="text-slate-300 text-lg">
                      {item}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stat.chartData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-400 text-sm">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;