# 1. Introduction

Langraph es un framework que sirve para crear workflows y agentes usando a los LLM y sus diversas funcionalidades. Para más detalles entre lo que son las diferencias entre los workflows y agentes se pueden observar en el siguiente post de Anthropic:

[Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)

Este framework está escrito usando como base un framework muy conocido para crear sistemas utilizando modelos de lenguaje como lo es [Langchain](https://www.langchain.com/). Sin embargo, este framework está optimizado para la construcción de agentes con la capacidad de poder tener más control en los flujos de ejecución y además, otorgando a este tipo de workflows cierto control sobre este mismo haciendolo más inteligente y no solo una cadena.

Expliquemos esto un poco mejor, muchos de las formas en las que se utilizan a los modelos de lenguaje se basan en por ejemplo realizar algoritmos donde en ciertos momentos de este se utilizan ciertos LLM's para resolver una tarea en específico, ya sea haciendo un structured-output, function calling, procesando información, retrieval augmentation, etc.  ![Chain Langgraph|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img1_qydc44.png)

Sin embargo, Langgraph te ofrece la oportunidad de poder realizar estos workflows más inteligentes donde no solo los LLM's son parte de este sino que también puede tomar decisiones sobre el propio flujo de ejecución.
![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img2_pptlhi.png)

Además, este framework también nos permite controlar qué tanto control podemos darle al LLM para que pueda controlar el flujo de ejecución.

![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img3_x15ene.png)

Sin embargo, debemos de consdierar que un sistema mientra más aútonomo sea, o mayor dependencia de la toma de decisiones recae sobre el LLM, es menos confiable. 

![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img4_hs1cvn.png)

Por este motivo, Langgraph pretende cambiar este paradigma ofreciendo una estructura en la que nos permita tener este tradeoff entre autonomía y confiabilidad para tener ejecuciones más inteligentes a la para que seguras.

![image|500x500](https://res.cloudinary.com/dtpiuha91/image/upload/v1739048141/img5_i1nmsd.png)



En los siguiente blogs explicaremos sobre cómo funciona, sus casos de uso, algunos ejemplos y varios conceptos claves que nos permitirán crear sistemas complejos y autónomos.


# 2. Conceptos iniciales

Langgraph se basa en el concepto de grafos para su funcionamiento. Entonces es lógico que debemos de empezar a definir en este caso cuales son los nodos y edges, pero antes de eso, debemos de hablar de una pieza importante la cual es el `StateGraph`

## 2.1 StateGraph

El `StateGraph` es el objeto que contiene la información que pasa entre los nodos desde el inicial hasta el final. De hecho, notaremos que cada nodo y cada edge tomará como entrada este estado. 

En Python este está representado como un diccionario. Un ejemplo puede ser el siguiente

```python
from typing_extensions import TypedDict

class State(TypedDict):
    graph_state: str
```

## 2.2 Nodes

Los nodos serán funciones que toman como entrada al `StateGraph` y da como salida también un `StateGraph`. Entonces podemos verlo como una función

$$
\text{Node}:\text{StateGraph} \to \text{StateGraph}^{}
$$

Claramente dentro del nodo podemos modificar los valores que puede tener este `StateGraph`. Entonces, para ejemplos prácticos definamos esto como:

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

La principal función es la de conectar nodos. Sin embargo, veremos más adelantes que existen diversos tipos de estos. Por ahora nos enfocaremos en los edges normales cuya definición básica es conectar de forma determinística los nodos. Los podemos ver como

$$
\text{Node}_i \to \text{Edge} \to \text{Node}_j
$$

También tenemos los nodos condicionales que no solo dependen del nodo en el que se encuentren sino que también dependen de los valores de su `StateGraph`. Podemos ver esto como

$$
\{\text{Node}_i,\text{State Graph}\} \to \text{Edge} \to \{\text{Node}_j,\text{Node}_k,\text{Node}_l\}
$$

Entonces, notemos que en base al nodo y al `StateGraph`, y que además, puede ir no a un solo nodos sino a una serie de estos.

```python
import random
from typing import Literal

def decide_mood(state) -> Literal["node_2", "node_3"]:
    
    user_input = state['graph_state'] 
    
    if random.random() < 0.5:

        return "node_2"
    
    return "node_3"
```


Ahora que ya vimos los componentes escenciales para la construcción de estos sistemas, aprendamos a construirlos.

# 3. Graph Construction

Como se puede observar en el código, tenemos que definir lo que son los nodos de `START` y `END`. Estos nodos son necesarios para enteder en donde empieza y termina el flujo de nuestro grafo. 

Luego tenemos que las función de `add_node` determina los nombres de los nodos. Finalmente toda la lógica se encontrará cuando empezamos a definir los edges. Notemos que podemos tener edges determinísticos como que usamos en `add_edge(START,"node_1")` y otros determinísticos como el que tenemos en `add_conditional_edges("node_1", decide_mood)`. 

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

Ahora veremos cómo podemos ejecutar este grafo que hemos creado. Solo debemos de darle como entrada un `StateGraph` válido y con la misma estructura con la que hemos compilado

```python
graph.invoke({"graph_state":"Hi, this is Leo"})
```

A continuación podemos tener como salida lo siguiente

```
---Node 1---
---Node 2---
{'graph_state':'Hi, this is Leo.I am happy'}
```

# 4. Agent

Ahora que sabemos los conceptos básicos de cómo funciona Langgraph, vamos a construir algo más complejo e inteligente. Para esto es necesario tener nociones básicas de algunas utilidades que tienen los modelos de lenguajes. Conceptos como Function Calling, Tools y Messages. Puedes revisar estos conceptos en la documentación de Langchain

* [Function Calling](https://www.promptingguide.ai/applications/function_calling)
* [Tools](https://python.langchain.com/docs/how_to/#tools)
* [Messages](https://python.langchain.com/docs/how_to/#messages)

De manera resumida y no formal, tendremos que el Function Calling es la habilidad que tienen los modelos de lenguaje para poder ejecutar funciones que se les puede otorgar. Por ejemplo, si definimos una función que tiene el siguiente formato

```python

def multiply(a:float ,b:float):
    return str(a*b)
```

y se lo pasamos como parte de las funciones tiene disponible, entonces cuando le preguntemos cuanto es $2\times3$ este utilizará esta función para realizar los cálculos. Entonces la habilidad que tiene para detectar qué función utilizar en base al contexto es a lo que llamaremos Function Calling además de que también puede identificar cuales son los parámetros adecuados para ejecutar dicha función.

Ahora como se puede deducir, Tools se refieren a este tipo de funciones que pueden ser definidas en Langchain de diversas formas algunas con más detalle y algunas de una forma más rápida. Revisar la documentación para más detalles.

En cuestión de los mensajes, basicamente es una lista que contiene clases que tienen como atributos contenido y roles donde los roles pueden ser de User, Assistant, System y Tool. Esta lista almacena la "conversación" y le provee el contexto necesario al LLM.

---

Ahora empcemos con la implementación de nuestro agente. Este agente estará inspirado en el concepto que se propuso en el paper de [ReAct](https://react-lm.github.io/). Ya que de la forma en cómo pondremos los estados y definiremos los nodos y edges hará que nuestro agente cumpla 3 fases importantes las cuales son las de:

* Actuar: El modelo decidirá qué herramientas utilizar
* Observar: La respuesta de la herramienta será pasada al modelo
* Razonar: El modelo decidirá cual debería ser el siguiente paso, ya sea utilziar otra herramienta o pasar la respuesta de forma directa. Veamos esto con el siguiente ejemplo, haremos que nuestro modelo sea un experto haciendo cálculos, pero para esto, este usará diversas herramientas que le proporcionaremos para realizar estas operaciones básicas, pero lo interesante de esto es que el agente decide qué tipo de herramientas debe de utilizar, en qué secuencia y cuando terminar la ejecución.

## 4.1 StateGraph

En este caso nuestro StateGraph contendrá los diversos mensajes que contendrán mensajes por parte del usuario, de herramientas como respuestas del propio LLM. Podemos definirlo como

```python
from typing_extensions import TypedDict
from langchain_core.messages import AnyMessage

class MessagesState(TypedDict):
    messages: list[AnyMessage]
```

Sin embargo, como vimos antes, la salida del nodo es el nuevo valor que tendrá como salida será el nuevo StateGraph que tengamos; es decir, lo sobreescribirá. No queremos esto puesto que necesitamos que los mensajes se vayan acumulando para que el contexto de la conversación no se pierda. Entonces para solucionar esto Langgraph utiliza el concepto de los [Reducers](https://langchain-ai.github.io/langgraph/concepts/low_level/#reducers) el cual nos dará esta capacidad. Por ahora solo usaremos la siguiente definición que nos permitirá tener esta funcionalidad

```python
from typing import Annotated
from langgraph.graph.message import add_messages

class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

Ahora de esta forma cada vez que nuestro nodo nos devuelva un estado, el parte de `messages` estos se irán acumulando uno tras otro.

Sin embargo, si no queremos implementar nuestro estado y tener una versión más robusta teniendo la misma funcionalidad, podemos simplemente importar el `MessagesState` del framework
como
```python
from langgraph.graph import MessagesState
```


## 4.2 Tools

### 4.2.1 Building our tools

Definamos a nuestras herramientas de la siguiente forma. Estas serán las operaciones que nuestro modelo de lenguaje será capaz de utilizar.

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
Este es un nodo preconstruido por LangGraph, pero puedes ver más a detalle su bajo nivel en [ToolNode](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.tool_node.ToolNode). Basicamente este nodo te permite poner herramientas como una lista como atributo para que cuando el modelo decida usar una herramienta, entonces el nodo ya sepa qué herramienta escoger y devolver el resultado como mensaje de `ToolMessage` actualizando el key `messages` del StateGraph; sin embargo, esto se puede configurar también en el parámetro `messages_key` en caso el StateGraph utilice otro key para los mensajes. Revisar la documentación para más detalle, por ahora usaremos esto para hacerlo más simple y limpio.

## 4.3 Implementacion

Con todo lo previamente mencionado unamos las piezas para la implementación de este agente.

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
    # If the latest message (result) from assistant is a not a tool call -> tools_condition routes to END
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

Podemos observar cómo nuestro agente puede ejecutar varias veces las diversas herramientas en un orden tal que le permita llegar al resultado deseado. Este tipo de estructura puede ser complementado con más funcionalidades como RAG, Memory, grafos más complejos, sistemas multiagénticos, etc. Veremos estos temas en los próximos blogs.

