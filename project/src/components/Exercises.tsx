import { useState, useEffect } from 'react';
import { Activity, Camera, Target, Zap } from 'lucide-react';

interface Exercise {
  name: string;
  category: string;
  description: string;
  difficulty: string;
  sets: string;
  reps: string;
  ai_supported: boolean;
}

interface AvailableExercise {
  id: string;
  name: string;
  tips: string[];
}

interface ExercisesProps {
  showSection: (section: string) => void; // Add this interface
}

const exercisesData: Exercise[] = [
  { name: 'Bicep Curl', category: 'biceps', description: 'Classic bicep builder with dumbbells', difficulty: 'beginner', sets: '3-4', reps: '8-12', ai_supported: true },
  { name: 'Hammer Curl', category: 'biceps', description: 'Neutral grip curl for biceps and forearms', difficulty: 'beginner', sets: '3', reps: '10-15', ai_supported: false },
  { name: 'Concentration Curl', category: 'biceps', description: 'Isolated bicep movement', difficulty: 'intermediate', sets: '3', reps: '8-12', ai_supported: false },
  { name: 'Tricep Dips', category: 'triceps', description: 'Bodyweight tricep builder', difficulty: 'intermediate', sets: '3-4', reps: '8-15', ai_supported: false },
  { name: 'Overhead Extension', category: 'triceps', description: 'Long head tricep focus', difficulty: 'beginner', sets: '3', reps: '10-12', ai_supported: false },
  { name: 'Shoulder Press', category: 'shoulders', description: 'Overhead press for deltoids', difficulty: 'beginner', sets: '4', reps: '8-10', ai_supported: false },
  { name: 'Lateral Raise', category: 'shoulders', description: 'Side delt isolation', difficulty: 'beginner', sets: '3', reps: '12-15', ai_supported: true },
  { name: 'Push-ups', category: 'chest', description: 'Classic chest and tricep exercise', difficulty: 'beginner', sets: '3-4', reps: '10-20', ai_supported: true },
  { name: 'Chest Press', category: 'chest', description: 'Dumbbell chest builder', difficulty: 'intermediate', sets: '4', reps: '8-12', ai_supported: false },
  { name: 'Pull-ups', category: 'back', description: 'Ultimate back builder', difficulty: 'advanced', sets: '3-4', reps: '5-12', ai_supported: false },
  { name: 'Bent Over Row', category: 'back', description: 'Back thickness builder', difficulty: 'intermediate', sets: '4', reps: '8-12', ai_supported: false },
  { name: 'Squats', category: 'quads', description: 'King of leg exercises', difficulty: 'intermediate', sets: '4', reps: '8-12', ai_supported: true },
  { name: 'Lunges', category: 'quads', description: 'Unilateral leg strength', difficulty: 'beginner', sets: '3', reps: '10-12', ai_supported: false },
  { name: 'Romanian Deadlift', category: 'hamstrings', description: 'Hamstring and glute developer', difficulty: 'intermediate', sets: '3-4', reps: '8-10', ai_supported: false },
  { name: 'Leg Curl', category: 'hamstrings', description: 'Isolated hamstring work', difficulty: 'beginner', sets: '3', reps: '12-15', ai_supported: false },
  { name: 'Hip Thrust', category: 'glutes', description: 'Glute builder', difficulty: 'intermediate', sets: '4', reps: '10-15', ai_supported: false },
  { name: 'Glute Bridge', category: 'glutes', description: 'Bodyweight glute activation', difficulty: 'beginner', sets: '3', reps: '15-20', ai_supported: false },
  { name: 'Calf Raise', category: 'calves', description: 'Calf muscle builder', difficulty: 'beginner', sets: '4', reps: '15-20', ai_supported: false },
  { name: 'Plank', category: 'core', description: 'Core stability exercise', difficulty: 'beginner', sets: '3', reps: '30-60s', ai_supported: false },
  { name: 'Russian Twist', category: 'core', description: 'Oblique strengthener', difficulty: 'intermediate', sets: '3', reps: '20-30', ai_supported: false },
];

const categories = [
  { id: 'all', label: 'All Exercises' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'triceps', label: 'Triceps' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'quads', label: 'Quads' },
  { id: 'hamstrings', label: 'Hamstrings' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'calves', label: 'Calves' },
  { id: 'core', label: 'Core' },
];

const Exercises = ({ showSection }: ExercisesProps) => { // Add showSection prop
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableExercises, setAvailableExercises] = useState<AvailableExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableExercises();
  }, []);

  const fetchAvailableExercises = async () => {
    try {
      const response = await fetch('http://localhost:8001/exercises');
      const data = await response.json();
      setAvailableExercises(data);
    } catch (error) {
      console.error('Error fetching available exercises:', error);
    }
  };

  const handleStartExercise = async (exerciseName: string) => {
    const modeMap: { [key: string]: string } = {
      'Bicep Curl': 'curl',
      'Push-ups': 'pushup',
      'Squats': 'squat',
      'Lateral Raise': 'lateral'
    };

    const mode = modeMap[exerciseName];
    if (mode) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8001/set_mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode }),
        });
        
        if (response.ok) {
          console.log(`✅ Exercise mode set to: ${mode}`);
          // Use showSection prop instead of window.location
          showSection('trainer');
        } else {
          throw new Error('Failed to set exercise mode');
        }
      } catch (error) {
        console.error('Error setting exercise mode:', error);
        alert('Failed to start exercise. Make sure the backend is running on port 8001.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('AI tracking not available for this exercise yet.');
    }
  };

  const filteredExercises =
    selectedCategory === 'all'
      ? exercisesData
      : exercisesData.filter((ex) => ex.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <section className="min-h-screen px-6 pt-32 pb-16 bg-gradient-to-br from-cyber-black via-slate-900 to-cyber-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          AI-Tracked Exercises
        </h2>
        <p className="text-center text-slate-400 mb-12 text-lg">
          Choose your focus area and start training with real-time AI feedback
        </p>


        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                  : 'bg-slate-900/50 text-slate-300 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-slate-900/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredExercises.map((exercise, index) => (
            <div
              key={index}
              className={`bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                exercise.ai_supported
                  ? 'border-cyan-400/40 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]'
                  : 'border-slate-600/40 hover:border-slate-500/60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Activity className={`w-12 h-12 ${exercise.ai_supported ? 'text-cyan-400' : 'text-slate-400'}`} />
                {exercise.ai_supported && (
                  <div className="flex items-center space-x-1 bg-cyan-500/20 px-3 py-1 rounded-full">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-semibold">AI</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white">{exercise.name}</h3>
              <p className="text-slate-400 mb-4">{exercise.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-t border-slate-600/20">
                  <span className="text-slate-500 font-medium">Difficulty</span>
                  <span className={`font-bold capitalize ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-600/20">
                  <span className="text-slate-500 font-medium">Sets</span>
                  <span className="text-blue-400 font-bold">{exercise.sets}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-600/20">
                  <span className="text-slate-500 font-medium">Reps</span>
                  <span className="text-blue-400 font-bold">{exercise.reps}</span>
                </div>
              </div>

              {exercise.ai_supported && (
                <button
                  onClick={() => handleStartExercise(exercise.name)}
                  disabled={isLoading}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Starting AI Training...' : 'Start AI Training'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-10">
          <h3 className="text-4xl font-bold text-center mb-12 text-blue-400">
            How AI Tracking Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Camera Detection', desc: 'MediaPipe AI analyzes your body position in real-time using your device camera' },
              { num: '2', title: 'Angle Tracking', desc: 'Precise joint angle measurements ensure proper form and full range of motion' },
              { num: '3', title: 'Real-Time Feedback', desc: 'Instant corrections and rep counting help you maintain perfect technique' },
              { num: '4', title: 'Progress Analytics', desc: 'Track improvements over time with detailed performance metrics and insights' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-black text-white">{step.num}</span>
                </div>
                <h4 className="text-xl font-bold text-cyan-400 mb-3">{step.title}</h4>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Exercises;