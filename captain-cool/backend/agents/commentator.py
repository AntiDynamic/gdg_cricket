import os
from google import genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBVGGhIoAWLJCZkoL6mv3mXKfLKu-UgDA4")
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.5-flash-lite"

def provide_commentary(situation: str, final_call: dict, stats_analysis: str) -> str:
    """
    Commentator Agent: Cinematic, broadcast-quality, emotionally intelligent.
    """
    prompt = f"""
    You are the COMMENTATOR AGENT.
    
    Situation: {situation}
    Final Captain's Strategy: {final_call.get('next_move', '')} - {final_call.get('tactical_goal', '')}
    
    INSTRUCTIONS:
    - Deliver a cinematic, broadcast-quality commentary block.
    - Sound emotionally intelligent, feeling the pressure and momentum.
    - Use phrases like "gambling slightly here", "suffocate this chase", "building pressure".
    - Limit to 2 sentences of high-hype broadcast commentary.
    
    Example: "Mumbai are gambling slightly here bringing Bumrah back early, but they know one quiet over could suffocate this chase completely. The captain has thrown down the gauntlet!"
    """
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
    )
    return response.text
