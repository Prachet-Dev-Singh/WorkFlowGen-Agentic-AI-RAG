from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import route_query, retrieve_documents, generate_answer, generate_summary

# 1. Initialize Graph
workflow = StateGraph(AgentState)

# 2. Add Nodes
workflow.add_node("router", route_query)
workflow.add_node("retriever", retrieve_documents)
workflow.add_node("qa_generator", generate_answer)
workflow.add_node("summary_generator", generate_summary)

# 3. Define Logic (The "Edges")
workflow.set_entry_point("retriever") # First, always get data

# After retrieval, go to router to decide what to do with the data
workflow.add_edge("retriever", "router")

# Conditional Logic: Router decides where to go next
def decide_next_step(state):
    if state["intent"] == "summary":
        return "summary_generator"
    else:
        return "qa_generator"

workflow.add_conditional_edges(
    "router",
    decide_next_step,
    {
        "summary_generator": "summary_generator",
        "qa_generator": "qa_generator"
    }
)

# Both generators end the process
workflow.add_edge("summary_generator", END)
workflow.add_edge("qa_generator", END)

# 4. Compile
app = workflow.compile()