# 1. Policy Gradient Methods

En este artículo hablaremos sobre los métodos conocidos como *Policy Gradient Methods* y su importante resultado teórico, el *Policy Gradient Theorem*. Este artículo está relacionado con *Reinforcement Learning*. Para una introducción rápida al tema, recomendamos leer el siguiente [post de Lilian Weng](https://lilianweng.github.io/posts/2018-04-08-policy-gradient/).

Varios métodos clásicos de *Reinforcement Learning* se basan en aprender la función de valor de acción $Q(s,a)$ y, a partir de esta, derivar su política $\pi$. Es decir, sin esta función, la política no puede ser encontrada. Sin embargo, los *policy gradient methods* adoptan otro enfoque: en lugar de calcular $Q(s,a)$ y luego estimar la política, parametrizamos directamente la política como $\pi_{\theta}(a,s)$. De esta manera, el problema se transforma en aprender los parámetros $\theta$. Aun así, la función de valor $V(s)$ puede utilizarse para mejorar la política parametrizada como se puede ver en métodos de actor-critic.

Estos métodos buscan estimar los parámetros $\theta$ para incrementar el valor de $J(\theta)$, donde:

$$
J(\theta) = \mathbb{E}_{\tau \sim \pi}[R(\tau)]
$$

Aquí, $\tau$ representa las trayectorias generadas por la política. Entonces, el objetivo es actualizar los parámetros de tal forma que maximicemos $J(\theta)$. Para ello, realizamos un ascenso por gradiente:

$$
\theta_{t+1} = \theta_t + \alpha \nabla_{\theta} J(\theta_t)
$$

Todos los métodos que siguen este esquema general se denominan *policy gradient methods*, independientemente de si requieren o no aprender también una aproximación de la función de valor $V(s)$.

## 2.1 Ventajas

El uso de estos métodos presenta varias ventajas. En primer lugar, su representación es altamente versátil, siempre que $\pi(a,s)$ sea diferenciable. Además, se integran fácilmente en espacios continuos, a diferencia de otros métodos que requieren discretización. También tienen la capacidad de aproximar una política determinista, a diferencia de los métodos $\epsilon$-greedy.

> Las políticas $\epsilon$-greedy son aquellas que eligen una acción aleatoria con probabilidad $\epsilon$ en lugar de seleccionar la acción más óptima según su función $Q(s,a)$ actual.

Para una mayor profundidad en estos temas, recomendamos leer el libro [*Reinforcement Learning: An Introduction* de Sutton & Barto, Parte 13.1](https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf).

Ahora bien, además de sus ventajas prácticas, estos métodos también ofrecen ventajas teóricas en comparación con las políticas $\epsilon$-greedy. La diferencia más importante radica en que los *policy gradient methods* parametrizan la política directamente, sin necesidad de estimar otra función y luego aplicar un operador como:

$$
\pi(a|s) = \arg\max_{a} Q^{\pi}(s,a)
$$

El uso de este operador puede introducir discontinuidades en la política debido a la naturaleza misma del operador $\arg \max$, ya que pequeños cambios en la función $Q^{\pi}(s,a)$ pueden provocar variaciones abruptas en la política. 

Por otro lado, si parametrizamos $\pi_{\theta}(a|s)$, podemos obtener una estimación más suave de las señales recibidas del entorno (*environment*) y generar acciones basadas en un estado de manera más estable. Esto se debe a que la diferenciabilidad y, en particular, la continuidad cuando parametrizamos $\pi_{\theta}$, implican que pequeños cambios en los parámetros se traducen en pequeños cambios en la toma de decisiones, lo que resulta en un proceso más robusto y suave.



## 2.2 Policy Gradient Theorem

Nuestro problema ahora se encuentra en cómo estimar el valor de nuestro gradiente. Afortunadamente, existe un resultado teórico que nos permite computarlo. Este fue propuesto por Sutton, y a continuación veremos su derivación siguiendo lo detallado en [[2]](https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf).  

Podemos medir el desempeño general asumiendo que se calcula como el valor esperado al iniciar en un estado inicial de un episodio; es decir:  

$$
J(\theta) = v_{\pi_{\theta}}(s_0)
$$  

donde $v_{\pi_{\theta}}$ es la verdadera función de valor de $\pi_{\theta}$. La dificultad de calcular el gradiente de $J(\theta)$ con respecto a $\theta$ radica en que este valor depende tanto de las acciones generadas por la política $\pi_{\theta}$ como de la distribución de los estados en los que se encuentra el agente $p(s'|s,a)$. Sin embargo, esta distribución está determinada por el entorno y no depende directamente de la política $\pi_{\theta}$.  

Aquí es donde nuestro teorema adquiere importancia. Para derivarlo, comenzamos calculando el gradiente de la función de valor:  

$$
\nabla v_{\pi}(s) = \nabla \left[  \sum_{a}\pi(a|s) q_{\pi}(s,a)  \right]
$$  

Distribuimos el operador de gradiente y aplicamos la regla del producto:  

$$
\nabla \pi(a|s)q_{\pi}(s,a) = q_{\pi}(s,a)\nabla\pi(a|s) + \pi(a|s)\nabla q_{\pi}(s,a)
$$  

Reemplazando en la ecuación inicial:  

$$
\nabla v_{\pi}(s) = \sum_{a}\left[  q_{\pi}(s,a)\nabla\pi(a|s) + \pi(a|s)\nabla q_{\pi}(s,a)  \right]
$$  

Usando la identidad  

$$
q_{\pi}(s,a) = \sum_{s',r} p(s',r|s,a) (r + v_{\pi}(s'))
$$  

podemos reescribir la expresión como:  

$$
\nabla v_{\pi}(s) = \sum_{a}\left[  q_{\pi}(s,a)\nabla\pi(a|s) + \pi(a|s)\nabla \sum_{s',r} p(s',r|s,a)(r + v_{\pi}(s'))  \right]
$$  

Dado que $p(s',r|s,a)$ no depende de $\theta$ y usando que $p(s',r|s,a) = p(s'|s,a)$, podemos reescribirlo como:  

$$
\nabla v_{\pi}(s) = \sum_{a}\left[  q_{\pi}(s,a)\nabla\pi(a|s) + \pi(a|s) \sum_{s'} p(s'|s,a) \nabla v_{\pi}(s')  \right]
$$  

Observamos que hemos obtenido una ecuación recursiva: para calcular $\nabla v_{\pi}(s)$ necesitamos también los valores de $\nabla v_{\pi}(s')$ para todos los estados futuros $s'$. Para continuar con la derivación, introducimos la siguiente notación.  

### $p^{\pi}(s\to x,k)$  

Definimos la probabilidad de que, partiendo desde un estado $s$, se alcance un estado $x$ después de $k$ pasos siguiendo la política $\pi$. Podemos construir esta probabilidad de manera recursiva:  

- Para $k=0$:  

  $$
  p^{\pi}(s\to s, k=0) = 1
  $$  

- Para $k=1$:  

  $$
  p^{\pi}(s\to s', k=1) = \sum_{a} \pi_{\theta}(a|s) p(s'|s,a)
  $$  

- Para $k+1$:  

  $$
  p^{\pi}(s \to x, k+1) = \sum_{s'} p^{\pi}(s\to s',k) p^{\pi}(s'\to x,1)
  $$  

Esta expresión considera todas las formas en las que podemos llegar a $x$ desde $s$ en $k+1$ pasos, utilizando la información del paso anterior.  

Ahora veremos cómo esta probabilidad nos permitirá continuar con la derivación de nuestra ecuación inicial.  

Reduzcamos la expresión en sus componentes recursivos y no recursivos


$$
\nabla v_{\pi}(s) = \sum_{a} q_{\pi}(s,a)\nabla\pi(a|s) + \sum_{a} \pi(a|s) \sum_{s'} p(s'|s,a)\nabla v_{\pi}(s')
$$

Denotemos $\phi(s) = \sum_{a} q^{\pi}(s,a)\nabla\pi(a|s)$. Entonces, nuestra expresión se reescribe como:

$$
\begin{aligned}
\nabla v_{\pi}(s) &= \phi(s) + \sum_{a} \pi(a|s) \sum_{s'} p(s'|s,a)\nabla v_{\pi}(s') \\
&= \phi(s) + \sum_{s'} \sum_{a} \pi(a|s) p(s'|s,a)\nabla v_{\pi}(s')
\end{aligned}
$$

De lo anterior, obtenemos:

$$
\nabla v_{\pi}(s) = \phi(s) + \sum_{s'} p(s \to s',k=1)\nabla v_{\pi}(s')
$$

Dado que podemos expresar $\nabla v_{\pi}(s')$ de forma recursiva como:

$$
\nabla v_{\pi}(s') = \phi(s') + \sum_{s''} p(s' \to s'',k=1)\nabla v_{\pi}(s''),
$$

sustituyéndolo en la ecuación anterior obtenemos:

$$
\begin{aligned}
\nabla v_{\pi}(s) &= \phi(s) + \sum_{s'} p(s \to s',k=1) \left[ \phi(s') + \sum_{s''} p(s' \to s'',k=1)\nabla v_{\pi}(s'') \right] \\
&= \phi(s) + \sum_{s'} p(s \to s',k=1) \phi(s') + \sum_{s'} p(s \to s',k=1) \sum_{s''} p(s' \to s'',k=1)\nabla v_{\pi}(s'') \\
&= \phi(s) + \sum_{s'} p(s \to s',k=1) \phi(s') + \sum_{s''} \sum_{s'} p(s \to s',k=1) p(s' \to s'',k=1)\nabla v_{\pi}(s'')
\end{aligned}
$$

Puesto que $p(s\to s'',k=2) = \sum_{s'} p(s\to s',k=1) p(s' \to s'',k=1)$, podemos escribir:

$$
\nabla v_{\pi}(s) = \phi(s) + \sum_{s'} p(s \to s',k=1)\phi(s') + \sum_{s''} p(s\to s'',k=2)\nabla v_{\pi}(s'')
$$

Repitiendo el mismo proceso para cualquier estado inicial $s$, obtenemos:

$$
\nabla v_{\pi}(s) = \sum_{x\in S} \sum_{k=0}^{\infty} p^{\pi}(s\to x,k)\phi(x)
$$

Esto nos permite calcular el gradiente de la función de valor sin necesidad de computar los gradientes de $q^{\pi}(s,a)$.

**Aplicación en la función objetivo**

Si tomamos como función objetivo $J(\theta) = v^{\pi}(s_0)$, donde $s_0$ es el estado inicial aleatorio, tenemos:

$$
\nabla J(\theta) = \sum_{s} \sum_{k=0}^{\infty} p^{\pi}(s_0\to s,k)\phi(s)
$$

Definamos $\eta(s) = \sum_{k=0}^{\infty} p^{\pi}(s_0\to s,k)$. Entonces:

$$
\nabla J(\theta) = \sum_{s} \eta(s)\phi(s)
$$

Dado que $\sum_s \eta(s)$ es una constante, podemos escribir:

$$
\nabla J(\theta) = \left(\sum_{s} \eta(s) \right) \sum_s \frac{\eta(s)}{\sum_s\eta(s)}\phi(s) \propto \sum_s \frac{\eta(s)}{\sum_s\eta(s)}\phi(s)
$$

Definiendo la distribución estacionaria como:

$$
d^{\pi}(s) = \sum_s \frac{\eta(s)}{\sum_s\eta(s)}
$$

> La distribución estacionaria representa la probabilidad de estar en un estado dado después de un número infinito de pasos en una cadena de Markov bajo la política $\pi$. Formalmente, se define como:
>
> $$
> d^{\pi}(s) = \lim_{t\to\infty} P(s_t = s | s_0, \pi)
> $$

Así, finalmente obtenemos:

$$
\nabla J(\theta) \propto \sum_s d^{\pi}(s) \sum_a q^{\pi}(s,a)\nabla\pi(a|s)
$$

Reescribiendo la expresión:

$$
\nabla J(\theta) \propto \sum_s d^{\pi}(s) \sum_a \pi_{\theta}(a|s) q^{\pi}(s,a) \frac{\nabla \pi_{\theta}(a|s)}{\pi_{\theta}(a|s)}
$$

Utilizando la identidad $\frac{d}{dx} \ln(x) = \frac{1}{x}$, obtenemos:

$$
\nabla J(\theta) = \mathbb{E}_{\pi} \left[ q^{\pi}(s,a)\nabla\ln \pi_{\theta}(a|s) \right]
$$

donde $\mathbb{E}_{\pi}$ denota la esperanza sobre la distribución $s \sim d^{\pi}, a \sim \pi$.

Esta formulación permite computar el gradiente de la función objetivo sin necesidad de calcular explícitamente los gradientes de $q^{\pi}(s,a)$, lo cual es útil dado que esta función suele ser desconocida y depende más del entorno. En contraste, la política $\pi$ es completamente parametrizable.


# 3. Derivaciones de $\nabla J(\theta)$

Como se puede ver en diversos trabajos [[3]](https://arxiv.org/pdf/1506.02438), esta no es la única forma de computar $\nabla J(\theta)$. De hecho, se puede expresar de manera general como:

$$
\mathbb{\nabla} J(\theta) = \mathbb{E}_{\pi}[f(s,a)\nabla \ln \pi_{\theta}(s,a)]
$$

A continuación, analizaremos algunos ejemplos de funciones utilizadas en investigaciones relevantes y las condiciones teóricas que debería cumplir la función $f(s,a)$. Además, compararemos estas funciones evaluando su sesgo y varianza.

## 3.1 Sesgo y varianza en $f(s,a)$

En la práctica, no se tiene acceso al verdadero gradiente $\nabla J(\theta)$. En su lugar, se realizan **estimaciones** basadas en muestras, denotadas como $\nabla \hat{J(\theta)}$. La idea es que estas estimaciones sean, en promedio, similares a $\nabla J(\theta)$ para que la actualización de parámetros sea efectiva.

La función $f(s,a)$ juega un papel fundamental en este proceso. Como se mencionó anteriormente, la función objetivo $J(\theta)$ representa el valor esperado de las recompensas de las trayectorias generadas por la política $\pi_{\theta}$. Por lo tanto, para mantener esta relación, $f(s,a)$ debe ser **insesgada**, asegurando así una estimación correcta de la función objetivo.

Matemáticamente, esto se expresa como:

$$
\mathbb{E}_{a_{t+1},s_{t+1},... \sim \pi_{\theta}}[f(s,a)] = Q^{\pi}(s_t,a_t)
$$

Es decir, en promedio, ambos valores deben ser iguales, lo que garantiza que la estimación de la función objetivo se mantenga coherente.

Sin embargo, la elección de $f(s,a)$ también influye en otra característica importante: la **varianza**. La varianza mide la dispersión en las estimaciones del gradiente debido a la aleatoriedad inherente del entorno, la política o las muestras utilizadas. Una alta varianza implica que las actualizaciones del gradiente pueden fluctuar significativamente de una iteración a otra, lo que puede hacer que el aprendizaje sea inestable o requiera más muestras para converger.

A continuación, se presentan algunos ejemplos de funciones $f(s,a)$ junto con un análisis de su varianza y sesgo.

## 3.2 Ejemplos de funciones $f(s,a)$

### 3.2.1 $R(\tau)$

En el contexto del aprendizaje por refuerzo (Reinforcement Learning), dada una trayectoria $\tau$, la recompensa acumulada $R(\tau)$ se define como:

$$
R(\tau) = \sum_{t=1}^{T}r_t
$$

En el trabajo de [R. J. Williams, *Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning*](https://link.springer.com/article/10.1007/BF00992696), se estima el gradiente de la función objetivo como:

$$
\nabla J(\theta) = \mathbb{E}_{\pi}[R(\tau)\nabla \ln \pi_{\theta}(s,a)]
$$

Esta función es válida porque cumple la condición de que $\mathbb{E}[R(\tau)] = Q(s,a)$. A continuación, se presenta la demostración:

La recompensa total $R(\tau)$ incluye todas las recompensas desde $t = 0$ hasta $T$. Sin embargo, al condicionar en $s_t, a_t$, las recompensas anteriores a $t$ —es decir, $( r(s_0,a_0), \dots, r(s_{t-1}, a_{t-1}) )$— son constantes, ya que $s_t$ y $a_t$ están fijos. Por lo tanto, la expectativa de $R(\tau)$ dado $s_t, a_t$ depende solo de las recompensas futuras:

$$
\mathbb{E}_{\tau \sim \pi_\theta}[R(\tau) | s_t, a_t] = \sum_{k=0}^{t-1} r(s_k, a_k) + \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{k=t}^{T} r(s_k, a_k) | s_t, a_t \right]
$$

Sin embargo, en el gradiente de la política, el término $\nabla_\theta \log \pi_\theta(a_t | s_t)$ no depende de las recompensas pasadas. Por lo tanto, al calcular la expectativa del gradiente:

$$
\mathbb{E}_{\tau \sim \pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a_t | s_t) R(\tau) \right] = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a_t | s_t) \sum_{k=t}^{T} r(s_k, a_k) \right]
$$

Dado que las recompensas pasadas son independientes de $\nabla_\theta \log \pi_\theta(a_t | s_t)$, se pueden cancelar en la expectativa. Finalmente, se tiene que:

$$
\mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{k=t}^{T} r(s_k, a_k) | s_t, a_t \right] = Q^{\pi_\theta}(s_t, a_t)
$$

Por lo que se concluye que:

$$
\mathbb{E}[R(\tau) | s_t, a_t] = Q(s_t, a_t)
$$

**Análisis de la varianza**  

La varianza cuando $f(s,a) = R(\tau)$ es alta. Esto se debe a que $R(\tau)$ depende de una única trayectoria, la cual puede variar considerablemente debido a la aleatoriedad del entorno y las decisiones de la política. En entornos estocásticos o con horizontes largos, dos trayectorias que parten del mismo estado inicial pueden tener retornos muy diferentes. Esta gran fluctuación resulta en una alta varianza, lo que ralentiza el aprendizaje y lo hace menos estable, ya que las actualizaciones del gradiente pueden oscilar significativamente entre iteraciones.

 
 
## 3.2.2 $Q(s,a)$

Esta estimación se encuentra en el trabajo clásico sobre [Actor-Critic de Barto, Sutton y Anderson (1983)](https://ieeexplore.ieee.org/document/6313077). Aquí se utiliza la formulación original del gradiente de $J(\theta)$, es decir:

$$
\nabla J(\theta) = \mathbb{E}_{\pi}\left[q^{\pi}(s,a)\nabla\ln \pi_{\theta}(a|s)\right]
$$

La demostración es trivial, por lo que no la incluiremos. Sin embargo, pasemos al análisis de su varianza.

**Análisis de la varianza**  

La varianza en el estimador del gradiente al utilizar $Q(s, a)$ es media, ya que al ser una expectativa sobre múltiples trayectorias, atenúa las fluctuaciones presentes en los retornos individuales. En comparación con el uso directo de $R(\tau)$, donde la varianza es alta debido a la dependencia total de las recompensas observadas en cada trayectoria, $Q(s, a)$ proporciona una estimación más estable al considerar la expectativa sobre todas las posibles secuencias de acciones y estados.

Sin embargo, a pesar de esta reducción, la varianza no es completamente baja. La estimación de $Q(s, a)$ sigue estando afectada por la aleatoriedad inherente en la selección de acciones y la dinámica del entorno, lo que introduce cierta fluctuación en las actualizaciones del gradiente. Esto puede hacer que el entrenamiento requiera más muestras para estabilizarse en comparación con métodos que usan la ventaja $A(s, a)$. Aun así, su uso en métodos Actor-Critic ha demostrado ser una alternativa viable, ya que ofrece un equilibrio entre reducción de varianza y sesgo en la estimación del gradiente de política.

## 3.2.3 $A(s,a)$

Esta estimación se encuentra en el trabajo de [Schulman et al. (2016) *High-Dimensional Continuous Control Using Generalized Advantage Estimation*](https://arxiv.org/pdf/1506.02438). Esta función se define como:

$$
A(s,a) = Q(s,a) - V(s)
$$

La función de ventaja $A(s, a)$ mide cuánto mejor es tomar la acción $a$ en el estado $s$ en comparación con el valor promedio del estado $V(s)$. Como $V(s)$ no depende de la acción $a$, restarlo no afecta la dirección del gradiente, y la estimación sigue siendo insesgada. Ahora veremos la demostración que valida esta propiedad.

Consideremos el estimador del gradiente de la política cuando se utiliza la ventaja:

$$
\hat{g} = \mathbb{E}_{\tau \sim \pi_\theta}\Big[ \nabla_\theta \log \pi_\theta(a_t|s_t) \, A^{\pi_\theta}(s_t,a_t) \Big].
$$

Sustituyendo la definición de la ventaja, obtenemos:

$$
\hat{g} = \mathbb{E}_{\tau \sim \pi_\theta}\Big[ \nabla_\theta \log \pi_\theta(a_t|s_t) \, \big( Q^{\pi_\theta}(s_t,a_t) - V^{\pi_\theta}(s_t) \big) \Big].
$$

Dividiendo la expectativa en dos términos, se obtiene:

$$
\hat{g} = \underbrace{\mathbb{E}_{\tau \sim \pi_\theta}\Big[ \nabla_\theta \log \pi_\theta(a_t|s_t) \, Q^{\pi_\theta}(s_t,a_t) \Big]}_{\text{(I)}} - \underbrace{\mathbb{E}_{\tau \sim \pi_\theta}\Big[ \nabla_\theta \log \pi_\theta(a_t|s_t) \, V^{\pi_\theta}(s_t) \Big]}_{\text{(II)}}.
$$

Observemos que $V^{\pi_\theta}(s_t)$ es independiente de la acción $a_t$, por lo que podemos escribir el término (II) de la siguiente forma:

$$
\text{(II)} = \mathbb{E}_{s_t}\Big[ V^{\pi_\theta}(s_t) \, \mathbb{E}_{a_t \sim \pi_\theta}\big[\nabla_\theta \log \pi_\theta(a_t|s_t)\big] \Big].
$$

Aquí es donde se utiliza la **propiedad de la función score**, la cual establece que:

$$
\mathbb{E}_{a_t \sim \pi_\theta}\big[\nabla_\theta \log \pi_\theta(a_t|s_t)\big] = 0.
$$

Por lo tanto, el término (II) se anula:

$$
\text{(II)} = \mathbb{E}_{s_t}\Big[ V^{\pi_\theta}(s_t) \cdot 0 \Big] = 0.
$$

En consecuencia, el estimador queda como:

$$
\hat{g} = \mathbb{E}_{\tau \sim \pi_\theta}\Big[ \nabla_\theta \log \pi_\theta(a_t|s_t) \, Q^{\pi_\theta}(s_t,a_t) \Big].
$$

Esto muestra que, al usar la ventaja, se elimina el término dependiente de $V^{\pi_\theta}(s_t)$ sin introducir sesgo en el gradiente, ya que el gradiente se mantiene igual que cuando se utiliza directamente $Q^{\pi_\theta}(s_t,a_t)$.

**Análisis de la varianza**  

La varianza en el estimador del gradiente es baja al usar la ventaja $A(s, a)$, ya que elimina la variabilidad asociada con $V(s)$, que es común a todas las acciones en un estado. Esto reduce el ruido en la estimación y hace que las actualizaciones del gradiente sean más estables y consistentes. En comparación con el uso directo de $Q(s, a)$, la ventaja permite enfocarse en la diferencia relativa entre acciones, evitando que fluctuaciones en las recompensas absolutas afecten el aprendizaje.

Sin embargo, aunque la varianza es baja, no es nula. Si la estimación de $V(s)$ es inexacta, el ruido en su cálculo puede afectar la estabilidad del gradiente. A pesar de ello, la ventaja sigue siendo una estrategia eficaz para mejorar la eficiencia de los métodos de policy gradient y es ampliamente utilizada en algoritmos como A2C y PPO, donde se aplican técnicas adicionales para controlar la varianza y mejorar la estabilidad del entrenamiento.

# 4. Conclusiones

En este artículo hemos discutido la metodología general de los métodos basados en *policy gradient*, sus ventajas respecto a otros enfoques y el resultado teórico que los respalda: el **Policy Gradient Theorem**. Finalmente, realizamos su demostración y exploramos sus posibles derivaciones, analizando diferentes funciones $f(s,a)$ dentro de este marco teórico.

En próximos artículos, veremos en mayor detalle los distintos algoritmos basados en estos métodos. Para una referencia más completa, recomendamos leer el siguiente artículo de la investigadora de OpenAI, Lilian Weng:

[Policy Gradient Algorithms](https://lilianweng.github.io/posts/2018-04-08-policy-gradient/)


# Referencias:

* [1] [A (Long) Peek into Reinforcement Learning, Lilian Weng ](https://lilianweng.github.io/posts/2018-02-19-rl-overview/)
* [2] [R. S. Sutton and A. G. Barto, Reinforcement Learning: An Introduction, 2nd ed. Cambridge, MA, USA: MIT Press, 2018.](https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf)
* [3] [J. Schulman, P. Moritz, S. Levine, M. I. Jordan, and P. Abbeel, "High-dimensional continuous control using generalized advantage estimation," in Proceedings of the International Conference on Learning Representations (ICLR), San Juan, Puerto Rico, 2016.](https://arxiv.org/pdf/1506.02438)
* [4] [R. J. Williams, "Simple statistical gradient-following algorithms for connectionist reinforcement learning," Machine Learning, vol. 8, pp. 229–256, 1992.](https://link.springer.com/article/10.1007/BF00992696)
* [5] [A. G. Barto, R. S. Sutton, and C. W. Anderson, "Neuronlike adaptive elements that can solve difficult learning control problems," IEEE Transactions on Systems, Man, and Cybernetics, vol. SMC-13, no. 5, pp. 834–846, Sept.–Oct. 1983.](https://ieeexplore.ieee.org/document/6313077)
* [6] [ Policy Gradient Algorithms, Lilian Weng](https://lilianweng.github.io/posts/2018-04-08-policy-gradient/) 