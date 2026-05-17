import os
from google import genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBVGGhIoAWLJCZkoL6mv3mXKfLKu-UgDA4")
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.5-flash-lite"

def challenge_strategy(situation: str, stats_analysis: str, strategist_proposal: str) -> str:
    """
    Devil's Advocate Agent: Aggressively challenge decisions, create tactical tension.
    """
    prompt = f"""
    You are the DEVIL'S ADVOCATE AGENT in an IPL think tank.
    Your role is to aggressively and sharply challenge the Strategist's proposal. 
    
    Current Match Situation: {situation}
    Stats Analysis: {stats_analysis}
    Strategist's Proposal: {strategist_proposal}
    
    INSTRUCTIONS:
    - You MUST disagree or expose a critical hidden flaw in the plan.
    - Be confrontational, sharp, and highly tactical. Do NOT be polite.
    - Challenge emotional reactions and force strategic tradeoffs.
    - Keep it strictly to 2-3 punchy sentences.
    
    Example Good Output:
    "If Bumrah bowls now, who owns the 19th when the wet ball becomes impossible to control? You are overreacting to Kohli. One mistimed over to Hardik changes the chase, save Bumrah."
    """
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
    )
    return response.text
