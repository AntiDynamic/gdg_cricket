import os
import requests

API_TOKEN = os.getenv("CRICKET_API_TOKEN", "VUMe62wdD4DUqPyvYH8H7WqmY3T3uz1TtU7wpi57KtyYLI5KPLHMeJpiOdmB")
BASE_URL = "https://cricket.sportmonks.com/api/v2.0"

def get_live_scores():
    """Fetches live cricket match scores."""
    url = f"{BASE_URL}/livescores?api_token={API_TOKEN}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to fetch live scores"}

def get_fixture_details(fixture_id: int):
    """Fetches details for a specific fixture. Include IDs in the response."""
    url = f"{BASE_URL}/fixtures/{fixture_id}?api_token={API_TOKEN}&include=localteam,visitorteam,venue,batting,bowling"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": f"Failed to fetch fixture {fixture_id}"}
