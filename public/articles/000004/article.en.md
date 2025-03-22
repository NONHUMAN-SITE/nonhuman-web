# Agentic AI Design Patterns

![AI Agentic GIF](https://raw.githubusercontent.com/raultoto/ai_articles/main/agentic_ai.gif)

Have you ever wished your AI assistant could actually *do things* instead of just chatting with you? I've been exploring this fascinating evolution in AI technology, and I'm excited to share what I've learned about agentic AI design patterns.

In this article, I'll walk you through the core concepts of agentic AI, explain the most important design patterns with clear Python examples using **LangGraph**, and show you how these patterns can be combined to create truly helpful AI systems. Whether you're a developer curious about implementing these patterns or just interested in understanding how modern AI systems work, this guide will break everything down into bite-sized, understandable pieces.


## What Is an AI Agent?

At its core, an AI agent is a system that can **perceive** its environment, **make decisions**, and **take actions** to achieve specific goals. Unlike traditional AI models that simply respond to prompts with text, agents are designed to be proactive problem-solvers.

Think of it this way: a standard chatbot is like a helpful librarian who can answer your questions, while an agent is more like a personal assistant who can go out and accomplish tasks for you.

Here's a simple example of a basic agent structure using LangGraph:



**install packages**

```python
!pip install langchain openai langchain-community langgraph langchain-openai

```

```python
from typing_extensions import TypedDict, Annotated
from typing import Any, List
from langchain_core.messages import HumanMessage, AnyMessage, SystemMessage, AIMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode  # Import ToolNode
from langgraph.graph.message import add_messages

# Define the state
class AgentState(TypedDict):
    messages: Annotated[List[AnyMessage], add_messages]


# Define the agent's functions (simplified)
def start(state: AgentState):
    """Initial node, adds a starting message."""
    # No need to use from_dict/to_dict here - LangGraph handles it
    return {"messages": [HumanMessage(content="Starting the process...")]}

def process_data(state: AgentState):
    """Simulates processing data and adding a message."""
    # LangGraph handles adding the message to the state's message list
    return {"messages": [AIMessage(content="Processing data...")]}


def check_if_done(state: AgentState):
    """Checks if the process is complete (simplified)."""
    # Check if the last message is the completion message, use explicit check
    if state["messages"] and state["messages"][-1].content == "Process complete!":
        return "end"  # Return a string indicating the end
    else:
        return "continue"  # Return a string indicating to continue


# Define condition for completion (string-based)
def should_continue(state: AgentState):
    if state["messages"][-1].content == "Process complete!":
        return "end"
    else:
        return "continue"


# --- Tool Example (Optional, but good practice) ---
def add_final_message(state: AgentState):
    """Adds a final message, simulating tool usage"""
    return {"messages" : [AIMessage(content="Process complete!")]}

# Create the state graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("start", start)
workflow.add_node("process_data", process_data)
workflow.add_node("add_final_message", add_final_message)  # Use a dedicated node

# Add edges
workflow.set_entry_point("start")
workflow.add_edge("start", "process_data")

workflow.add_conditional_edges(
    "process_data",
    should_continue, #string based decision
    {
        "continue": "add_final_message", # go back to processing.
        "end": END
    }
)
workflow.add_edge("add_final_message", END)


# Compile the graph
agent = workflow.compile()

# Run the agent
# LangGraph now expects a dictionary with the correct keys for the state
initial_state = {"messages": []}  # Initialize with an empty message list
final_state = agent.invoke(initial_state)

# Access the final state
print(f"Agent completed: {True if final_state['messages'][-1].content == 'Process complete!' else False}")  # Check final message
print(f"Messages: {final_state['messages']}")
```
```text
Agent completed: True
Messages: [HumanMessage(content='Starting the process...', additional_kwargs={}, response_metadata={}, id='ab9b2e8f-0c1b-4715-9ed9-66edc64233f2'), AIMessage(content='Processing data...', additional_kwargs={}, response_metadata={}, id='8dbab6ea-71d8-4a82-a3b9-1107c0587965'), AIMessage(content='Process complete!', additional_kwargs={}, response_metadata={}, id='22c33b1c-da5c-4cd3-a139-c67d919081e9')]
```


This example shows the three fundamental components of any agent:
1. **Perception** - gathering information about the world
2. **Thinking** - processing that information to make decisions
3. **Action** - taking steps to affect the environment

What's powerful about using LangGraph here is that it clearly separates these components into distinct nodes in a graph, making the agent's workflow explicit and easier to understand and modify.




## The Four Key Design Patterns of Agentic AI

Let's dive into the four main design patterns that make agentic AI systems powerful and effective, all implemented using LangGraph.




### 1. The Reflection Pattern

I've found that one of the most powerful capabilities of modern AI systems is their ability to **reflect** on their own outputs and improve them. Reflection is a design pattern where the agent evaluates its work, identifies areas for improvement, and refines its output accordingly.

Here's how to implement the reflection pattern using LangGraph:





```python
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from typing import TypedDict, Dict, Any

# Set up our LLM
llm = ChatOpenAI(model="gpt-4")

# Define the state using TypedDict
class ReflectionState(TypedDict):
    prompt: str
    initial_response: str
    strengths: str
    weaknesses: str
    final_response: str
    completed: bool


# Define the nodes in our reflection workflow
def generate_initial_response(state: ReflectionState) -> Dict[str, Any]:
    """Generate first draft response"""
    response = llm.invoke([
        HumanMessage(content=state["prompt"])  # Access as dictionary
    ])
    # Return a dictionary
    return {
        "initial_response": response.content,
        "prompt": state["prompt"],  # Include other fields to maintain state
        "strengths": "",
        "weaknesses": "",
        "final_response": "",
        "completed": False,
    }

def reflect_on_response(state: ReflectionState) -> Dict[str, Any]:
    """Analyze the response for strengths and weaknesses"""
    reflection = llm.invoke([
        HumanMessage(content=f"I've written this response: '{state['initial_response']}'. Please analyze it and list its strengths and weaknesses.")
    ])

    # A real implementation would parse this more carefully
    parts = reflection.content.split("Weaknesses:")
    strengths = parts[0].replace("Strengths:", "").strip()
    weaknesses = parts[1].strip() if len(parts) > 1 else ""

    # Return a dictionary
    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "initial_response": state["initial_response"], # Preserve previous state
        "prompt": state["prompt"],
        "final_response": state["final_response"],  # Could be empty string
        "completed": False,
    }

def improve_response(state: ReflectionState) -> Dict[str, Any]:
    """Generate an improved response based on reflection"""
    if not state["weaknesses"]:
        final_response = state["initial_response"]
    else:
        improved = llm.invoke([
            HumanMessage(content=f"My initial response was: '{state['initial_response']}'. Based on this feedback: '{state['weaknesses']}', please provide an improved version.")
        ])
        final_response = improved.content

     # Return a dictionary
    return {
        "final_response": final_response,
        "completed": True,
        "initial_response": state["initial_response"],  #Preserving previous state
        "prompt": state["prompt"],
        "strengths": state["strengths"],
        "weaknesses": state["weaknesses"]
    }

# Create the graph
reflection_graph = StateGraph(ReflectionState)

# Add nodes
reflection_graph.add_node("generate_initial_response", generate_initial_response)
reflection_graph.add_node("reflect_on_response", reflect_on_response)
reflection_graph.add_node("improve_response", improve_response)

# Add edges
reflection_graph.add_edge("generate_initial_response", "reflect_on_response")
reflection_graph.add_edge("reflect_on_response", "improve_response")
reflection_graph.add_edge("improve_response", END)

# Set entry point
reflection_graph.set_entry_point("generate_initial_response")

# Compile the graph
reflective_agent = reflection_graph.compile()

# Example usage
# Initialize with a dictionary, not an instance of ReflectionState
initial_state = {
    "prompt": "Explain quantum computing to a high school student",
    "initial_response": "",
    "strengths": "",
    "weaknesses": "",
    "final_response": "",
    "completed": False
}
final_state = reflective_agent.invoke(initial_state)

print("Initial response:", final_state["initial_response"][:200] + "...")
print("\nStrengths:", final_state["strengths"][:200] + "...")
print("\nWeaknesses:", final_state["weaknesses"][:200] + "...")
print("\nImproved response:", final_state["final_response"][:200] + "...")
```

```text
Initial response: Quantum computing is an advanced type of computing technology that uses the principles of quantum mechanics, a field of physics that describes the strange behavior of particles at the smallest scales....
    
Strengths: 1. It effectively simplifies a highly complex subject thus making it accessible to those without previous knowledge in quantum computing.
2. The information is well ordered, moving from a general expl...

Weaknesses: 1. The paragraph explaining superposition and entanglement might still be difficult for some audiences to parse and could use more simple examples or analogies.
2. While the text does mention the diff...
    
Improved response: Quantum computing is a new type of computing that works on principles of quantum mechanics, a field of physics. To make it simpler, let's compare it with regular computing, like the kind used in your ...
```

The reflection pattern enables AI systems to critically evaluate and improve their own outputs through a structured self-review process. This pattern can be used for:
- Quality Assurance: Catching potential errors or inconsistencies before delivering final output
- Continuous Improvement: Learning from past performance to enhance future responses
- Adaptability: Adjusting responses based on specific context and requirements
- Self-Verification: Ensuring outputs meet predefined quality standards

Think of it as an AI having an internal editor that reviews and refines its work. For example, when writing code, the AI might first generate a solution, then analyze it for efficiency, readability, and potential bugs before producing an improved version.


### 2. The Tool Use Pattern

The tool use pattern enables agents to extend their capabilities by leveraging external resources, APIs, and functions. This pattern is what allows AI systems to move beyond just generating text and actually take actions in the world.

Here's how to implement tool use with LangGraph:





```python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from typing import TypedDict, Callable, Dict, Any

# Set up our LLM
llm = ChatOpenAI(model="gpt-4")

# Define our tools as simple functions
def calculator(problem):
    """Simple calculator for math problems"""
    # In a real implementation, this would parse and solve the problem
    return f"Calculator result for '{problem}': 42"

def web_search(query):
    """Simulated web search"""
    # In a real implementation, this would call a search API
    return f"Search results for '{query}': [simulated results]"

def calendar_access(request):
    """Simulated calendar access"""
    # In a real implementation, this would interact with a calendar API
    return f"Calendar info for '{request}': [simulated calendar data]"

# Define the state using TypedDict
class ToolState(TypedDict):
    query: str
    selected_tool: str
    tool_result: str
    final_response: str
    tools: Dict[str, Callable]  # Dictionary of tool functions


# Define the nodes
def determine_tool(state: ToolState) -> Dict[str, Any]:
    """Determine which tool to use based on the query"""
    response = llm.invoke([
        SystemMessage(content="You are a helpful assistant that determines which tool to use. Choose one of: 'calculator', 'web_search', or 'calendar'."),
        HumanMessage(content=f"What tool should I use to answer this query: '{state['query']}'?")
    ])

    tool_name = response.content.strip().lower()
    # Simple matching to ensure we get a valid tool
    if "calculator" in tool_name:
        selected_tool = "calculator"
    elif "search" in tool_name or "web" in tool_name:
        selected_tool = "web_search"
    elif "calendar" in tool_name:
        selected_tool = "calendar"
    else:
        selected_tool = None

    return {
        "query": state["query"],
        "selected_tool": selected_tool,
        "tool_result": "",  # Initialize or preserve
        "final_response": "", # Initialize or preserve
        "tools": state["tools"] # Keep the tools dictionary
    }

def use_tool(state: ToolState) -> Dict[str, Any]:
    """Use the selected tool"""
    if state["selected_tool"] and state["selected_tool"] in state["tools"]:
        tool_func = state["tools"][state["selected_tool"]]
        tool_result = tool_func(state["query"])
    else:
        tool_result = "I don't have the right tool for this problem."

    return {
        "query": state["query"],
        "selected_tool": state["selected_tool"],
        "tool_result": tool_result,
        "final_response": "", # Initialize or preserve
        "tools": state["tools"]
    }


def create_response(state: ToolState) -> Dict[str, Any]:
    """Create a final response using the tool results"""
    response = llm.invoke([
        HumanMessage(content=f"Query: '{state['query']}'\nTool used: {state['selected_tool']}\nTool result: {state['tool_result']}\nPlease create a helpful response to the original query using this information.")
    ])
    return {
        "query": state["query"],
        "selected_tool": state["selected_tool"],
        "tool_result": state["tool_result"],
        "final_response": response.content,
        "tools": state["tools"]
    }

# Create the graph
tool_graph = StateGraph(ToolState)

# Add nodes
tool_graph.add_node("determine_tool", determine_tool)
tool_graph.add_node("use_tool", use_tool)
tool_graph.add_node("create_response", create_response)

# Add edges
tool_graph.add_edge("determine_tool", "use_tool")
tool_graph.add_edge("use_tool", "create_response")
tool_graph.add_edge("create_response", END)

# Set entry point
tool_graph.set_entry_point("determine_tool")

# Compile the graph
tool_agent = tool_graph.compile()

# Example usage
# Initialize with a dictionary matching ToolState
initial_state = {
    "query": "What's 125 × 37?",
    "selected_tool": "",
    "tool_result": "",
    "final_response": "",
    "tools": {
        "calculator": calculator,
        "web_search": web_search,
        "calendar": calendar_access
    }
}
final_state = tool_agent.invoke(initial_state)

print(f"Query: {final_state['query']}")
print(f"Selected tool: {final_state['selected_tool']}")
print(f"Tool result: {final_state['tool_result']}")
print(f"Final response: {final_state['final_response']}")
```

```text
Query: What's 125 × 37?
Selected tool: calculator
Tool result: Calculator result for 'What's 125 × 37?': 42
Final response: I'm sorry, but it seems there has been a mistake in the calculation. The correct answer to 125 × 37 can't be 42. Let's try the calculation again.
```


But here's the thing - the true power of tool use comes when the agent can automatically select the right tool for the job. For example, when asked "What's the weather in Paris today?", an agent might detect that it needs current information and use a weather API tool to fetch real-time data.

The tool use pattern transforms AI agents from passive responders into active problem solvers by enabling them to:
- Interact with External Systems: Making API calls, accessing databases, or executing code
- Extend Capabilities: Leveraging specialized tools for specific tasks (e.g., calculators, search engines)
- Handle Real-World Tasks: Performing actions like sending emails or updating records
- Make Informed Decisions: Using real-time data and external information sources

This pattern is particularly powerful because it bridges the gap between language understanding and practical action


### 3. The Planning Pattern

Complex tasks often require breaking things down into manageable steps. The planning pattern allows agents to create and follow a comprehensive, step-by-step plan to achieve objectives.

Here's a LangGraph implementation of the planning pattern:





```python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any

# Set up our LLM
llm = ChatOpenAI(model="gpt-4")

# Define the state using TypedDict
class PlanningState(TypedDict):
    goal: str
    current_state: str
    plan: List[str]
    current_step: int
    execution_results: List[str]
    completed: bool

# Define the nodes
def create_plan(state: PlanningState) -> Dict[str, Any]:
    """Generate a step-by-step plan to achieve the goal"""
    response = llm.invoke([
        SystemMessage(content="You are a planning assistant that creates step-by-step plans."),
        HumanMessage(content=f"Current state: {state['current_state']}\nGoal: {state['goal']}\nCreate a step-by-step plan to achieve this goal.")
    ])

    # Parse the response to extract steps
    # In a real implementation, this would be more robust
    raw_steps = response.content.split("\n")
    steps = []
    for step in raw_steps:
        if any(prefix in step for prefix in ["Step", "1.", "2.", "3.", "4."]):
            clean_step = step.strip()
            # Remove any numbering
            if ". " in clean_step:
                clean_step = clean_step.split(". ", 1)[1]
            steps.append(clean_step)

    return {
        "goal": state["goal"],
        "current_state": state["current_state"],
        "plan": steps,
        "current_step": 0,  # Initialize or preserve
        "execution_results": [],  # Initialize or preserve
        "completed": False,
    }

def execute_next_step(state: PlanningState) -> Dict[str, Any]:
    """Execute the current step in the plan"""
    if state["current_step"] < len(state["plan"]):
        current_action = state["plan"][state["current_step"]]

        # In a real implementation, this would actually perform the action
        # Here we just simulate execution
        execution_result = f"Executed: {current_action}"
        new_results = state["execution_results"] + [execution_result]  # Create new list
        new_step = state["current_step"] + 1
        completed = new_step >= len(state["plan"])

    else:
        new_results = state["execution_results"]
        new_step = state["current_step"]
        completed = True

    return {
        "goal": state["goal"],
        "current_state": state["current_state"],
        "plan": state["plan"],
        "current_step": new_step,
        "execution_results": new_results,
        "completed": completed,
    }

def check_completion(state: PlanningState) -> str:
    """Check if the plan has been completed and return string for conditional edge"""
    if state["completed"]:
        return "end"
    else:
        return "continue"


# Create the graph
planning_graph = StateGraph(PlanningState)

# Add nodes
planning_graph.add_node("create_plan", create_plan)
planning_graph.add_node("execute_next_step", execute_next_step)

# Add edges
planning_graph.add_edge("create_plan", "execute_next_step")
# Use conditional edges for looping and termination
planning_graph.add_conditional_edges(
    "execute_next_step",
    check_completion,  # String-based condition
    {
        "continue": "execute_next_step",  # Loop back
        "end": END  # Terminate
    }
)

# Set entry point
planning_graph.set_entry_point("create_plan")

# Compile the graph
planning_agent = planning_graph.compile()

# Example usage
# Initialize with a dictionary
initial_state = {
    "goal": "buy_groceries",
    "current_state": "at_home",
    "plan": [],
    "current_step": 0,
    "execution_results": [],
    "completed": False
}
final_state = planning_agent.invoke(initial_state)

print(f"Goal: {final_state['goal']}")
print(f"Plan:")
for i, step in enumerate(final_state['plan']):
    print(f"{i+1}. {step}")
print(f"\nExecution results:")
for result in final_state['execution_results']:
    print(f"- {result}")
```
```text
Goal: buy_groceries
Plan:
1. Make a List: Write down a list of all the groceries you need to buy. This will help you stay organized, save time, and avoid purchasing unnecessary items.
2. Dress Appropriately: Ensure you are dressed for the weather and in comfortable attire for shopping.
3. Take Reusable Bags: Environmentally friendly option is to use reusable grocery bags. Collect them from your home before you leave.
4. Check Cash/Card: Ensure you have enough cash or your credit/debit card with you for the purchase.
5. Return Cart: Return the shopping cart/basket to its designated area.
6. Drive/Return Home: Drive or use your chosen mode of transportation to return home.
7. Unpack Groceries: Once you're home, unpack your groceries and store them in their designated spots in your kitchen.

Execution results:
- Executed: Make a List: Write down a list of all the groceries you need to buy. This will help you stay organized, save time, and avoid purchasing unnecessary items.
- Executed: Dress Appropriately: Ensure you are dressed for the weather and in comfortable attire for shopping.
- Executed: Take Reusable Bags: Environmentally friendly option is to use reusable grocery bags. Collect them from your home before you leave.
- Executed: Check Cash/Card: Ensure you have enough cash or your credit/debit card with you for the purchase.
- Executed: Return Cart: Return the shopping cart/basket to its designated area.
- Executed: Drive/Return Home: Drive or use your chosen mode of transportation to return home.
- Executed: Unpack Groceries: Once you're home, unpack your groceries and store them in their designated spots in your kitchen.
```

The planning pattern enables agents to break down complex tasks into manageable steps through:
- Strategic Decomposition: Converting high-level goals into specific actionable tasks
- Resource Management: Organizing and prioritizing subtasks efficiently
- Progress Tracking: Monitoring completion and success of each planned step


### 4. The Multi-Agent Collaboration Pattern




Sometimes, one agent isn't enough. The multi-agent collaboration pattern involves multiple specialized agents working together, each handling different aspects of a complex task.

Here's how to implement multi-agent collaboration with LangGraph:





```python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END, START
from typing import TypedDict, List, Dict, Any, Callable

# Set up LLMs for different agent roles
# Using gpt-3.5-turbo for faster and cheaper iterations during development.
# Switch to gpt-4 for final testing and production.
developer_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)
tester_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.5)
manager_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2)

# Define the state using TypedDict
class TeamState(TypedDict):
    specification: str
    code: str
    test_results: str
    bugs: List[str]
    iteration: int
    max_iterations: int
    summary: str
    messages: List[Dict[str, str]]
    last_action: str  # Track the last executed node


# Define the nodes for each agent
def developer_agent(state: TeamState) -> Dict[str, Any]:
    """Developer writes code based on spec"""
    if state["iteration"] == 0:  # First iteration
        messages = [
            SystemMessage(content="You are an expert software developer.  Write concise, high-quality code."),
            HumanMessage(content=f"Write code for this specification: {state['specification']}")
        ]
    else:  # Subsequent iterations, include bugs
        messages = [
            SystemMessage(content="You are an expert software developer. Focus on fixing the identified bugs."),
            HumanMessage(content=f"Rewrite this code to fix these bugs: {state['bugs']}\n\nOriginal code:\n{state['code']}\n\nSpecification: {state['specification']}")
        ]
    response = developer_llm.invoke(messages)

    return {
        "specification": state["specification"],
        "code": response.content,
        "test_results": state["test_results"],
        "bugs": state["bugs"],
        "iteration": state["iteration"] + 1,
        "max_iterations": state["max_iterations"],
        "summary": state.get("summary", ""),
        "messages": state["messages"] + [{"role": "developer", "content": response.content}],
        "last_action": "developer"
    }

def tester_agent(state: TeamState) -> Dict[str, Any]:
    """Tester checks code for bugs"""
    response = tester_llm.invoke([
        SystemMessage(content="You are a thorough QA tester. Be concise and only list bugs, not explanations."),
        HumanMessage(content=f"Test this code against this specification. Identify and list ANY bugs:\n\nSpecification: {state['specification']}\n\nCode:\n{state['code']}")
    ])

    test_results = response.content
    # Improved bug parsing: more robust and less prone to false positives
    bugs = []
    if "no bugs found" not in test_results.lower():
        for line in test_results.splitlines():
            line = line.strip()
            if line and not line.lower().startswith("test"): # Avoid lines starting with "test"
                bugs.append(line)
    return {
        "specification": state["specification"],
        "code": state["code"],
        "test_results": test_results,
        "bugs": bugs,
        "iteration": state["iteration"],
        "max_iterations": state["max_iterations"],
        "summary": state.get("summary", ""),
        "messages": state["messages"] + [{"role": "tester", "content": test_results}],
        "last_action": "tester"
    }

def project_manager(state: TeamState) -> Dict[str, Any]:
    """Project manager makes decisions about the project"""
    # Determine if we're done
    if not state["bugs"] or state["iteration"] >= state["max_iterations"]:
        messages = [
            SystemMessage(content="You are a project manager providing a final review. Be concise."),
            HumanMessage(content=f"Specification: {state['specification']}\n\nFinal code: {state['code']}\n\nTest results: {state['test_results']}\n\nProvide a brief project summary.")
        ]
        response = manager_llm.invoke(messages)
        summary = response.content
    else:
        summary =  "" # No summary until completion

    return {
        "specification": state["specification"],
        "code": state["code"],
        "test_results": state["test_results"],
        "bugs": state["bugs"],
        "iteration": state["iteration"],
        "max_iterations": state["max_iterations"],
        "summary": summary,
        "messages": state["messages"] + [{"role": "manager", "content": summary}],
        "last_action": "manager"
    }

# Define conditions for routing (string-based)
def should_continue(state: TeamState) -> str:
     # Check for an infinite loop and add a safeguard
    if state["bugs"] and state["iteration"] < state["max_iterations"] and state["last_action"] != "manager":
        return "continue"
    else:
        return "end"


# Create the graph
team_graph = StateGraph(TeamState)

# Add nodes
team_graph.add_node("developer", developer_agent)
team_graph.add_node("tester", tester_agent)
team_graph.add_node("manager", project_manager)


# Add edges
team_graph.set_entry_point("developer")
team_graph.add_edge("developer", "tester")
team_graph.add_conditional_edges(
    "tester",
    should_continue,
    {
        "continue": "manager",
        "end": "manager",  # Always go to manager, even if ending
    }
)
team_graph.add_conditional_edges(
    "manager",
    should_continue,
    {
        "continue": "developer",
        "end": END
    }
)


# Compile the graph
team_agent = team_graph.compile()

# Example usage
initial_state = {
    "specification": "Create a function that calculates the factorial of a number, handling edge cases like negative input.",
    "code": "",
    "test_results": "",
    "bugs": [],
    "iteration": 0,
    "max_iterations": 3,  # Reduced for faster testing
    "summary": "",
    "messages": [],
    "last_action": "" # Initialize last action
}
final_state = team_agent.invoke(initial_state)

print(f"Specification: {final_state['specification']}")
print(f"Final code (after {final_state['iteration']} iterations):")
print(final_state['code'])
print(f"\nTest results: {final_state['test_results']}")
print(f"\nBugs: {final_state['bugs']}")
print(f"\nManager summary: {final_state['summary']}")
print("\n--- Message Log ---")
for msg in final_state['messages']:
    print(f"{msg['role']}: {msg['content']}")
```
```text
    Specification: Create a function that calculates the factorial of a number, handling edge cases like negative input.
    Final code (after 1 iterations):
    ```python
    def factorial(n):
        if n < 0:
            return None  # Return None for negative input
        if n == 0:
            return 1  # Factorial of 0 is 1
        result = 1
        for i in range(1, n + 1):
            result *= i
        return result
    ```  
    
    Test results: Bugs found:
    1. The code does not handle the case where the input is not an integer.
    2. The code does not handle the case where the input is a float.
    3. The code does not handle the case where the input is a string.
    4. The code does not return the correct factorial for negative input.
    
    Bugs: ['Bugs found:', '1. The code does not handle the case where the input is not an integer.', '2. The code does not handle the case where the input is a float.', '3. The code does not handle the case where the input is a string.', '4. The code does not return the correct factorial for negative input.']
    
    Manager summary: 
    
    --- Message Log ---
    developer: ```python
    def factorial(n):
        if n < 0:
            return None  # Return None for negative input
        if n == 0:
            return 1  # Factorial of 0 is 1
        result = 1
        for i in range(1, n + 1):
            result *= i
        return result
    ```  
    tester: Bugs found:
    1. The code does not handle the case where the input is not an integer.
    2. The code does not handle the case where the input is a float.
    3. The code does not handle the case where the input is a string.
    4. The code does not return the correct factorial for negative input.
    manager: 
```


In this example, we have three agents - a developer who writes code, a tester who checks the code for bugs, and a project manager who decides whether to continue iterating or finalize the project. This pattern mimics human teamwork, where different experts contribute their unique skills to a project.


The multi-agent collaboration pattern creates AI teams where specialized agents work together, offering:
- Role Specialization: Each agent focuses on its area of expertise
- Parallel Processing: Multiple agents working simultaneously on different aspects


This pattern is particularly effective for complex tasks that require diverse expertise. Like a software development team where architects, developers, and testers work together, AI agents can collaborate with each having distinct responsibilities while working toward a common goal.



## Key Benefits of Using LangGraph

Using LangGraph for implementing agentic patterns offers several advantages:

1. **Graph-based Approach**: The entire agent workflow is modeled as a directed graph, making the logic flow visual and easy to understand.

2. **Separation of Concerns**: Each node in the graph focuses on a specific function (understanding, adding, completing), making the code more modular and maintainable.

3. **Declarative State Management**: LangGraph handles state transitions between operations, so you don't need to write complex control flow logic.

4. **Conditional Routing**: The graph can route the workflow differently based on conditions, allowing for dynamic decision-making.

5. **Built-in Integration with LLMs**: LangGraph is designed to work seamlessly with language models, making it easier to incorporate them into your agent workflows.




## Real-World Applications of Agentic Design Patterns

These design patterns implemented with LangGraph aren't just theoretical concepts - they're being used in real-world applications today:

* **Customer service agents** use tool-calling to access customer information, process returns, and update accounts
* **Software development assistants** like Devin use planning and reflection to write, debug, and optimize code
* **Personal productivity assistants** combine all these patterns to help manage emails, schedule appointments, and organize tasks

But here's what I find most exciting: we're just at the beginning of this journey. As these patterns evolve and become more sophisticated, we'll see AI agents capable of handling increasingly complex tasks with greater autonomy.


## Conclusion

Agentic AI represents a significant step forward in creating AI systems that are truly helpful and can take action in the world. The four key design patterns we've explored - reflection, tool use, planning, and multi-agent collaboration - form the foundation of these intelligent systems.

What I find most fascinating is how these patterns mirror human problem-solving approaches. We reflect on our work to improve it, use tools to extend our capabilities, create plans to tackle complex tasks, and collaborate with others who have complementary skills.

The addition of frameworks like LangGraph takes these patterns to the next level, providing a structured, declarative way to build complex agent systems. By modeling agent workflows as graphs, we can create more sophisticated, maintainable, and flexible AI agents that combine multiple patterns seamlessly.