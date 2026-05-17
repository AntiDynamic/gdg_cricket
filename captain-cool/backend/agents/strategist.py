import os
from google import genai
import json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBVGGhIoAWLJCZkoL6mv3mXKfLKu-UgDA4")
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

def propose_strategy(situation: str, stats_analysis: str) -> str:
    """
    Strategist Agent: Calm, pressure-aware, composed captain.
    """
    prompt = f"""
    You are the STRATEGIST AGENT (The Captain).
    Your tone is calm, composed, and highly pressure-aware.
    
    Current Match Situation:
    {situation}
    
    Stats Analyst Input:
    {stats_analysis}
    
    Propose the next tactical move in 2-3 sharp sentences. 
    Focus on game-changing moments. Do not over-explain. Act like an elite captain who knows exactly when to attack or defend.
    - ANTI-HALLUCINATION RULES: Never invent or introduce players, bowlers, fielders, or match context not provided in the match situation or stats analysis. Only use the striker, non-striker, bowler, and teams present in the provided context. Do not invent any players or squads.
    
    Example Tone: "We attack now. If the set batter survives two more overs, the game tilts permanently. Bring the current bowler back to bowl hard-lengths into the pitch."
    """
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
    )
    return response.text

def revise_strategy(situation: str, stats_analysis: str, initial_proposal: str, critique: str) -> dict:
    """
    Strategist Agent Revises strategy based on Devil's Advocate critique.
    Returns highly structured tactical JSON.
    """
    prompt = f"""
    You are the STRATEGIST AGENT (The Captain).
    You previously proposed: {initial_proposal}
    
    The Devil's Advocate challenged you aggressively: {critique}
    
    Situation: {situation}
    
    Acknowledge the critique and formulate your FINAL CAPTAIN'S CALL. This must be a structured tactical breakdown.
    - ANTI-HALLUCINATION RULES: Do not invent any players, bowlers, or squads. Only reason using players and teams present in the provided situation, stats analysis, and proposals.
    
    Format output strictly as JSON with keys:
    - next_move: string (e.g. "Bowler bowls 17th over")
    - field_setup: list of strings (e.g. ["Deep square leg", "Long-off back"])
    - tactical_goal: string (e.g. "Deny straight access")
    - key_risk: string (e.g. "Missed yorkers become slot balls")
    - why_this_works: string
    - confidence_score: integer (0-100)
    - counterfactual: string (What would happen if you listened fully to the Devil's Advocate instead)
    """
    
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )
    
    try:
        return json.loads(response.text)
    except:
        return {
            "next_move": "Maintain pressure",
            "field_setup": ["Standard T20 field"],
            "tactical_goal": "Force errors",
            "key_risk": "Execution failure",
            "why_this_works": "Matches team strengths",
            "confidence_score": 80,
            "counterfactual": "Alternative approach was deemed too risky."
        }
