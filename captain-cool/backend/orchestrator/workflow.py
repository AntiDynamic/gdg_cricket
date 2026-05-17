from agents.stats_analyst import analyze_match_state
from agents.strategist import propose_strategy, revise_strategy
from agents.devil_advocate import challenge_strategy
from agents.commentator import provide_commentary

def run_tactical_workflow(match_id: int | None, situation: str) -> dict:
    """
    Orchestrates the multi-agent debate and reasoning flow.
    """
    # 2. Stats analysis
    stats = analyze_match_state(situation, match_id)
    
    # 3. Strategist proposal
    proposal = propose_strategy(situation, stats)
    
    # 4. Devil's Advocate challenge
    critique = challenge_strategy(situation, stats, proposal)
    
    # 5 & 6. Strategist defense/revision and Final captain decision
    final_call_dict = revise_strategy(situation, stats, proposal, critique)
    
    # 7. Commentary explanation
    commentary = provide_commentary(situation, final_call_dict, stats)
    
    return {
        "match_situation": situation,
        "stats_analysis": stats,
        "strategist_proposal": proposal,
        "devils_advocate_challenge": critique,
        "final_captains_call": final_call_dict,
        "commentary": commentary
    }
