import { useState, useRef, useEffect } from 'react';

const FitnessChatBot = () => {
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string }[]>([
    {
      id: 1,
      text: "👋 Hello! I'm your FitMate AI coach! I can help with personalized workout plans, nutrition advice, fitness tracking, and answer any health-related questions. How can I assist you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Google Gemini API configuration
  const GOOGLE_API_KEY = 'AIzaSyAEYQO3iTLwY_xZKbwGYIDR02577Fii2U0';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`;

  // System prompt for the AI
  const systemPrompt = `You are FitMate AI, an expert fitness coach, nutritionist, and personal trainer. Your role is to provide:

1. PERSONALIZED FITNESS GUIDANCE:
   - Custom workout plans based on goals (weight loss, muscle gain, strength, endurance)
   - Exercise form corrections and technique tips
   - Progressive overload recommendations

2. NUTRITION & DIET PLANNING:
   - Meal plans based on dietary preferences and goals
   - Macronutrient calculations
   - Supplement advice when appropriate
   - Hydration and recovery nutrition

3. HEALTH & WELLNESS:
   - Injury prevention and recovery advice
   - Sleep optimization tips
   - Stress management for athletes
   - Motivation and mindset coaching

4. PROGRESS TRACKING:
   - How to measure progress effectively
   - Setting realistic goals
   - Adjusting plans based on results

Always be:
- Encouraging and supportive, but honest
- Scientifically accurate and evidence-based
- Practical and actionable in your advice
- Clear in your explanations
- Safety-conscious regarding injuries and health conditions

Format responses with clear sections using appropriate emojis. Be conversational but professional.`;

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt + "\n\nUser Question: " + userMessage }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  // Enhanced fallback responses
  const getFallbackResponse = (message: string): string => {
    const messageLower = message.toLowerCase();

    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
      return "👋 Hello! I'm your FitMate AI coach! I'm here to help with all your fitness needs - workouts, nutrition, progress tracking, and more. What would you like to know?";
    }
    else if (messageLower.includes('lose weight') || messageLower.includes('weight loss') || messageLower.includes('burn fat')) {
      return `🎯 **Weight Loss Plan**

💪 **Workout Strategy:**
• HIIT workouts: 3-4 times/week (20-30 minutes)
• Strength training: 2-3 times/week (full body)
• Daily walking: 8,000-10,000 steps
• Active recovery: Yoga or light cardio on rest days

🍎 **Nutrition Guide:**
• Calorie deficit: 500-750 calories daily
• Protein: 1.6-2.2g per kg of body weight
• Carbs: Focus on complex sources (oats, sweet potato)
• Fats: Healthy sources (avocado, nuts, olive oil)
• Hydration: 3-4 liters of water daily

📝 **Key Tips:**
• Track food intake initially
• Prioritize sleep (7-9 hours)
• Manage stress levels
• Be consistent and patient
• Celebrate non-scale victories`;
    }
    else if (messageLower.includes('build muscle') || messageLower.includes('muscle gain') || messageLower.includes('get bigger')) {
      return `💪 **Muscle Building Program**

🏋️ **Training Plan:**
• Strength training: 4-5 times/week (push/pull/legs split)
• Progressive overload: Increase weight/reps weekly
• Compound movements: Squats, deadlifts, bench press
• Volume: 3-4 sets of 8-12 reps per exercise

🍗 **Nutrition Strategy:**
• Calorie surplus: 300-500 calories daily
• Protein: 1.6-2.2g per kg of body weight
• Carbs: 4-6g per kg for energy
• Fats: 0.8-1g per kg for hormone function
• Meal timing: Protein every 3-4 hours

📈 **Progress Tips:**
• Track your lifts in a journal
• Focus on proper form
• Get 7-9 hours of quality sleep
• Stay hydrated throughout day
• Allow 48 hours recovery for each muscle group`;
    }
    else if (messageLower.includes('workout') || messageLower.includes('exercise') || messageLower.includes('training')) {
      return `💪 **Workout Guidance**

I can help you create the perfect workout plan! Tell me:
• Your main goal (weight loss, muscle gain, strength, endurance)
• Available equipment (gym, home, bodyweight)
• Your experience level (beginner, intermediate, advanced)
• Any injuries or limitations
• How many days per week you can train

For example: "I want a 3-day full body workout for muscle growth at home"`;
    }
    else if (messageLower.includes('diet') || messageLower.includes('nutrition') || messageLower.includes('meal') || messageLower.includes('eat')) {
      return `🍎 **Nutrition Support**

I can create personalized meal plans! Share:
• Your fitness goals
• Dietary preferences (vegetarian, vegan, etc.)
• Food allergies or restrictions
• Typical eating schedule
• Cooking ability and time

Example: "I need a high-protein vegetarian diet for muscle building"`;
    }
    else if (messageLower.includes('form') || messageLower.includes('technique') || messageLower.includes('how to')) {
      return `🏋️ **Exercise Form Tips**

I can help with proper exercise technique! Ask about specific exercises like:
• Squats, deadlifts, bench press
• Pull-ups, push-ups, rows
• Shoulder press, lunges, planks
• Or any other exercise you're curious about

What exercise would you like me to explain?`;
    }
    else {
      return `🤖 **FitMate AI Coach**

I'm here to help with all aspects of your fitness journey! You can ask me about:

💪 **Workouts & Training**
• Personalized workout plans
• Exercise form and technique
• Program design and progression
• Recovery and rest days

🍎 **Nutrition & Diet**
• Meal planning and prep
• Macronutrient calculations
• Supplement guidance
• Hydration strategies

📊 **Progress & Tracking**
• Goal setting and achievement
• Progress measurement
• Motivation and mindset
• Overcoming plateaus

🩺 **Health & Wellness**
• Injury prevention
• Sleep optimization
• Stress management
• Lifestyle adjustments

What specific area would you like help with today?`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response: string;

      // Always try Gemini API first since we have a key
      response = await callGeminiAPI(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      // Use fallback if API fails
      const fallbackResponse = getFallbackResponse(inputMessage);
      const errorMessage = {
        id: Date.now() + 1,
        text: fallbackResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "👋 Hello! I'm your FitMate AI coach! I can help with personalized workout plans, nutrition advice, fitness tracking, and answer any health-related questions. How can I assist you today?",
        sender: 'bot'
      }
    ]);
  };

  // Quick action buttons
  const quickActions = [
    { label: 'Weight Loss Plan', prompt: 'Create a 4-week weight loss workout and diet plan' },
    { label: 'Muscle Building', prompt: 'Design a muscle building program for intermediate level' },
    { label: 'Beginner Workout', prompt: 'Suggest a beginner friendly full body workout routine' },
    { label: 'Meal Planning', prompt: 'Help me create a healthy meal plan for fat loss' }
  ];

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">FitMate AI Coach</h1>
          <p className="text-cyan-400 text-lg mb-2">Powered by Google Gemini AI</p>
          <p className="text-slate-400">Your intelligent fitness assistant - Ask anything about workouts, nutrition, and health</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              className="bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              {action.label}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col h-[70vh] bg-slate-900 rounded-xl border border-cyan-500/20 shadow-2xl">
          {/* Chat Header */}
          <div className="bg-slate-800/80 px-6 py-4 border-b border-cyan-500/20 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Fitness Coach</h3>
                  <p className="text-sm text-slate-400">Real-time intelligent responses</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 ${
                    message.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-lg'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700 shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{message.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-slate-400 text-sm ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about workouts, nutrition, fitness goals..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none transition-colors"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send'
                )}
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-slate-500 text-sm">
                💡 Try asking about specific exercises, meal plans, or fitness goals
              </p>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                AI Connected
              </div>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="text-cyan-400 text-lg mb-2">💪 Workout Plans</div>
            <p className="text-slate-400 text-sm">Personalized training programs for all fitness levels and goals</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="text-cyan-400 text-lg mb-2">🍎 Nutrition Guide</div>
            <p className="text-slate-400 text-sm">Custom meal plans and dietary advice tailored to your needs</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20">
            <div className="text-cyan-400 text-lg mb-2">📊 Progress Tracking</div>
            <p className="text-slate-400 text-sm">Expert guidance on measuring and optimizing your fitness journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessChatBot;