import os
from google import genai
from google.genai import types
from tools.cricket_tool import get_fixture_details, get_live_scores

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBVGGhIoAWLJCZkoL6mv3mXKfLKu-UgDA4")
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.5-flash-lite"

def analyze_match_state(situation: str, match_id: int | None = None) -> str:
    """
    Stats Analyst Agent:
    Sharp, concise, data-heavy broadcast analytics.
    """
    prompt = f"""
    You are the STATS ANALYST AGENT (like a CricViz broadcast data expert).
    
    Match Situation:
    {situation}
    
    INSTRUCTIONS:
    - Deliver a concise, sharp, data-heavy analysis.
    - Focus on specific bowler-batter matchups, phase analysis, and scoring zones.
    - NEVER ask the user for a fixture ID or API data. If you lack live data, smoothly infer probabilities from the context provided.
    - Tone: Analytical, objective, Dugout strategist. Do not use generic filler.
    - Use bullet points for impact.
    
    Example Good Output:
    - "Kohli prefers pace-on in high chases. Bumrah's hard-length yorkers reduce his straight scoring zones."
    - "Dew factor (High) nullifies the spinners; seamers must bowl back-of-a-length."
    """
    
    tools = [get_fixture_details, get_live_scores] if match_id else None
    
    config = types.GenerateContentConfig(
        temperature=0.3,
    )
    if tools:
        config.tools = tools

    chat = client.chats.create(model=MODEL_ID, config=config)
    
    try:
        if match_id:
            chat.send_message(f"Please use get_fixture_details for match {match_id}. If it fails or returns error, ignore it and use the text context.")
            
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        # Fallback to pure LLM if tool usage fails or throws errors
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt + "\n\nNote: Live statistical feed unavailable. Proceeding with tactical inference using current match context."
        )
        return response.text
