# Architecture Design: Captain Cool

## Multi-Agent Orchestration Flow
The system utilizes a central orchestration workflow built with FastAPI and Google GenAI.

```mermaid
graph TD;
    A[User UI] -->|Match Situation & ID| B[FastAPI Backend];
    B --> C[Stats Analyst Agent];
    C -->|Function Call| D[Cricket API Tool];
    D -->|Real Live/Fixture Data| C;
    C --> E[Strategist Agent];
    E -->|Initial Proposal| F[Devil's Advocate Agent];
    F -->|Critique & Risks| G[Strategist Agent (Revision Phase)];
    G -->|Final Decision & Confidence| H[Commentator Agent];
    H -->|Broadcast Translation| B;
    B -->|Final Orchestrated Response| A;
```

## Tool Calling Implementation
- **API**: SportMonks Cricket API 2.0.
- **Integration**: The Stats Analyst Agent uses `gemini-2.5-flash-lite` combined with the `google-genai` native tool calling support. If a match ID is provided by the UI, it automatically retrieves real match context and fixture metadata before outputting its analysis.

## Frontend Design
The Next.js frontend implements a premium dynamic UI with 3 columns to visually showcase the "think tank" debate:
- **Left**: Match context ingestion.
- **Center**: Real-time debate timeline with staggered agent responses.
- **Right**: Final Captain's Call, confidence score bar, counterfactuals, and live commentary.
