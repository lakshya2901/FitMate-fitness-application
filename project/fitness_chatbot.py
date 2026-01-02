# fitness_chatbot.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import random
from typing import List, Dict
import uvicorn

app = FastAPI(title="FitMate AI ChatBot")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fitness knowledge database
FITNESS_KNOWLEDGE = {
    "workouts": {
        "weight_loss": [
            "High-Intensity Interval Training (HIIT): 30 seconds sprint, 30 seconds rest x 10 rounds",
            "Circuit Training: Jump squats (15 reps), Push-ups (12 reps), Mountain climbers (30 sec), Plank (60 sec) - 4 rounds",
            "Cardio Blast: 30 minutes running at 70-80% max heart rate",
            "Full Body Burn: Burpees (12 reps), Kettlebell swings (15 reps), Box jumps (10 reps) - 5 rounds"
        ],
        "muscle_gain": [
            "Push Day: Bench press (4x8-12), Shoulder press (4x8-12), Tricep extensions (3x12-15)",
            "Pull Day: Pull-ups (4x8-12), Bent-over rows (4x8-12), Bicep curls (3x12-15)",
            "Leg Day: Squats (4x8-12), Deadlifts (4x6-10), Lunges (3x12-15)",
            "Chest & Back: Incline press (4x8-12), Lat pulldowns (4x8-12), Chest flyes (3x12-15)"
        ],
        "strength": [
            "Powerlifting: Deadlifts (5x5), Squats (5x5), Bench press (5x5)",
            "Strength Circuit: Heavy squats (4x6), Weighted pull-ups (4x6), Military press (4x6)",
            "Progressive Overload: Focus on increasing weight each week while maintaining form"
        ],
        "endurance": [
            "Long Distance: 45-60 minutes steady-state cardio at 60-70% max heart rate",
            "Swimming: 30-45 minutes continuous laps",
            "Cycling: 60-90 minutes at moderate intensity",
            "Circuit Endurance: Bodyweight exercises with minimal rest for 30-45 minutes"
        ],
        "beginner": [
            "Full Body Starter: Bodyweight squats (3x15), Push-ups (3x10), Plank (3x30sec), Walking lunges (3x10)",
            "Basic Strength: Dumbbell press (3x12), Rows (3x12), Bodyweight squats (3x15)",
            "Foundation Building: Focus on learning proper form before increasing intensity"
        ]
    },
    "nutrition": {
        "weight_loss": [
            "Breakfast: 3 egg whites + 1 whole egg, 1/2 avocado, 1 slice whole grain toast",
            "Lunch: Grilled chicken breast (150g), large mixed greens salad with olive oil dressing",
            "Dinner: Baked salmon (150g), steamed broccoli (2 cups), quinoa (1/2 cup)",
            "Snacks: Greek yogurt, apple with almond butter, carrot sticks with hummus"
        ],
        "muscle_gain": [
            "Breakfast: Oatmeal (1 cup) with whey protein, banana, and almonds",
            "Lunch: Lean beef (200g) with sweet potato (large) and mixed vegetables",
            "Dinner: Chicken breast (200g) with brown rice (1 cup) and asparagus",
            "Post-workout: Whey protein shake with banana and oats"
        ],
        "maintenance": [
            "Balanced meals with protein, complex carbs, and healthy fats at each meal",
            "Focus on whole foods: lean proteins, whole grains, fruits, vegetables",
            "Stay hydrated with 3-4 liters of water daily"
        ],
        "vegetarian": [
            "Breakfast: Tofu scramble with vegetables and whole grain toast",
            "Lunch: Lentil soup with quinoa salad and mixed greens",
            "Dinner: Chickpea curry with brown rice and steamed vegetables",
            "Snacks: Greek yogurt, mixed nuts, protein bars"
        ],
        "high_energy": [
            "Complex carbs: Oats, sweet potatoes, brown rice, quinoa",
            "Healthy fats: Avocado, nuts, olive oil, fatty fish",
            "Lean proteins: Chicken, turkey, fish, eggs, legumes"
        ]
    },
    "goals": {
        "lose_weight": {
            "workout": "weight_loss",
            "nutrition": "weight_loss",
            "tips": ["Create calorie deficit of 500-750 daily", "Focus on protein to preserve muscle", "Stay consistent with workouts"]
        },
        "build_muscle": {
            "workout": "muscle_gain",
            "nutrition": "muscle_gain",
            "tips": ["Eat 500 calorie surplus daily", "1.6-2.2g protein per kg bodyweight", "Progressive overload in training"]
        },
        "get_stronger": {
            "workout": "strength",
            "nutrition": "muscle_gain",
            "tips": ["Focus on compound movements", "Adequate rest between sets", "Proper recovery with 7-9 hours sleep"]
        },
        "improve_endurance": {
            "workout": "endurance",
            "nutrition": "high_energy",
            "tips": ["Gradually increase workout duration", "Focus on carbohydrate intake", "Stay hydrated during workouts"]
        },
        "general_fitness": {
            "workout": "beginner",
            "nutrition": "maintenance",
            "tips": ["Start with 3-4 workouts weekly", "Focus on consistency over intensity", "Listen to your body"]
        }
    }
}

class ChatMessage(BaseModel):
    message: str
    user_data: Dict = {}

class ChatResponse(BaseModel):
    response: str
    recommendations: Dict = {}
    user_goal: str = ""

class FitnessChatBot:
    def __init__(self):
        self.user_context = {}
        self.goal_keywords = {
            'lose weight': 'lose_weight',
            'weight loss': 'lose_weight',
            'burn fat': 'lose_weight',
            'get lean': 'lose_weight',
            'build muscle': 'build_muscle',
            'gain muscle': 'build_muscle',
            'get bigger': 'build_muscle',
            'get stronger': 'get_stronger',
            'increase strength': 'get_stronger',
            'improve endurance': 'improve_endurance',
            'better stamina': 'improve_endurance',
            'get fit': 'general_fitness',
            'start fitness': 'general_fitness',
            'beginner': 'general_fitness'
        }
    
    def detect_goal(self, message: str) -> str:
        message_lower = message.lower()
        for keyword, goal in self.goal_keywords.items():
            if keyword in message_lower:
                return goal
        return ""
    
    def generate_workout_plan(self, goal: str) -> List[str]:
        workout_type = FITNESS_KNOWLEDGE["goals"][goal]["workout"]
        return random.sample(FITNESS_KNOWLEDGE["workouts"][workout_type], 2)
    
    def generate_nutrition_plan(self, goal: str) -> List[str]:
        nutrition_type = FITNESS_KNOWLEDGE["goals"][goal]["nutrition"]
        return random.sample(FITNESS_KNOWLEDGE["nutrition"][nutrition_type], 3)
    
    def get_tips(self, goal: str) -> List[str]:
        return FITNESS_KNOWLEDGE["goals"][goal]["tips"]
    
    def process_message(self, message: str, user_data: Dict) -> Dict:
        message_lower = message.lower()
        response = ""
        recommendations = {}
        user_goal = ""
        
        # Greeting detection
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'hola']):
            response = "👋 Hello! I'm your FitMate AI coach! Tell me your fitness goal (lose weight, build muscle, get stronger, improve endurance) and I'll create a personalized plan!"
        
        # Goal detection and plan generation
        elif self.detect_goal(message):
            user_goal = self.detect_goal(message)
            goal_display = user_goal.replace('_', ' ').title()
            
            workouts = self.generate_workout_plan(user_goal)
            nutrition = self.generate_nutrition_plan(user_goal)
            tips = self.get_tips(user_goal)
            
            response = f"🎯 Perfect! For your goal to **{goal_display}**, here's your personalized plan:\n\n"
            response += "💪 **WORKOUT PLAN:**\n"
            for i, workout in enumerate(workouts, 1):
                response += f"{i}. {workout}\n"
            
            response += "\n🍎 **NUTRITION PLAN:**\n"
            for i, meal in enumerate(nutrition, 1):
                response += f"{i}. {meal}\n"
            
            response += "\n📝 **KEY TIPS:**\n"
            for i, tip in enumerate(tips, 1):
                response += f"• {tip}\n"
            
            recommendations = {
                "workouts": workouts,
                "nutrition": nutrition,
                "tips": tips
            }
        
        # Specific exercise queries
        elif any(word in message_lower for word in ['exercise', 'workout', 'train']):
            response = "💪 I can help with exercises! Tell me:\n• What's your goal? (lose weight/build muscle/etc.)\n• Do you have any equipment?\n• Any injuries or limitations?"
        
        # Nutrition queries
        elif any(word in message_lower for word in ['diet', 'food', 'eat', 'nutrition', 'meal']):
            response = "🍎 Nutrition is key! Tell me:\n• Your fitness goal\n• Any dietary restrictions?\n• Current eating habits?"
        
        # Progress tracking
        elif any(word in message_lower for word in ['progress', 'track', 'results']):
            response = "📊 For tracking progress:\n• Take weekly photos\n• Measure key metrics (weight, measurements)\n• Track workout performance\n• Note how clothes fit\n• Monitor energy levels"
        
        # Motivation
        elif any(word in message_lower for word in ['motivation', 'tired', 'lazy', 'skip']):
            response = "🔥 Stay motivated! Remember:\n• Progress takes time - be patient\n• Focus on consistency over perfection\n• Celebrate small victories\n• Remember why you started\n• You've got this! 💪"
        
        # Recovery
        elif any(word in message_lower for word in ['recovery', 'rest', 'sore', 'pain']):
            response = "🛌 Recovery is crucial:\n• Aim for 7-9 hours sleep\n• Stay hydrated\n• Proper nutrition\n• Active recovery (light walks)\n• Listen to your body\n• Consider foam rolling"
        
        # Default response
        else:
            response = "🤖 I'm here to help with your fitness journey! You can ask me about:\n• Workout plans\n• Nutrition advice\n• Progress tracking\n• Motivation tips\n• Recovery strategies\n\nJust tell me your main fitness goal!"
        
        return {
            "response": response,
            "recommendations": recommendations,
            "user_goal": user_goal
        }

# Initialize chatbot
chatbot = FitnessChatBot()

@app.get("/")
async def root():
    return {
        "message": "FitMate AI ChatBot is running!",
        "endpoints": {
            "chat": "POST /chat - Send messages to the fitness chatbot",
            "health": "GET /health - Check service status"
        },
        "version": "1.0.0"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """
    Main chat endpoint for fitness coaching
    """
    try:
        result = chatbot.process_message(chat_message.message, chat_message.user_data)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fitness_chatbot"}

@app.get("/goals")
async def get_available_goals():
    """Get list of available fitness goals"""
    goals = list(FITNESS_KNOWLEDGE["goals"].keys())
    return {"available_goals": goals}

if __name__ == "__main__":
    print("🚀 Starting FitMate AI ChatBot...")
    print("📍 Access the API at: http://localhost:8000")
    print("💬 Send POST requests to: http://localhost:8000/chat")
    print("❌ Press Ctrl+C to stop the server")
    
    uvicorn.run(app, host="0.0.0.0", port=800)