from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import time
import math
import mediapipe as mp
import json

app = FastAPI(title="FitMate AI Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pose Detection Class
class PoseDetector():
    def __init__(self, mode=False, model_complexity=1, smooth_landmarks=True, 
                 enable_segmentation=False, smooth_segmentation=True, 
                 detectionCon=0.5, trackCon=0.5):
        self.mode = mode
        self.model_complexity = model_complexity
        self.smooth_landmarks = smooth_landmarks
        self.enable_segmentation = enable_segmentation
        self.smooth_segmentation = smooth_segmentation
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpDraw = mp.solutions.drawing_utils
        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(
            self.mode, self.model_complexity, self.smooth_landmarks,
            self.enable_segmentation, self.smooth_segmentation,
            self.detectionCon, self.trackCon)

    def findPose(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(imgRGB)
        if self.results.pose_landmarks and draw:
            self.mpDraw.draw_landmarks(img, self.results.pose_landmarks, self.mpPose.POSE_CONNECTIONS)
        return img

    def findPosition(self, img, draw=True):
        lmList = []
        if self.results.pose_landmarks:
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                h, w, _ = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 0), cv2.FILLED)
        return lmList

    def findAngle(self, img, p1, p2, p3, draw=True):
        lmList = self.findPosition(img, draw=False)
        if len(lmList) < max(p1, p2, p3):
            return None

        x1, y1 = lmList[p1][1:]
        x2, y2 = lmList[p2][1:]
        x3, y3 = lmList[p3][1:]

        angle = math.degrees(math.atan2(y3 - y2, x3 - x2) - math.atan2(y1 - y2, x1 - x2))
        if angle < 0:
            angle += 360

        if draw:
            cv2.line(img, (x1, y1), (x2, y2), (255, 255, 255), 3)
            cv2.line(img, (x3, y3), (x2, y2), (255, 255, 255), 3)
            for x, y in [(x1, y1), (x2, y2), (x3, y3)]:
                cv2.circle(img, (x, y), 10, (0, 0, 255), cv2.FILLED)
                cv2.circle(img, (x, y), 15, (0, 0, 255), 2)
            cv2.putText(img, str(int(angle)), (x2 - 50, y2 + 50),
                        cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 2)

        return angle

# Global variables
detector = PoseDetector()
count = 0
dir_flag = 0
mode = "curl"
pTime = 0
fps_value = 0
accuracy = 0
feedback = "Position yourself in frame"

# Exercise configurations
EXERCISE_CONFIGS = {
    "curl": {
        "landmarks": [12, 14, 16],
        "angle_range": (220, 330),
        "feedback_phrases": [
            "Keep elbows stationary",
            "Squeeze at the top",
            "Control the descent"
        ]
    },
    "pushup": {
        "landmarks": [11, 13, 15],
        "angle_range": (205, 240),
        "feedback_phrases": [
            "Keep body straight",
            "Go all the way down",
            "Push through chest"
        ]
    },
    "squat": {
        "landmarks": [24, 26, 28],
        "angle_range": (145, 170),
        "feedback_phrases": [
            "Chest up, knees out",
            "Go parallel or below",
            "Drive through heels"
        ]
    },
    "lateral": {
        "landmarks": [24, 12, 14],
        "angle_range": (30, 90),
        "feedback_phrases": [
            "Raise to shoulder height",
            "Control the movement",
            "Avoid swinging"
        ]
    }
}

# Request models
class ChatMessage(BaseModel):
    message: str

class ModeChange(BaseModel):
    mode: str

class ChatResponse(BaseModel):
    response: str
    tokens_used: int

# Initialize camera
cap = None

def init_camera():
    global cap
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            # Try different camera indices
            for i in range(1, 4):
                cap = cv2.VideoCapture(i)
                if cap.isOpened():
                    print(f"✅ Camera found at index {i}")
                    break
            else:
                print("❌ No camera found")
                return False
                
        cap.set(3, 1280)
        cap.set(4, 720)
        print("✅ Camera initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Camera initialization failed: {e}")
        return False

def generate_frames():
    global count, dir_flag, mode, pTime, fps_value, accuracy, feedback
    
    if cap is None or not cap.isOpened():
        print("❌ No camera available")
        # Generate a black frame with error message
        img = np.zeros((720, 1280, 3), dtype=np.uint8)
        cv2.putText(img, "CAMERA NOT AVAILABLE", (400, 360), 
                   cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
        ret, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        return
    
    while True:
        success, img = cap.read()
        if not success:
            print("⚠️ Could not read frame from camera")
            break

        try:
            img = detector.findPose(img, draw=True)
            lmList = detector.findPosition(img, draw=False)

            # Create overlay for better text readability
            overlay = img.copy()
            cv2.rectangle(overlay, (0, 0), (1280, 200), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.6, img, 0.4, 0, img)
            
            if len(lmList) > 0:
                config = EXERCISE_CONFIGS.get(mode, EXERCISE_CONFIGS["curl"])
                p1, p2, p3 = config["landmarks"]
                angle_range = config["angle_range"]
                
                angle = detector.findAngle(img, p1, p2, p3)
                
                if angle:
                    if mode in ["squat", "lateral"]:
                        per = np.interp(angle, angle_range, (100, 0))
                        bar = np.interp(angle, angle_range, (650, 100))
                    else:
                        per = np.interp(angle, angle_range, (0, 100))
                        bar = np.interp(angle, angle_range, (650, 100))

                    color = (255, 0, 255)
                    accuracy = int(per)

                    # Dynamic feedback
                    if per < 25:
                        feedback = "Get ready..."
                    elif per < 75:
                        feedback = config["feedback_phrases"][0]
                    else:
                        feedback = config["feedback_phrases"][1]

                    # Rep counting
                    if per >= 95:
                        color = (0, 255, 0)
                        if dir_flag == 0:
                            count += 0.5
                            dir_flag = 1
                            feedback = "Good rep! " + config["feedback_phrases"][2]

                    elif per <= 5:
                        color = (0, 255, 0)
                        if dir_flag == 1:
                            count += 0.5
                            dir_flag = 0

                    # Progress bar
                    cv2.rectangle(img, (1100, 100), (1175, 650), (50, 50, 50), -1)
                    cv2.rectangle(img, (1100, 100), (1175, 650), (200, 200, 200), 2)
                    
                    progress_height = int(bar)
                    for i in range(progress_height, 650):
                        alpha = (650 - i) / 550.0
                        gradient_color = (
                            int(color[0] * alpha),
                            int(color[1] * alpha),
                            int(color[2] * alpha)
                        )
                        cv2.rectangle(img, (1100, i), (1175, i+1), gradient_color, -1)
                    
                    cv2.putText(img, f'{int(per)}%', (1105, 80),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

            # UI elements
            draw_ui_elements(img)

        except Exception as e:
            print(f"❌ Error processing frame: {e}")

        # Calculate FPS
        cTime = time.time()
        fps_value = int(1 / (cTime - pTime)) if (cTime - pTime) > 0 else 0
        pTime = cTime

        # Encode and yield frame
        ret, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def draw_ui_elements(img):
    """Draw UI elements on frame"""
    # FPS
    # cv2.rectangle(img, (20, 20), (170, 80), (30, 30, 30), -1)
    # cv2.rectangle(img, (20, 20), (170, 80), (100, 100, 255), 2)
    # cv2.putText(img, f'FPS: {fps_value}', (35, 65), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (100, 100, 255), 2)

    # # Mode
    # cv2.rectangle(img, (900, 20), (1250, 80), (30, 30, 30), -1)
    # cv2.rectangle(img, (900, 20), (1250, 80), (0, 255, 255), 2)
    # cv2.putText(img, f'MODE: {mode.upper()}', (915, 65), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 2)

    # # Accuracy
    # cv2.rectangle(img, (500, 20), (750, 80), (30, 30, 30), -1)
    # cv2.rectangle(img, (500, 20), (750, 80), (255, 100, 100), 2)
    # cv2.putText(img, f'ACCURACY: {accuracy}%', (515, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 100, 100), 2)

    # # Reps
    # cv2.rectangle(img, (20, 120), (300, 200), (30, 30, 30), -1)
    # cv2.rectangle(img, (20, 120), (300, 200), (0, 255, 0), 2)
    # cv2.putText(img, f'REPS: {int(count)}', (40, 175), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)

    # # Feedback
    cv2.rectangle(img, (320, 120), (960, 200), (30, 30, 30), -1)
    cv2.rectangle(img, (320, 120), (960, 200), (255, 215, 0), 2)
    
    # Split feedback text if too long
    feedback_text = f'FEEDBACK: {feedback}'
    if len(feedback_text) > 40:
        feedback_text = feedback_text[:40] + "..."
    
    cv2.putText(img, feedback_text, (340, 175), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 215, 0), 2)

    # Title
    # cv2.rectangle(img, (1280//2 - 200, 20), (1280//2 + 200, 80), (30, 30, 30), -1)
    # cv2.rectangle(img, (1280//2 - 200, 20), (1280//2 + 200, 80), (255, 215, 0), 2)
    # cv2.putText(img, 'FITMATE AI TRAINER', (1280//2 - 180, 65), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 215, 0), 3)

@app.on_event("startup")
async def startup_event():
    print("🚀 Starting FitMate AI Backend...")
    init_camera()

@app.get("/")
async def root():
    return {
        "message": "FitMate AI Backend Running",
        "version": "1.0.0",
        "available_modes": list(EXERCISE_CONFIGS.keys()),
        "endpoints": ["/video_feed", "/chat", "/set_mode", "/stats", "/exercises"]
    }

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    user_message = message.message.lower()
    
    # Enhanced AI responses
    responses = {
        "form": "Focus on maintaining proper form throughout the movement. Keep your core engaged and move deliberately.",
        "curl": "For bicep curls, keep elbows pinned to your sides and focus on the mind-muscle connection.",
        "pushup": "Maintain a straight line from head to heels. Lower until chest nearly touches the floor.",
        "squat": "Keep chest up, knees tracking over toes. Go deep but maintain good form.",
        "lateral": "Raise arms to shoulder height with slight bend in elbows. Control the descent.",
        "diet": "Aim for protein with every meal. Stay hydrated and eat plenty of vegetables.",
        "rest": "Recovery is essential. Get 7-9 hours of sleep and allow 48 hours between working same muscle groups."
    }
    
    for key, response in responses.items():
        if key in user_message:
            return ChatResponse(response=response, tokens_used=len(user_message))
    
    return ChatResponse(
        response=f"Currently tracking {mode.replace('_', ' ')}. You've completed {int(count)} reps with {accuracy}% accuracy. Ask me about form tips!",
        tokens_used=len(user_message)
    )

@app.post("/set_mode")
async def set_mode(mode_change: ModeChange):
    global mode, count, dir_flag
    
    if mode_change.mode.lower() not in EXERCISE_CONFIGS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mode. Choose from: {', '.join(EXERCISE_CONFIGS.keys())}"
        )
    
    mode = mode_change.mode.lower()
    count = 0
    dir_flag = 0
    
    return {
        "status": "success",
        "mode": mode,
        "message": f"Switched to {mode.replace('_', ' ').upper()} mode"
    }

@app.get("/stats")
async def get_stats():
    return {
        "mode": mode,
        "reps": int(count),
        "accuracy": accuracy,
        "fps": fps_value,
        "feedback": feedback
    }

@app.get("/exercises")
async def get_exercises():
    """Get all available exercises with their configurations"""
    exercises = []
    for mode_key, config in EXERCISE_CONFIGS.items():
        exercises.append({
            "id": mode_key,
            "name": mode_key.replace('_', ' ').title(),
            "landmarks": config["landmarks"],
            "angle_range": config["angle_range"],
            "tips": config["feedback_phrases"]
        })
    return exercises

@app.on_event("shutdown")
def shutdown_event():
    if cap and cap.isOpened():
        cap.release()
    print("Camera released successfully")

if __name__ == "__main__":
    import uvicorn
    print("🌐 Starting server on http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)