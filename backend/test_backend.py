import requests

def test_backend():
    try:
        # Test main endpoint
        response = requests.get("http://localhost:8001")
        print(f"✅ Main endpoint: {response.status_code}")
        print(response.json())
        
        # Test exercises endpoint
        response = requests.get("http://localhost:8001/exercises")
        print(f"✅ Exercises endpoint: {response.status_code}")
        print(response.json())
        
        # Test stats endpoint
        response = requests.get("http://localhost:8001/stats")
        print(f"✅ Stats endpoint: {response.status_code}")
        print(response.json())
        
    except Exception as e:
        print(f"❌ Backend not reachable: {e}")

if __name__ == "__main__":
    test_backend()