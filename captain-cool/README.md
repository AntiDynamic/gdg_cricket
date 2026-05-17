# Captain Cool - IPL Tactical Intelligence System

A multi-agent IPL captaincy strategist built for the Agentic Premier League (APL) hackathon.

## System Overview
"Captain Cool" behaves like a real T20 captain by analyzing the live match state and proposing tactical decisions. The architecture leverages a team of Gemini-powered AI agents that debate, challenge, and refine cricket strategies.

## Agents
1. **Stats Analyst Agent**: Parses the match state and cricket API data to deliver an objective statistical breakdown.
2. **Strategist Agent**: Proposes the initial tactical move using elite cricket intelligence.
3. **Devil's Advocate Agent**: Critically challenges the strategy to identify hidden risks.
4. **Commentator Agent**: Translates the final tactical reasoning into an engaging broadcast-style commentary block.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Python FastAPI, Google GenAI SDK
- **AI Layer**: Gemini 2.5 Flash Lite, Interactions API (Tool Calling)
- **External Data**: SportMonks Cricket API

## Running Locally

1. **Start Backend**:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

2. **Start Frontend**:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the APL system.
