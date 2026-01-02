import { useState } from 'react';
import { Calculator } from 'lucide-react';

const DietCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activity: '1.375',
    goal: 'maintain',
  });

  const [results, setResults] = useState<{
    bmi: string;
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  } | null>(null);

  const calculateDiet = () => {
    const age = parseFloat(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const activity = parseFloat(formData.activity);

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let calories = bmr * activity;

    if (formData.goal === 'lose') {
      calories -= 500;
    } else if (formData.goal === 'gain') {
      calories += 500;
    }

    const protein = (weight * 2).toFixed(0);
    const fats = (calories * 0.25 / 9).toFixed(0);
    const carbs = ((calories - (parseFloat(protein) * 4 + parseFloat(fats) * 9)) / 4).toFixed(0);

    setResults({
      bmi,
      calories: Math.round(calories).toString(),
      protein,
      carbs,
      fats,
    });
  };

  return (
    <section className="min-h-screen px-6 pt-32 pb-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Diet Plan Calculator
        </h2>
        <p className="text-center text-slate-400 mb-12 text-lg">
          Get personalized nutrition recommendations based on your goals
        </p>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Enter your weight"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Enter your height"
              />
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Activity Level</label>
              <select
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="1.2">Sedentary</option>
                <option value="1.375">Lightly active</option>
                <option value="1.55">Moderately active</option>
                <option value="1.725">Very active</option>
                <option value="1.9">Extremely active</option>
              </select>
            </div>

            <div>
              <label className="block text-cyan-400 font-semibold mb-3">Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="maintain">Maintain Weight</option>
                <option value="lose">Lose Weight</option>
                <option value="gain">Gain Muscle</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateDiet}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center justify-center gap-3"
          >
            <Calculator className="w-6 h-6" />
            Calculate Nutrition Plan
          </button>

          {results && (
            <div className="mt-10 bg-slate-950/60 border border-blue-500/30 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-center mb-8 text-blue-400">
                Your Nutrition Plan
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'BMI', value: results.bmi },
                  { label: 'Daily Calories', value: results.calories + ' kcal' },
                  { label: 'Protein', value: results.protein + 'g' },
                  { label: 'Carbs', value: results.carbs + 'g' },
                  { label: 'Fats', value: results.fats + 'g' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-4 border-b border-cyan-500/10 last:border-0"
                  >
                    <span className="text-slate-400 font-medium text-lg">{item.label}</span>
                    <span className="text-2xl font-bold text-blue-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DietCalculator;
