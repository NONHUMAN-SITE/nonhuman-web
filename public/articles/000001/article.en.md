# 1. Introduction

Langraph is a framework designed to create workflows and agents using LLMs and their various functionalities. For more details on the differences between workflows and agents, you can check out the following post by Anthropic:

[Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)

This framework is built on top of a well-known framework for developing systems with language models, [Langchain](https://www.langchain.com/). However, Langraph is optimized for building agents with greater control over execution flows, allowing workflows to have a degree of intelligence rather than just being a simple sequence.

Let’s explain this in more detail. Many approaches that utilize language models rely on using LLMs at specific points in an algorithm to solve a particular task, such as generating structured output, function calling, processing information, retrieval augmentation, etc.  
![Chain Langgraph|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img1_qydc44.png)

However, Langraph provides the ability to create more intelligent workflows where LLMs are not only part of the process but can also make decisions regarding the execution flow.  
![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img2_pptlhi.png)

Additionally, this framework allows us to control how much autonomy we grant the LLM to manage the execution flow.  
![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img3_x15ene.png)

However, we must consider that the more autonomous a system is, or the more decision-making responsibility is placed on the LLM, the less reliable it becomes.  
![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img4_hs1cvn.png)

For this reason, Langraph aims to change this paradigm by offering a structure that balances autonomy and reliability, enabling both intelligent and safe executions.  
![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img5_i1nmsd.png)

In the following blogs, we will explain how it works, its use cases, some examples, and key concepts that will help us build complex and autonomous systems.

# 2. Basic Concepts

Langraph is based on the concept of graphs for its functionality. Therefore, it makes sense to start by defining what nodes and edges are. However, before doing that, we need to talk about an important component: the `StateGraph`.

## 2.1 StateGraph

The `StateGraph` is the object that contains the information passed between nodes, from the initial state to the final state. In fact, each node and edge will take this state as input.

In Python, it is represented as a dictionary. An example is shown below:

```python
from typing_extensions import TypedDict

class State(TypedDict):
    graph_state: str
```

## 2.2 Nodes

Nodes are functions that take the `StateGraph` as input and also return a `StateGraph` as output. We can represent this as a function:

$$
\text{Node}:\text{StateGraph} \to \text{StateGraph}^{}
$$

Within the node, we can modify the values of the `StateGraph`. For practical examples, let's define the following:

```python
def node_1(state):
    print("---Node 1---")
    return {"graph_state": state['graph_state'] +" I am"}

def node_2(state):
    print("---Node 2---")
    return {"graph_state": state['graph_state'] +" happy!"}

def node_3(state):
    print("---Node 3---")
    return {"graph_state": state['graph_state'] +" sad!"}
```


## 2.3 Edges

The main function is to connect nodes. However, we will see later that there are different types of edges. For now, we will focus on normal edges, whose basic definition is to deterministically connect nodes. We can visualize them as:

$$
\text{Node}_i \to \text{Edge} \to \text{Node}_j
$$

We also have conditional nodes that not only depend on the node they are in but also on the values of their StateGraph. We can represent this as:

$$
\{\text{Node}_i,\text{State Graph}\} \to \text{Edge} \to \{\text{Node}_j,\text{Node}_k,\text{Node}_l\}
$$

Thus, we note that based on the node and the StateGraph, the edge can lead not to just a single node but to a series of them.

```python
import random
from typing import Literal

def decide_mood(state) -> Literal["node_2", "node_3"]:
    
    user_input = state['graph_state'] 
    
    if random.random() < 0.5:
        return "node_2"
    
    return "node_3"
```

Now that we have seen the essential components for constructing these systems, let's learn how to build them.

# 3. Graph Construction

As observed in the code, we need to define the START and END nodes. These nodes are necessary to understand where the flow of our graph begins and ends.

Then, we see that the `add_node` function determines the names of the nodes. Finally, all logic is found when we start defining the edges. We note that we can have deterministic edges like the one used in `add_edge(START, "node_1")` and others that are conditional, like the one in `add_conditional_edges("node_1", decide_mood)`.

```python
from IPython.display import Image, display
from langgraph.graph import StateGraph, START, END

builder = StateGraph(State)
builder.add_node("node_1", node_1)
builder.add_node("node_2", node_2)
builder.add_node("node_3", node_3)

builder.add_edge(START, "node_1")
builder.add_conditional_edges("node_1", decide_mood)
builder.add_edge("node_2", END)
builder.add_edge("node_3", END)

graph = builder.compile()

display(Image(graph.get_graph().draw_mermaid_png()))
```

![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048142/img6_vu8tvv.png)

Now let's see how we can execute this graph we have created. We only need to provide a valid StateGraph as input with the same structure we compiled.

```python
graph.invoke({"graph_state": "Hi, this is Leo"})
```

The output could be as follows:

```bash
---Node 1---
---Node 2---
{'graph_state': 'Hi, this is Leo. I am happy'}
```

# 4. Agent

Now that we understand the basic concepts of how LangGraph works, let's build something more complex and intelligent. For this, it is necessary to have a basic understanding of some utilities that language models provide, such as Function Calling, Tools, and Messages. You can review these concepts in the LangChain documentation:

* [Function Calling](https://www.promptingguide.ai/applications/function_calling)
* [Tools](https://python.langchain.com/docs/how_to/#tools)
* [Messages](https://python.langchain.com/docs/how_to/#messages)

To summarize informally, Function Calling is the ability of language models to execute functions that are provided to them. For example, if we define a function with the following format:

```python
def multiply(a: float, b: float):
    return str(a * b)
```

and pass it as one of the available functions, then when we ask the model how much $2\times3$ is, it will use this function to perform the calculations. The ability to detect which function to use based on the context is what we refer to as Function Calling, along with the ability to identify the appropriate parameters for executing that function.

As can be deduced, Tools refer to these types of functions, which can be defined in LangChain in various ways—some with more detail and others in a faster manner. Check the documentation for more details.

Regarding messages, it is basically a list that contains classes with attributes like `content` and `roles`, where the roles can be User, Assistant, System, and Tool. This list stores the "conversation" and provides the necessary context to the LLM.

---

Now let's start implementing our agent. This agent will be inspired by the concept proposed in the [ReAct](https://react-lm.github.io/) paper. The way we set up the states and define the nodes and edges will make our agent follow three important phases:

* **Act**: The model decides which tools to use.
* **Observe**: The tool's response is passed to the model.
* **Reason**: The model determines what the next step should be, whether to use another tool or directly return the response.

Let's see this with the following example: we will make our model an expert in performing calculations. However, it will use various tools that we provide to perform basic operations. The interesting part is that the agent decides which tools to use, in what sequence, and when to stop execution.

## 4.1 StateGraph

In this case, our StateGraph will contain various messages, including those from the user, responses from tools, and responses from the LLM itself. We can define it as:

```python
from typing_extensions import TypedDict
from langchain_core.messages import AnyMessage

class MessagesState(TypedDict):
    messages: list[AnyMessage]
```

However, as we saw earlier, the node's output is the new value of the state, meaning it will overwrite the previous one. We don't want this since we need the messages to accumulate so that the conversation context is not lost. To solve this, LangGraph uses the concept of [Reducers](https://langchain-ai.github.io/langgraph/concepts/low_level/#reducers), which provides this capability. For now, we will use the following definition to enable this functionality:

```python
from typing import Annotated
from langgraph.graph.message import add_messages

class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

This way, each time our node returns a state, the `messages` part will accumulate one after another.

However, if we don't want to implement our own state and prefer a more robust version with the same functionality, we can simply import `MessagesState` from the framework as follows:

```python
from langgraph.graph import MessagesState
```

## 4.2 Tools

### 4.2.1 Building our tools

Let's define our tools as follows. These will be the operations that our language model will be able to use.

```python
def multiply(a: int, b: int) -> int:
    """Multiply a and b.

    Args:
        a: first int
        b: second int
    """
    return a * b

def add(a: int, b: int) -> int:
    """Adds a and b.

    Args:
        a: first int
        b: second int
    """
    return a + b

def divide(a: int, b: int) -> float:
    """Divide a and b.

    Args:
        a: first int
        b: second int
    """
    return a / b

tools = [add, multiply, divide]
```

### 4.2.2 ToolNode
This is a prebuilt node by LangGraph, but you can see more details about its low-level implementation in [ToolNode](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.ToolNode). Basically, this node allows you to set tools as a list attribute so that when the model decides to use a tool, the node already knows which tool to select and returns the result as a `ToolMessage`, updating the `messages` key of the StateGraph. However, this can also be configured using the `messages_key` parameter in case the StateGraph uses a different key for messages. Check the documentation for more details; for now, we will use this to keep it simple and clean.

## 4.3 Implementation

With everything previously mentioned, let's put the pieces together to implement this agent.

```python
from langgraph.graph import START, StateGraph
from langgraph.prebuilt import tools_condition
from langgraph.prebuilt import ToolNode
from langgraph.graph import MessagesState
from langchain_core.messages import HumanMessage, SystemMessage

llm = ChatOpenAI(model="gpt-4o")

llm_with_tools = llm.bind_tools(tools, parallel_tool_calls=False)

sys_msg = SystemMessage(content="You are a helpful assistant tasked with performing arithmetic on a set of inputs.")

def assistant(state: MessagesState):
   return {"messages": [llm_with_tools.invoke([sys_msg] + state["messages"])]}

builder = StateGraph(MessagesState)

builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "assistant")
builder.add_edge(START, "assistant")
builder.add_conditional_edges(
    "assistant",
    # If the latest message (result) from assistant is a tool call -> tools_condition routes to tools
    # If the latest message (result) from assistant is not a tool call -> tools_condition routes to END
    tools_condition,
)
builder.add_edge("tools", "assistant")
react_graph = builder.compile()
```

![image|300x300](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048142/img6_vu8tvv.png)

```python
messages = [HumanMessage(content="Add 3 and 4. Multiply the output by 2. Divide the output by 5")]
messages = react_graph.invoke({"messages": messages})
for m in messages['messages']:
    m.pretty_print()
```
```bash
================================ Human Message =================================

Add 3 and 4. Multiply the output by 2. Divide the output by 5
================================== Ai Message ==================================
Tool Calls:
  add (call_i8zDfMTdvmIG34w4VBA3m93Z)
 Call ID: call_i8zDfMTdvmIG34w4VBA3m93Z
  Args:
    a: 3
    b: 4
================================= Tool Message =================================
Name: add

7
================================== Ai Message ==================================
Tool Calls:
  multiply (call_nE62D40lrGQC7b67nVOzqGYY)
 Call ID: call_nE62D40lrGQC7b67nVOzqGYY
  Args:
    a: 7
    b: 2
================================= Tool Message =================================
Name: multiply

14
================================== Ai Message ==================================
Tool Calls:
  divide (call_6Q9SjxD2VnYJqEBXFt7O1moe)
 Call ID: call_6Q9SjxD2VnYJqEBXFt7O1moe
  Args:
    a: 14
    b: 5
================================= Tool Message =================================
Name: divide

2.8
================================== Ai Message ==================================

The final result after performing the operations \( (3 + 4) \times 2 \div 5 \) is 2.8.
```

We can observe how our agent can execute multiple tools in an order that allows it to reach the desired result. This type of structure can be complemented with additional functionalities such as RAG, Memory, more complex graphs, multi-agent systems, etc. We will explore these topics in upcoming blogs.
