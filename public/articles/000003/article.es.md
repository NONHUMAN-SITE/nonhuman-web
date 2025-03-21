# 1. Introduccion

Este [paper de OpenAI](https://arxiv.org/pdf/1707.06347) busca mejorar el rendimiento de un método previo conocido como [Trust Region Policy Optimization (TRPO)](https://arxiv.org/pdf/1502.05477). Se enfoca en varios aspectos, como reducir la complejidad de implementación, aumentar la versatilidad al hacerlo más compatible con arquitecturas generales, mejorar la eficiencia en el muestreo (*sampling*) y proporcionar mayor estabilidad en el entrenamiento.  

En este artículo explicamos en detalle los componentes clave de la metodología propuesta, analizando sus partes más importantes. Puedes revisar el código fuente de la implementación en 

[https://github.com/NONHUMAN-SITE/ReinforcementLearning](https://github.com/NONHUMAN-SITE/ReinforcementLearning)

# 2. Background

## 2.1 Policy Gradient Methods

Como se analizó en un [artículo anterior de NONHUMAN](https://www.nonhuman.site/articles/000002), en este tipo de métodos se busca parametrizar la política de manera directa. En dicho artículo demostramos por qué los estimadores de gradientes se definen de la siguiente manera:

$$
\hat{g} = \mathbb{\hat{E}}_t[\nabla_{\theta} \log \pi_{\theta}(a_t|s_t)\hat{A}_t]
$$

donde $A^{\pi}(a_t,s_t) = Q^{\pi}(s_t,a_t) - V^{\pi}(s_t)$ es la función *Advantage*, que indica qué tan buena es una acción en comparación con el valor promedio de todas las acciones.  

Este estimador señala la dirección en la que se deben optimizar los parámetros para realizar un *gradient ascent* (ya que buscamos maximizar las recompensas). En términos formales, esto se traduce en calcular $\nabla_{\theta}J(\pi)$ para determinar la dirección correcta de los parámetros.  

El estimador se obtiene de manera empírica, es decir, tomando un pequeño *batch* de trayectorias finitas, lo cual se representa mediante la media empírica $\mathbb{E}_t[.]$ en un algoritmo que alterna entre optimización y muestreo.  

En la práctica, usamos una *loss function* cuya derivada coincida con este estimador para que la diferenciación automática nos dé el mismo resultado. Específicamente, se utiliza:

$$
L^{PG} = \mathbb{\hat{E}_{t}}[\log \pi_{\theta}(a_t|s_t)\hat{A}_t]
$$

Más adelante veremos que, aunque podemos realizar varios pasos de optimización sobre esta función de pérdida, esto no está bien justificado y, empíricamente, puede llevar a actualizaciones grandes y destructivas de la política. En cambio, el método propuesto más adelante regula estos efectos.

## 2.2 Trust Region Methods

En este método, se maximiza la siguiente función objetivo sujeta a una restricción que controla el tamaño de la actualización de la política:

$$
\max_{\theta} \mathbb{\hat{E}}_t\left[\frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}\hat{A}_t\right]
$$

$$
\text{subject to} \ \mathbb{\hat{E}}_{t}[KL[\pi_{\theta_{old}}(.|s_t),\pi_{\theta}(.|s_t)]] \leq \delta
$$

Analicemos la función objetivo. Aquí, $\pi_{\theta_{old}}$ representa la política antes de la actualización. Todo lo muestreado dentro de la trayectoria y el resultado de $\hat{A}_t$ están determinados por $\theta_{old}$. Al maximizar esta función:

- Si $\hat{A}_t < 0$, entonces $\pi_{\theta_{old}}(a_t|s_t) > \pi_{\theta}(a_t|s_t)$.
- Si $\hat{A}_t > 0$, entonces $\pi_{\theta_{old}}(a_t|s_t) < \pi_{\theta}(a_t|s_t)$.

Esto significa que, cuando la ventaja es negativa, $\theta$ debe ajustarse para reducir la probabilidad de seleccionar esas acciones, minimizando así la selección de acciones con desventaja.  

Por otro lado, cuando la ventaja es positiva, $\theta$ debe ajustarse para aumentar la probabilidad de seleccionar esas acciones favorables.  

La restricción impuesta por $\mathbb{\hat{E}}_{t}[KL[\pi_{\theta_{old}}(.|s_t),\pi_{\theta}(.|s_t)]] \leq \delta$ ayuda a controlar el tamaño de la actualización de los parámetros, evitando que se alejen demasiado de la política anterior. Esto previene actualizaciones agresivas que podrían generar inestabilidad.  

Notemos que el término $\frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}$ no está acotado. Si la probabilidad de la política antigua es muy pequeña y la ventaja es considerable, este valor puede crecer demasiado, generando cambios bruscos e inestabilidad.

**Penalty vs Constrained**

La teoría detrás de TRPO sugiere reformular este proceso de optimización agregando un término de penalización en lugar de una restricción fija, es decir:

$$
\max_{\theta} \mathbb{E}_t\left[\frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}\hat{A}_t - \beta KL[\pi_{\theta_{old}}(.|s_t),\pi_{\theta}(.|s_t)]\right]
$$

Este enfoque tiene un efecto similar, ya que maximizar esta expresión implica naturalmente minimizar la divergencia $KL[.]$, lo que indica a los parámetros que no se alejen demasiado de la política anterior $\pi_{old}$.  

Sin embargo, existe una diferencia clave: el término $\beta$ controla el peso de esta penalización. Es decir, determina qué tan fuerte será el efecto de la regularización.  

El *paper* menciona que **es difícil encontrar un valor de $\beta$ que funcione bien en diferentes problemas, o incluso dentro del mismo problema, ya que sus características cambian a medida que la política mejora**.  

Por lo tanto, si queremos un algoritmo de primer orden que emule el rendimiento de TRPO, no es suficiente usar esta expresión y luego aplicar actualizaciones clásicas (i.e., usar un optimizador, calcular gradientes y actualizar $\theta$).


# 3. Clipper Surrogate Objective

Denotemos $r_t(\theta) = \frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}$. Además, tenemos que $r_t(\theta_{old})=1$. 

Definamos la función:

$$
\mathcal{L}^{CPI}(\theta) = \mathbb{\hat{E}}_t\left[\frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}\hat{A}_t\right] = \mathbb{\hat{E}}_t\left[r_t(\theta)\hat{A}_t\right]
$$

donde usamos CPI por **Conservative Policy Iteration**. Como podemos notar, sin ninguna restricción, maximizar esta función puede llevar a una actualización excesiva de la política. El objetivo, entonces, es modificar la función para penalizar desviaciones significativas de $r_t(\theta) = 1$.

La propuesta es la siguiente:

$$
\mathcal{L}^{CLIP}(\theta) = \mathbb{\hat{E}}_t \left[\min(r_t(\theta)\hat{A}_t, \operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat{A}_t)\right]
$$

donde $\epsilon$ es un hiperparámetro.

El término $\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat{A}_t$ está presente porque queremos mantener acotado el ratio de probabilidades. Notemos que este ratio es igual a $1$ cuando $\theta = \theta_{old}$. La idea de este término es crear un margen de confianza alrededor de este punto, asegurando que el ratio de probabilidad permanezca dentro del intervalo $[1-\epsilon,1+\epsilon]$. Esto ayuda a mantener la estabilidad en la actualización de la política y evita cambios bruscos.

Finalmente, el operador $\min(.,.)$ garantiza que la función objetivo sea una cota inferior de $r_t(\theta)\hat{A}_t$. Analizando por secciones, podemos observar cómo varía el comportamiento dependiendo del valor del ratio:

![Loss Function vs Ratio en función de la ventaja](https://res.cloudinary.com/dtpiuha91/image/upload/v1742526789/1_vtqzsk.png)

En la primera figura, se observa que cuando la ventaja es positiva (es decir, el agente tiene un buen desempeño, $A > 0$), el ratio se acota por $1+\epsilon$, estableciendo un límite superior para $\mathcal{L}^{CLIP}$ como $\mathcal{L}^{CLIP} \leq (1+\epsilon)A$. Este mecanismo controla la actualización de los parámetros, priorizando la estabilidad del aprendizaje y evitando cambios drásticos.

Por otro lado, cuando la ventaja es negativa ($A < 0$), la función penaliza más fuertemente las malas decisiones del agente. En este caso, el ratio de probabilidad se mantiene acotado para evitar que acciones con mala recompensa sean favorecidas.

# 4. Adaptive KL Penalty Coefficient

Otro enfoque es usar la divergencia KL como penalización. Sin embargo, en este caso agregamos un coeficiente de penalización dinámico, que se ajusta para alcanzar un valor objetivo $d_{targ}$ en cada actualización de la política. Aunque este método no supera empíricamente al método anterior, se menciona en el paper como un baseline importante.

La función de optimización es la siguiente:

$$
\mathcal{L}^{KLPEN}(\theta) = \mathbb{\hat{E}}_t\left[\frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}\hat{A}_t - \beta KL[\pi_{\theta_{old}}(.|s_t),\pi_{\theta}(.|s_t)]\right]
$$

Luego, se calcula:

$$
d = KL[\pi_{\theta_{old}}(.|s_t),\pi_{\theta}(.|s_t)]
$$

y se actualiza el valor de $\beta$ siguiendo la regla:

$$
\text{Si} \ d < d_{targ}/1.5, \quad \beta \gets \beta/2
$$

$$
\text{Si} \ d > d_{targ} \times 1.5, \quad \beta \gets \beta \times 2
$$

Esto significa que si la divergencia KL es menor que el valor objetivo, la penalización disminuye, permitiendo cambios más grandes en la política. Por el contrario, si la divergencia es mayor, se aumenta la penalización para restringir la actualización.

El valor actualizado de $\beta$ se usa en la siguiente actualización de la política. Con este esquema, ocasionalmente se observan actualizaciones donde la divergencia KL se desvía significativamente de $d_{targ}$. Sin embargo, estos casos son raros, y el coeficiente $\beta$ se ajusta rápidamente. Los parámetros $1.5$ y $2$ fueron elegidos heurísticamente, pero el algoritmo no es muy sensible a ellos. El valor inicial de $\beta$ es otro hiperparámetro, pero su impacto es mínimo en la práctica porque el algoritmo lo ajusta rápidamente.

# 5. Algoritmo

El algoritmo propuesto se basa en una variante de Actor-Critic, donde la política $\pi_{\theta}(s)$ y la función de valor $V_{\theta}(s)$ comparten parámetros. Para entrenar este tipo de redes neuronales, la función objetivo debe incluir ambos componentes. Además, se agrega un término de entropía para fomentar la exploración, como sugieren trabajos previos.

> La entropía mide qué tan aleatoria es una distribución de probabilidad. En el caso de la política, un mayor valor de entropía significa que el agente no siempre elegirá la acción con mayor recompensa esperada, lo que fomenta la exploración.

La función objetivo es:

$$
\mathcal{L}_t^{CLIP+VF+S}(\theta) = \mathbb{\hat{E}}_t\left[\mathcal{L}_t^{CLIP}(\theta) - c_1\mathcal{L}_t^{VF}(\theta) + c_2S[\pi_{\theta}](s_t)\right]
$$

donde $c_1$ y $c_2$ son coeficientes de ponderación, $S$ denota la entropía, y la función de valor se define como:

$$
\mathcal{L}^{VF} = (V_{\theta}(s_t) - V_t^{targ})^2
$$

Para entrenar esta función objetivo, el advantage se estima de la siguiente manera:

$$
\hat{A}_t = \delta_t + (\gamma \lambda)\delta_{t+1} + \dots + (\gamma \lambda)^{T-t+1}\delta_{T-1}
$$

donde:

$$
\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)
$$

Aquí, $T$ representa un número fijo de timesteps.

El algoritmo sigue el siguiente procedimiento, como se muestra en la figura:

![Algorithm of PPO](https://res.cloudinary.com/dtpiuha91/image/upload/v1742526790/2_x5xjql.png)

El procedimiento consiste en utilizar $N$ actores en paralelo, cada uno recolectando datos durante $T$ timesteps. Esto genera un buffer de tamaño $N \times T$ timesteps. Luego, se usa un minibatch de tamaño $M \leq N T$ para entrenar el modelo con la función objetivo durante $K$ épocas.


# 6. Implementacion

La implementación oficial de este algoritmo se encuentra disponible en nuestro repositorio de Reinforcement Learning:

[https://github.com/NONHUMAN-SITE/ReinforcementLearning/blob/main/rl/algorithm/ppo/ppo.py](https://github.com/NONHUMAN-SITE/ReinforcementLearning/blob/main/rl/algorithm/ppo/ppo.py)

Sin embargo, aquí detallaremos las partes más relevantes de la implementación. A pesar de que este es un algoritmo relativamente sencillo y directo, el uso adecuado de ciertas funciones de nuestra librería conocida, PyTorch, puede ahorrarnos mucho trabajo y hacer la implementación más eficiente.

## Neural Network

Como vimos anteriormente, este algoritmo sigue la arquitectura *actor-critic*, lo que significa que utiliza dos redes neuronales con funciones distintas. En este caso, la política parametrizada $\pi_{\theta}$ está representada por el *actor*, mientras que otra red neuronal se encarga de estimar el valor de los estados, es decir, $V_{\theta}(s)$. En nuestra implementación, esto se refleja de la siguiente manera:


```python
class CartPoleActorCritic(BaseActorCritic):

    def __init__(self):
        super().__init__()
        # Inicializar pesos con orthogonal initialization
        def init_weights(m):
            if isinstance(m, nn.Linear):
                nn.init.orthogonal_(m.weight, gain=1)
                nn.init.constant_(m.bias, 0)

        # Arquitectura más simple pero efectiva
        self.actor = nn.Sequential(
            nn.Linear(4, 128),
            nn.Tanh(),
            nn.Linear(128, 128),
            nn.Tanh(),
            nn.Linear(128, 2),
            nn.Softmax(dim=-1)
        )
        
        self.critic = nn.Sequential(
            nn.Linear(4, 128),
            nn.Tanh(),
            nn.Linear(128, 128),
            nn.Tanh(),
            nn.Linear(128, 1)
        )
        
        self.actor.apply(init_weights)
        self.critic.apply(init_weights)

        self.optimizer = torch.optim.Adam([
            {'params': self.actor.parameters(), 'lr': 2.5e-4},
            {'params': self.critic.parameters(), 'lr': 1e-3}
        ])
```

Podemos separar ambas redes neuronales y asignar a cada una sus propios parámetros de optimización, ya que PyTorch nos ofrece esta flexibilidad.

## Collect Data

Aunque en el paper se menciona que la recolección de datos debe realizarse de forma paralela utilizando $N$ actores, nosotros hemos optado por esta configuración, ya que más adelante implementaremos un mecanismo que nos permitirá realizar este cómputo de manera paralela. La función principal de este módulo es recolectar los datos dentro del *buffer* y luego reutilizarlos varias veces al entrenar sobre estos *timesteps*. 

Otras implementaciones utilizan dos redes neuronales para la política, a menudo denominando una de ellas como `policy_old`; sin embargo, consideramos que esto no es necesario, ya que todos los datos recolectados quedan registrados antes de realizar *backpropagation*. No obstante, hay dos aspectos clave a tener en cuenta:

* **Cálculo del Advantage $A_t$ con GAE**: Este paso es crucial, ya que proporciona la señal de recompensa al modelo. Si la estimación no se realiza correctamente, el modelo no podrá aprender de manera efectiva. Su implementación puede ser un poco compleja, ya que, después de almacenar todos los valores de recompensa, es necesario considerar dos factores: la segmentación de trayectorias independientes y la detección de estados terminales.

$$
\hat{A}_t = \delta_t + (\gamma \lambda)\delta_{t+1} + ... + (\gamma \lambda)^{T-t+1}\delta_{T-1}
$$

$$
\text{donde} \quad \delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)
$$

* **Almacenamiento de las acciones en el buffer**: Este paso es esencial para estimar correctamente el ratio 

$$
r_t(\theta) = \frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}
$$

Este punto será desarrollado con mayor profundidad en la siguiente sección.


```python
    def parallel_recollect(self):
        '''
        Implementación de GAE (Generalized Advantage Estimation)
        '''
        for _ in range(self.cfg_algorithm.N_actors):

            state = self.env.reset()

            states   = []
            logprobs = []
            rewards  = []
            dones    = []
            values   = []
            actions  = []
            
            for t in range(self.cfg_algorithm.T_steps):

                action, logprob, value = self.model.act(state, with_value_state=True)
                
                next_state, reward, done, truncated, info = self.env.step(action)

                done = done or truncated
                
                states.append(state)
                logprobs.append(logprob)
                rewards.append(reward)
                dones.append(done)
                values.append(value)
                actions.append(action)
                state = next_state
                
                if done:
                    state = self.env.reset()
                        
            # Calculating GAE
            advantages = []
            last_advantage = 0
            last_value = values[-1]
            
            for t in reversed(range(len(rewards))):
                if dones[t]:
                    delta = rewards[t] - values[t]
                    last_advantage = delta
                else:
                    delta = rewards[t] + self.cfg_algorithm.gamma * last_value - values[t]
                    last_advantage = delta + self.cfg_algorithm.gamma * self.gae_lambda * last_advantage
                
                advantages.insert(0, last_advantage)
                last_value = values[t]
            
            advantages = torch.tensor(advantages, device=self.device)
            values = torch.tensor(values, device=self.device)

            V_targ = advantages + values
            
            for t in range(self.cfg_algorithm.T_steps):
                self.buffer.add((states[t],actions[t], logprobs[t], advantages[t], V_targ[t]))
```

## Loss Function

### New Log Probs

Como vimos previamente, almacenar las acciones es un paso fundamental, ya que al estimar el ratio  

$$
r_t(\theta) = \frac{\pi_{\theta}(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}
$$  

debemos calcularlo en función de las acciones ya tomadas. Es decir, este ratio representa la probabilidad de haber tomado una determinada acción con la nueva política en relación con la probabilidad de haber tomado esa misma acción con la política anterior.  

Por lo tanto, no debemos recalcular las acciones, ya que esto generaría un resultado incorrecto y desviaría la optimización de $\theta$ en la dirección equivocada, como analizamos en las secciones previas.  

Para realizar este cálculo de manera eficiente en espacios de acción tanto continuos como discretos, utilizamos la librería `torch.distributions`. Esta nos permite obtener la distribución de probabilidad en ambos casos y calcular directamente el logaritmo de las probabilidades dadas las acciones, lo que hace que la implementación sea más sencilla, rápida y eficiente.  


```python
       #CLIP LOSS
        if self.env.is_continuous:
            action_mean = self.model.actor_forward(old_states)
            cov_matrix = torch.diag(self.model.action_var).unsqueeze(0)
            dist = torch.distributions.MultivariateNormal(action_mean, cov_matrix)
            new_logprobs = dist.log_prob(old_actions)
        else:
            probs = self.model.actor_forward(old_states)
            dist = torch.distributions.Categorical(probs)
            new_logprobs = dist.log_prob(old_actions)
```

Lo único que se debe tener en cuenta es que, en el caso continuo, necesitamos un hiperparámetro adicional: `self.model.action_var`. Este representa la varianza que tendrá nuestro modelo al momento de muestrear las acciones. Esta variable debe decrecer a medida que el entrenamiento avanza para producir acciones cada vez más deterministas. Además, este factor influye en la exploración y explotación. En nuestro código, implementamos un decaimiento lineal de este valor.

**Function**

Más allá de este detalle, la función de pérdida es bastante sencilla, ya que PyTorch nos proporciona varias herramientas para implementar diferentes partes del algoritmo de manera directa, como se muestra a continuación. Un aspecto importante, aunque a veces pasado por alto, es el signo de la pérdida. Como vimos previamente, el objetivo es maximizar el estimador mediante *gradient ascent*; sin embargo, esto es equivalente a realizar *gradient descent* con el signo del estimador invertido.


```python
    def get_loss(self, sample):

        old_states, old_actions, old_logprobs, old_A_t, old_V_targ = sample

        #CLIP LOSS
        if self.env.is_continuous:
            action_mean = self.model.actor_forward(old_states)
            cov_matrix = torch.diag(self.model.action_var).unsqueeze(0)
            dist = torch.distributions.MultivariateNormal(action_mean, cov_matrix)
            new_logprobs = dist.log_prob(old_actions)
        else:
            probs = self.model.actor_forward(old_states)
            dist = torch.distributions.Categorical(probs)
            new_logprobs = dist.log_prob(old_actions)

        ratio = torch.exp(new_logprobs - old_logprobs.detach())
        clip_ratio = torch.clamp(ratio, 1 - self.cfg_algorithm.eps_clip, 1 + self.cfg_algorithm.eps_clip)

        clip_loss = torch.min(ratio * old_A_t, clip_ratio * old_A_t)


        #ENTROPY LOSS
        entropy_loss = dist.entropy()

        #VALUE LOSS
        value_states = self.model.critic_forward(old_states).squeeze()
        value_loss = self.mse_loss(old_V_targ, value_states)
        value_loss = value_loss

        #TOTAL LOSS
        loss = clip_loss - self.cfg_algorithm.vf_coef * value_loss + self.cfg_algorithm.entropy_coef * entropy_loss
        loss = -loss.mean()
        
        return loss
```


# 7. Results

¡Hora de hacer BRRRR con las GPU! En esta sección, entrenamos la red neuronal en varios entornos sencillos y bien definidos de la librería [Gymnasium](https://gymnasium.farama.org/index.html). En particular, entrenamos nuestra política en cuatro entornos distintos: **CartPole**, **LunarLander**, **BipedalWalker** y **CarRacing (Discrete)**. A continuación, presentamos varios videos que muestran el rendimiento de la política en cada uno de ellos.

![CartPole](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525560/cartpole_f7bjc6.mp4)

![LunarLander](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525561/lunarlander_qre1sy.mp4)

![BipedalWalker](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525563/bipedalwalker_dhtlzz.mp4)

![CarRacing](https://res.cloudinary.com/dtpiuha91/video/upload/v1742525567/carracing_ftrdav.mp4)

Todos estos modelos, y muchos más, están disponibles para su descarga en nuestro repositorio de Hugging Face

[https://huggingface.co/NONHUMAN-RESEARCH](https://huggingface.co/NONHUMAN-RESEARCH).


# Referencias

[1] [J. Schulman, F. Wolski, P. Dhariwal, A. Radford, y O. Klimov, "Proximal Policy Optimization Algorithms," OpenAI](https://arxiv.org/abs/1707.06347)
