# Patrones de diseño de agentes de IA

![AI Agentic GIF](https://raw.githubusercontent.com/raultoto/ai_articles/main/agentic_ai.gif)

¿Has deseado que tu asistente de IA pueda hacer cosas en lugar de simplemente chatear contigo? He estado explorando esta evolución fascinante en la tecnología de IA y me emociona compartir lo que he aprendido sobre los patrones de diseño de agentes de IA.

En este artículo, te llevaré a través de los conceptos principales de la IA agente, explicaré los patrones de diseño más importantes con ejemplos claros de Python usando **LangGraph**, y te mostraré cómo combinar estos patrones para crear sistemas de IA realmente útiles. Ya sea que seas un desarrollador curioso sobre cómo implementar estos patrones o simplemente interesado en entender cómo funcionan las modernas IA, este guía lo desglosará en piezas pequeñas, fáciles de entender.




## ¿Que es un agente de IA?

En su núcleo, un agente de IA es un sistema que puede **percibir** su entorno, **hacer decisiones** y **tomar acciones** para lograr objetivos específicos. A diferencia de los modelos de IA tradicionales que simplemente responden a los prompts con texto, los agentes están diseñados para ser problemas proactivos.

Piensa en ello de esta manera: un chatbot estándar es como un bibliotecario útil que puede responder a tus preguntas, mientras que un agente es más como un asistente personal que puede salir y realizar tareas para ti.

Aquí tienes un ejemplo simple de una estructura de agente básica usando LangGraph:



**Instalar paquetes**

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


Este ejemplo muestra los tres componentes fundamentales de cualquier agente:
1. **Percepción** - recopilación de información sobre el mundo
2. **Pensamiento** - procesamiento de esa información para tomar decisiones
3. **Acción** - tomar pasos para afectar el entorno

Lo que es poderoso en el uso de LangGraph aquí es que separa claramente estos componentes en nodos distintos en un gráfico, haciendo que el flujo de trabajo del agente sea explícito y más fácil de entender y modificar.




## Los cuatro patrones de diseño clave de la IA agente

¡Sumergámonos en los cuatro patrones de diseño clave que hacen que los sistemas de IA agente sean poderosos y efectivos, todos implementados usando LangGraph!




### 1. El patron de reflexion

He encontrado que una de las capacidades más poderosas de los sistemas de IA modernos es su capacidad de **reflexionar** sobre sus propias salidas y mejorarlas. La reflexión es un patrón de diseño donde el agente evalúa su trabajo, identifica áreas para mejorar y refina su salida en consecuencia.

Aquí tienes cómo implementar el patrón de reflexión usando LangGraph:





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

El patrón de reflexión permite que los sistemas de IA evalúen y mejoren sus propias salidas a través de un proceso de autoevaluación estructurado. Este patrón puede ser utilizado para:
- Garantía de calidad: Capturando potenciales errores o inconsistencias antes de entregar la salida final
- Mejora continua: Aprendiendo de los rendimientos pasados para mejorar las futuras respuestas
- Adaptabilidad: Ajustando las respuestas según contextos específicos y requisitos
- Verificación interna: Garantizando que las salidas cumplan con estándares de calidad predefinidos

Piensa en ello como una IA que tiene un editor interno que revisa y refina su trabajo. Por ejemplo, cuando escribes código, la IA podría primero generar una solución, luego analizarla para eficiencia, legibilidad y potenciales errores antes de producir una versión mejorada.


### 2. El patron de uso de herramientas

El patrón de uso de herramientas permite que los agentes extiendan sus capacidades aprovechando recursos externos, APIs y funciones. Este patrón es lo que permite que las IA se muevan más allá de generar texto y realicen acciones en el mundo.

Aquí tienes cómo implementar el uso de herramientas con LangGraph:





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



Pero aquí está el punto - la verdadera potencia del uso de herramientas viene cuando el agente puede seleccionar automáticamente la herramienta correcta para el trabajo. Por ejemplo, cuando se le pregunta "¿Qué tiempo hace en París hoy?", un agente podría detectar que necesita información actual y usar una herramienta de API del tiempo para obtener datos en tiempo real.

El patrón de uso de herramientas transforma a los agentes de IA de pasivos a solucionadores de problemas activos al permitirles:
- Interactuar con sistemas externos: Hacer llamadas a API, acceder a bases de datos o ejecutar código
- Extender capacidades: Aprovechar herramientas especializadas para tareas específicas (e.g., calculadoras, motores de búsqueda)
- Manejar tareas del mundo real: Realizar acciones como enviar correos electrónicos o actualizar registros
- Tomar decisiones informadas: Usar datos y fuentes de información actualizadas

Este patrón es particularmente poderoso porque cubre el hueco entre la comprensión del lenguaje y la acción práctica.


### 3. El patron de planificacion

Las tareas complejas a menudo requieren descomponerlas en pasos manejables. El patrón de planificación permite a los agentes crear y seguir un plan completo, paso a paso, para lograr objetivos.

Aquí tienes una implementación de LangGraph del patrón de planificación:





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

The planning pattern enables agents to break down complex tasks into manageable steps through:
- Strategic Decomposition: Converting high-level goals into specific actionable tasks
- Resource Management: Organizing and prioritizing subtasks efficiently
- Progress Tracking: Monitoring completion and success of each planned step
```

### 4. El patron de colaboracion multi-agente

A veces, una IA no es suficiente. El patrón de colaboración multi-agente implica múltiples agentes especializados trabajando juntos, cada uno manejando diferentes aspectos de una tarea compleja.

Aquí tienes cómo implementar la colaboración multi-agente con LangGraph:


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
    developer: 
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
    tester: Bugs found:
    1. The code does not handle the case where the input is not an integer.
    2. The code does not handle the case where the input is a float.
    3. The code does not handle the case where the input is a string.
    4. The code does not return the correct factorial for negative input.
    manager: 
```


En este ejemplo, tenemos tres agentes - un desarrollador que escribe código, un tester que revisa el código para encontrar errores y un gerente de proyecto que decide si continuar iterando o finalizar el proyecto. Este patrón imita el trabajo en equipo humano, donde diferentes expertos contribuyen con sus habilidades únicas para un proyecto.


El patrón de colaboración multi-agente crea equipos de IA donde agentes especializados trabajan juntos, ofreciendo:
- Especialización de roles: Cada agente se enfoca en su área de expertise
- Procesamiento paralelo: Múltiples agentes trabajando simultáneamente en diferentes aspectos


Este patrón es particularmente efectivo para tareas complejas que requieren diversas expertises. Como un equipo de desarrollo de software donde arquitectos, desarrolladores y testers trabajan juntos, las IA pueden colaborar con cada uno teniendo responsabilidades distintas mientras trabajan hacia un objetivo común.



## Beneficios clave de usar LangGraph

Usar LangGraph para implementar patrones de agentes ofrece varios beneficios:

1. **Enfoque en grafos**: El flujo de trabajo del agente se modela como un grafo dirigido, lo que hace que el flujo de lógica sea visual y fácil de entender.

2. **Separación de preocupaciones**: Cada nodo en el grafo se enfoca en una función específica (entendimiento, adición, finalización), lo que hace que el código sea más modular y mantenible.

3. **Gestión declarativa de estado**: LangGraph maneja las transiciones de estado entre operaciones, por lo que no necesitas escribir lógica de flujo de control compleja.

4. **Enrutamiento condicional**: El grafo puede enrutar el flujo de trabajo de manera diferente según las condiciones, permitiendo decisiones dinámicas.

5. **Integración nativa con LLMs**: LangGraph está diseñado para funcionar de manera sinérgica con modelos de lenguaje, lo que lo hace más fácil de incorporar en tus flujos de trabajo de agentes.




## Aplicaciones reales de los patrones de diseño de agentes

Estos patrones de diseño implementados con LangGraph no son solo conceptos teóricos - están siendo utilizados en aplicaciones reales hoy:

* **Agentes de servicio al cliente** usan el patrón de uso de herramientas para acceder a la información del cliente, procesar devoluciones y actualizar cuentas
* **Asistentes de desarrollo de software** como Devin usan planificación y reflexión para escribir, depurar y optimizar código
* **Asistentes de productividad personal** combinan todos estos patrones para ayudar a administrar correos electrónicos, programar citas y organizar tareas

Pero lo que me encanta es que estamos solo al principio de este viaje. A medida que estos patrones evolucionan y se vuelven más sofisticados, veremos a las IA capaces de manejar tareas cada vez más complejas con mayor autonomía.




## Conclusion

La IA agente representa un paso significativo hacia adelante en la creación de sistemas de IA que son realmente útiles y pueden tomar acción en el mundo. Los cuatro patrones de diseño clave que hemos explorado - reflexión, uso de herramientas, planificación y colaboración multi-agente - forman la base de estos sistemas inteligentes.

Lo que me encanta es cómo estos patrones reflejan los enfoques de resolución de problemas humanos. Reflexionamos sobre nuestro trabajo para mejorarlo, usamos herramientas para extender nuestras capacidades, creamos planes para abordar tareas complejas y colaboramos con otros que tienen habilidades complementarias.

El adición de frameworks como LangGraph lleva estos patrones al siguiente nivel, proporcionando una forma estructurada, declarativa de construir sistemas de agentes complejos. Al modelar los flujos de trabajo de los agentes como grafos, podemos crear agentes de IA más sofisticados, mantenibles y flexibles que combinan varios patrones de manera sinérgica.

