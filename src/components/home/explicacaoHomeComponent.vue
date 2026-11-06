<script setup>
import { ref } from 'vue'

// Agrupando os 8 itens em 4 páginas de 2 mensagens cada (os mesmos textos de antes)
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
const pausado = ref(false) // pausa quando o mouse ou o teclado estão na seção

// Chamada quando a linha de progresso termina de encher (5 segundos)
function proxima() {
  paginaAtual.value = (paginaAtual.value + 1) % paginas.length
}
</script>

<template>
  <section
    class="explicacao"
    @mouseenter="pausado = true"
    @mouseleave="pausado = false"
    @focusin="pausado = true"
    @focusout="pausado = false"
  >
    <h2>Por que fazer acompanhamento nutricional?</h2>

    <div class="palco">
      <Transition name="fade" mode="out-in">
        <div :key="paginaAtual" class="geral">
          <p v-for="(texto, index) in paginas[paginaAtual]" :key="index" class="mensagem">
            {{ texto }}
          </p>
        </div>
      </Transition>
    </div>

    <!-- Linhas finas no lugar das bolinhas: a da página atual vai enchendo e, ao terminar, troca as mensagens -->
    <div class="indicadores">
      <button
        v-for="(_, idx) in paginas"
        :key="idx"
        type="button"
        class="indicador"
        :class="{ ativo: paginaAtual === idx, pausado }"
        :aria-label="`Mensagens ${idx + 1} de ${paginas.length}`"
        :aria-current="paginaAtual === idx ? 'true' : undefined"
        @click="paginaAtual = idx"
      >
        <span class="preenchimento" @animationend="proxima"></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
/* Fontes desta seção: Cormorant Garamond (título) e Lora (mensagens) */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Lora:wght@400;500&display=swap');

.explicacao {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(56px, 8vw, 112px) 20px;
  gap: clamp(32px, 5vw, 56px);
}

.explicacao h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.3rem, 4.2vw, 3.4rem);
  font-weight: 600;
  line-height: 1.1;
  color: #333f34;
  text-align: center;
  margin: 0;
}

/* As mensagens ficam entre duas linhas finas, sem caixas */
.palco {
  width: 100%;
  max-width: 1200px;
  min-height: 320px;
  display: flex;
  align-items: center;
  padding: clamp(48px, 6vw, 88px) 0;
  border-top: 1px solid rgba(51, 63, 52, 0.25);
  border-bottom: 1px solid rgba(51, 63, 52, 0.25);
}

.geral {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Mensagens maiores, com mais espaço entre as linhas e nas laterais */
.mensagem {
  margin: 0;
  padding: 0 clamp(32px, 5vw, 80px);
  text-align: center;
  font-family: 'Lora', serif;
  font-size: clamp(1.25rem, 1.9vw, 1.6rem);
  line-height: 1.7;
  color: #333f34;
}

/* Linha vertical fininha separando as duas mensagens */
.mensagem + .mensagem {
  border-left: 1px solid rgba(51, 63, 52, 0.25);
}

/* Indicadores */
.indicadores {
  display: flex;
  gap: 12px;
}

.indicador {
  position: relative;
  width: 44px;
  height: 20px; /* área de clique maior que a linha desenhada */
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.indicador::before,
.preenchimento {
  position: absolute;
  left: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
}

.indicador::before {
  content: '';
  right: 0;
  background: rgba(51, 63, 52, 0.2);
}

.preenchimento {
  width: 0;
  background: #536236;
}

.indicador.ativo .preenchimento {
  animation: encher 5s linear forwards;
}

.indicador.pausado .preenchimento {
  animation-play-state: paused;
}

.indicador:focus-visible {
  outline: 2px solid #536236;
  outline-offset: 2px;
}

@keyframes encher {
  from { width: 0; }
  to { width: 100%; }
}

/* Troca de mensagens: some e aparece devagar */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Quem pede menos movimento: sem troca automática, só pelos cliques nas linhas */
@media (prefers-reduced-motion: reduce) {
  .indicador.ativo .preenchimento {
    animation: none;
    width: 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

@media (max-width: 768px) {
  .palco {
    min-height: 420px;
  }

  .geral {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .mensagem + .mensagem {
    border-left: 0;
    border-top: 1px solid rgba(51, 63, 52, 0.25);
    padding-top: 28px;
  }
}
</style>
