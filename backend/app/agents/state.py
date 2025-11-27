from typing import TypedDict, List

# This is the "Shared Memory" that gets passed between nodes
class AgentState(TypedDict):
    question: str
    document_id: int # Optional, if focusing on one doc
    context: str     # The text found in the DB
    answer: str      # The final output
    intent: str      # "summary" or "qa"