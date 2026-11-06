<script setup>
import { computed } from 'vue'

// Layout de telas de entrada: foto de um lado, formulário do outro.
// Paciente     -> foto à ESQUERDA, formulário à DIREITA
// Profissional -> formulário à ESQUERDA, foto à DIREITA
const props = defineProps({
  tipo: { type: String, default: 'paciente' }, // 'paciente' ou 'profissional'
  titulo: { type: String, default: 'Entrar' },
  subtitulo: { type: String, default: '' }, // vazio = "Acesse sua conta de paciente/profissional"
  seletor: { type: Boolean, default: true }, // mostra os botões "Sou paciente / Sou profissional"
  largo: { type: Boolean, default: false }, // formulário mais largo (telas de cadastro)
  imagemPaciente: { type: String, default: '/banner-home.png' },
  imagemProfissional: { type: String, default: '/banner-home.png' },
  // Parte da foto que fica visível, da esquerda (0%) para a direita (100%).
  // Paciente mostra o prato; profissional mostra prato + colher + um pedaço da mão.
  focoPaciente: { type: String, default: '25%' },
  focoProfissional: { type: String, default: '45%' }
})

const emit = defineEmits(['update:tipo'])

const ehProfissional = computed(() => props.tipo === 'profissional')
const imagem = computed(() => (ehProfissional.value ? props.imagemProfissional : props.imagemPaciente))
const foco = computed(() => (ehProfissional.value ? props.focoProfissional : props.focoPaciente))
const subtituloFinal = computed(() => props.subtitulo || `Acesse sua conta de ${props.tipo}`)

const opcoes = [
  { valor: 'paciente', rotulo: 'Sou paciente' },
  { valor: 'profissional', rotulo: 'Sou profissional' }
]
</script>

<template>
  <main class="auth" :class="[`auth--${tipo}`, { 'auth--largo': largo }]">
    <!-- Cartão que "flutua" no meio da página: foto de um lado, formulário do outro -->
    <div class="cartao">
      <!-- A foto troca com um efeito suave quando o tipo muda -->
      <Transition name="foto">
        <div
          :key="tipo"
          class="foto"
          :class="`foto--${tipo}`"
          :style="{ '--imagem': `url(${imagem})`, '--foco': foco }"
          aria-hidden="true"
        ></div>
      </Transition>

      <section class="painel">
      <div class="conteudo">
        <div v-if="seletor" class="seletor" role="group" aria-label="Tipo de conta">
          <button
            v-for="opcao in opcoes"
            :key="opcao.valor"
            type="button"
            class="opcao"
            :class="{ ativa: tipo === opcao.valor }"
            :aria-pressed="tipo === opcao.valor"
            @click="emit('update:tipo', opcao.valor)"
          >
            {{ opcao.rotulo }}
          </button>
        </div>

        <h2>{{ titulo }}</h2>
        <p class="sub">{{ subtituloFinal }}</p>

        <!-- Aqui entra o formulário da página que usar este layout -->
        <slot />
      </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Italiana&family=Roboto:wght@400;500&display=swap');

/* Página: o cartão fica centralizado no espaço que sobra embaixo do menu */
.auth {
  display: grid;
  place-items: center;
  /* A tela inteira menos a altura do menu (100px) */
  min-height: calc(100svh - 100px);
  padding: clamp(24px, 4vw, 56px) clamp(16px, 4vw, 48px);
}

/* Cartão flutuante */
.cartao {
  /* Quanto da foto é cortado embaixo. A imagem do banner tem uma faixa clara/degradê
     no fim; cortando um pouco, a foto vai certinha até o final do cartão.
     Se ainda aparecer a faixa, aumente (ex.: 16%). Se cortar demais, diminua. */
  --corte: 12%;

  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-radius: 24px;
  overflow: hidden; /* a foto acompanha os cantos arredondados */
  background: #f7f3e1;
  box-shadow: 0 24px 60px rgba(51, 63, 52, 0.18);
}

/* Telas de cadastro: cartão mais largo, foto menor e formulário maior */
.auth--largo .cartao {
  max-width: 1120px;
}

.auth--largo.auth--paciente .cartao {
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
}

.auth--largo.auth--profissional .cartao {
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
}

/* ===== Foto ===== */
.foto {
  grid-row: 1;
  position: relative;
  overflow: hidden;
  min-height: 560px;
}

/* A imagem fica numa camada um pouco mais alta que a caixa; o excesso embaixo é cortado */
.foto::before {
  content: '';
  position: absolute;
  inset: 0 0 calc(var(--corte) * -1) 0;
  background-image: var(--imagem);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: var(--foco) 100%;
}

.foto--paciente {
  grid-column: 1;
}

.foto--profissional {
  grid-column: 2;
}

/* ===== Painel do formulário: vai para o lado oposto ao da foto ===== */
.painel {
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(32px, 4vw, 56px);
  background: #f7f3e1;
}

.auth--paciente .painel {
  grid-column: 2;
}

.auth--profissional .painel {
  grid-column: 1;
}

.conteudo {
  width: 100%;
}

/* ===== Seletor paciente / profissional ===== */
.seletor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  margin-bottom: 28px;
  border: 1px solid rgba(51, 63, 52, 0.2);
  border-radius: 12px;
  background: rgba(83, 98, 54, 0.06);
}

.opcao {
  padding: 11px 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #536236;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.opcao:not(.ativa):hover {
  background: rgba(83, 98, 54, 0.12);
}

.opcao.ativa {
  background: #536236;
  color: #f1edd2;
}

.opcao:focus-visible {
  outline: 3px solid #73441b;
  outline-offset: 2px;
}

/* ===== Título ===== */
.conteudo h2 {
  font-family: 'Italiana', serif;
  font-size: clamp(2.6rem, 4vw, 3.4rem);
  line-height: 1.1;
  color: #73441b;
  text-align: center;
  margin: 0 0 8px;
}

.sub {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #536236;
  text-align: center;
  margin: 0 0 28px;
}

/* ===== Estilo do formulário (vale para tudo que estiver dentro do slot) =====
   Classes para usar no formulário: rotulo, campo, botao, botao-secundario,
   acoes, erro, texto-extra, links */
.conteudo :deep(.rotulo) {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333f34;
  margin-bottom: 6px;
}

.conteudo :deep(.campo) {
  display: block;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  margin-bottom: 18px;
  border: 1px solid rgba(115, 68, 27, 0.5);
  border-radius: 10px;
  background: #fbf8ec;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #333f34;
  box-sizing: border-box;
}

.conteudo :deep(.campo:focus) {
  outline: 2px solid #536236;
  outline-offset: 2px;
  border-color: #536236;
}

.conteudo :deep(.botao),
.conteudo :deep(.botao-secundario) {
  display: block;
  width: 100%;
  height: 54px;
  margin-top: 6px;
  border-radius: 10px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.conteudo :deep(.botao) {
  border: 1.5px solid #536236;
  background: #536236;
  color: #f1edd2;
}

.conteudo :deep(.botao:hover) {
  background: #333f34;
  border-color: #333f34;
}

.conteudo :deep(.botao-secundario) {
  border: 1.5px solid #536236;
  background: transparent;
  color: #536236;
}

.conteudo :deep(.botao-secundario:hover) {
  background: rgba(83, 98, 54, 0.1);
}

.conteudo :deep(.botao:focus-visible),
.conteudo :deep(.botao-secundario:focus-visible) {
  outline: 3px solid #73441b;
  outline-offset: 3px;
}

/* Dois botões lado a lado (ex.: Confirmar e Cancelar) */
.conteudo :deep(.acoes) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 12px;
}

.conteudo :deep(.acoes .botao),
.conteudo :deep(.acoes .botao-secundario) {
  margin-top: 0;
}

.conteudo :deep(.erro) {
  font-size: 0.9rem;
  color: #a13d3d;
  text-align: center;
  margin: 0 0 14px;
}

.conteudo :deep(.texto-extra) {
  font-size: 0.92rem;
  color: #536236;
  text-align: center;
  margin: 22px 0 8px;
}

.conteudo :deep(.links) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
}

.conteudo :deep(.links a) {
  font-size: 0.92rem;
  font-weight: 500;
  color: #73441b;
  text-decoration: underline;
}

/* ===== Troca da foto ===== */
.foto-enter-active,
.foto-leave-active {
  transition: opacity 0.5s ease;
}

.foto-enter-from,
.foto-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .foto-enter-active,
  .foto-leave-active {
    transition: none;
  }
}

/* ===== Celular e tablet: a foto vira uma faixa em cima ===== */
@media (max-width: 900px) {
  .auth {
    min-height: 0;
    place-items: start center;
  }

  .cartao,
  .auth--largo.auth--paciente .cartao,
  .auth--largo.auth--profissional .cartao {
    grid-template-columns: 1fr;
    grid-template-rows: 180px auto;
    max-width: 620px;
  }

  .foto {
    min-height: 0;
  }

  /* Na faixa do celular, mostra a parte de cima do prato (sem a faixa clara de baixo) */
  .foto::before {
    inset: 0;
    background-position: var(--foco) 35%;
  }

  .foto--paciente,
  .foto--profissional,
  .auth--paciente .painel,
  .auth--profissional .painel {
    grid-column: 1;
  }

  .painel {
    grid-row: 2;
  }
}

@media (max-width: 560px) {
  .painel {
    padding: 28px 22px;
  }

  .conteudo :deep(.acoes) {
    grid-template-columns: 1fr;
  }
}
</style>
