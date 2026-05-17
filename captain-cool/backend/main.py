from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from orchestrator.workflow import run_tactical_workflow
from pydantic import BaseModel

app = FastAPI(title="Captain Cool - IPL Tactical Intelligence System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchState(BaseModel):
    match_id: int | None = None
    batting_team: str
    bowling_team: str
    score: str
    target: str
    overs: str
    wickets: str
    striker: str
    non_striker: str
    current_bowler: str
    pitch_type: str
    dew_factor: str
    venue: str
    custom_scenario: str

@app.post("/api/tactics")
def generate_tactics(state: MatchState):
    # Compile the structured input into a detailed situation text
    situation_text = (
        f"{state.batting_team} vs {state.bowling_team} at {state.venue}.\n"
        f"Score: {state.score}/{state.wickets} in {state.overs} overs. Target: {state.target}.\n"
        f"Batters: {state.striker} (striker), {state.non_striker} (non-striker). Bowler: {state.current_bowler}.\n"
        f"Pitch: {state.pitch_type}. Dew Factor: {state.dew_factor}.\n"
        f"Additional Context: {state.custom_scenario}"
    )
    
    result = run_tactical_workflow(state.match_id, situation_text)
    return result

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
