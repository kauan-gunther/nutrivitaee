<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Agrupando os 8 itens em 4 páginas de 2 cards cada
const paginas = [
  [
    'O acompanhamento nutricional ajuda a entender seu corpo, sua rotina e suas necessidades de forma personalizada.',
    'Com orientação profissional, fica mais fácil construir uma alimentação equilibrada e sustentável.'
  ],
  [
    'O acompanhamento permite ajustar hábitos e melhorar resultados ao longo do tempo.',
    'Uma boa alimentação contribui para mais disposição, equilíbrio e qualidade de vida no dia a dia.'
  ],
  [
    'Planejamento alimentar flexível que se adapta à sua rotina, sem dietas restritivas ou punitivas.',
    'Prevenção de doenças e fortalecimento da imunidade através de escolhas conscientes no dia a dia.'
  ],
  [
    'Relacionamento mais leve e saudável com a comida, focando no seu bem-estar físico e mental.',
    'Acompanhamento contínuo para reavaliar metas e garantir evolução constante e duradoura.'
  ]
]

const paginaAtual = ref(0)
let timer = null

// Alterna entre a página 0 e a página 1 a cada 5 segundos
onMounted(() => {
  timer = setInterval(() => {
    paginaAtual.value = (paginaAtual.value + 1) % paginas.length
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="explicacao">
    <h2>Por que fazer acompanhamento nutricional?</h2>

    <div class="carousel-container">
      <Transition name="slide" mode="out-in">
        <div :key="paginaAtual" class="geral">
          <div 
            v-for="(cardText, index) in paginas[paginaAtual]" 
            :key="index" 
            class="card"
          >
            {{ cardText }}
          </div>
        </div>
      </Transition>
    </div>

    <div class="dots">
      <span 
        v-for="(_, idx) in paginas" 
        :key="idx" 
        :class="{ active: paginaAtual === idx }"
        @click="paginaAtual = idx"
      ></span>
    </div>
  </section>
</template>

<style scoped>
.explicacao {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  gap: 40px;
}

.explicacao h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  color: #333F34;
  font-weight: 400;
  text-align: center;
  margin: 0;
}

.carousel-container {
  width: 100%;
  max-width: 1000px;
  min-height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.geral {
  display: flex;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

.card {
  flex: 1;
  text-align: center;
  background: #F1EDD2;
  color: #333F34;
  font-size: 1.15rem;
  line-height: 1.5;
  border: 1.5px solid #536236; 
  border-radius: 20px;
  padding: 30px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* Indicadores de bolinha */
.dots {
  display: flex;
  gap: 10px;
}

.dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #b5ad96;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dots span.active {
  background: #536236;
  width: 24px;
  border-radius: 10px;
}

/* Animação do Vue */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 768px) {
  .geral {
    flex-direction: column;
  }
}
</style>