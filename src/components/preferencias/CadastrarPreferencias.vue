<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const STORAGE_KEY = 'nutriVitae.preferencias'

const criarPreferenciasVazias = () => ({
  objetivo: '',
  dieta: [],
  preferencias: [],
  alergias: [],
  outroObjetivo: '',
  outraDieta: '',
  outrasPreferencias: '',
  outrasAlergias: ''
})

function carregarPreferencias() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (!salvo) return criarPreferenciasVazias()

    const dados = JSON.parse(salvo)
    return { ...criarPreferenciasVazias(), ...dados }
  } catch (error) {
    console.error('Erro ao carregar preferências:', error)
    return criarPreferenciasVazias()
  }
}

const preferencias = ref(carregarPreferencias())

function selecionarObjetivo(item) {
  if (preferencias.value.objetivo === item) {
    preferencias.value.objetivo = ''
  } else {
    preferencias.value.objetivo = item
  }
}

function toggleSelecao(lista, item) {
  const index = preferencias.value[lista].indexOf(item)
  if (index > -1) {
    preferencias.value[lista].splice(index, 1)
  } else {
    preferencias.value[lista].push(item)
  }
}

function limpar() {
  preferencias.value = criarPreferenciasVazias()
  localStorage.removeItem(STORAGE_KEY)
}

function confirmar() {
  const p = preferencias.value
  const temAlgoPreenchido = 
    p.objetivo !== '' || 
    p.dieta.length > 0 || 
    p.preferencias.length > 0 || 
    p.alergias.length > 0 || 
    p.outroObjetivo.trim() !== '' || 
    p.outraDieta.trim() !== '' || 
    p.outrasPreferencias.trim() !== '' || 
    p.outrasAlergias.trim() !== ''

  if (!temAlgoPreenchido) {
    alert('Você precisa selecionar ou preencher ao menos uma informação antes de confirmar.')
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencias.value))
    router.push('/perfil')
  } catch (error) {
    console.error('Erro ao salvar preferências:', error)
    alert('Não foi possível salvar suas informações. Tente novamente.')
  }
}
</script>

<template>
  <main class="container">
    <h1>Preferências do Paciente</h1>

    <!-- Objetivo do Usuário (Seleção Única) -->
    <div class="secao-titulo"><span>Objetivo do Paciente</span></div>
    <div class="grid-form">
      <div 
        v-for="item in ['Emagrecimento', 'Comer Saudável', 'Pré-Treino', 'Ganho de Massa', 'Saúde']" 
        :key="item"
        class="input-card"
        :class="{ selecionado: preferencias.objetivo === item }"
        @click="selecionarObjetivo(item)"
      >
        <span class="radio-circle"></span>
        <label>{{ item }}</label>
      </div>
      <div class="input-card outro-card">
        <input type="text" placeholder="Outros" v-model="preferencias.outroObjetivo" />
      </div>
    </div>

    <!-- Dieta do Usuário -->
    <div class="secao-titulo"><span>Dieta do Paciente</span></div>
    <div class="grid-form">
      <div 
        v-for="item in ['Vegetariano', 'Vegano', 'Onívoro', 'Carnívoro', 'Low Carb']" 
        :key="item"
        class="input-card multi-card"
        :class="{ 'card-ativo': preferencias.dieta.includes(item) }"
        @click="toggleSelecao('dieta', item)"
      >
        <label>{{ item }}</label>
        <span class="plus-icon">+</span>
      </div>
      <div class="input-card outro-card">
        <input type="text" placeholder="Outros" v-model="preferencias.outraDieta" />
      </div>
    </div>

    <!-- Preferências do Usuário -->
    <div class="secao-titulo"><span>Preferências do Paciente</span></div>
    <div class="grid-form">
      <div 
        v-for="item in ['Vegetais', 'Peixes', 'Integral', 'Carnes Magras', 'Leguminosas']" 
        :key="item"
        class="input-card multi-card"
        :class="{ 'card-ativo': preferencias.preferencias.includes(item) }"
        @click="toggleSelecao('preferencias', item)"
      >
        <label>{{ item }}</label>
        <span class="plus-icon">+</span>
      </div>
      <div class="input-card outro-card">
        <input type="text" placeholder="Outros" v-model="preferencias.outrasPreferencias" />
      </div>
    </div>

    <!-- Alergias do Usuário -->
    <div class="secao-titulo"><span>Alergias do Paciente</span></div>
    <div class="grid-form">
      <div 
        v-for="item in ['Glúten', 'Soja', 'Ovos', 'Lactose', 'Frutos do Mar']" 
        :key="item"
        class="input-card multi-card"
        :class="{ 'card-ativo': preferencias.alergias.includes(item) }"
        @click="toggleSelecao('alergias', item)"
      >
        <label>{{ item }}</label>
        <span class="plus-icon">+</span>
      </div>
      <div class="input-card outro-card">
        <input type="text" placeholder="Outros" v-model="preferencias.outrasAlergias" />
      </div>
    </div>

    <div class="botoes">
      <button @click="limpar" class="btn-limpar">Limpar</button>
      <button @click="confirmar" class="btn-salvar">Confirmar Suas Preferências</button>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #73441b;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 24px;
  font-weight: bold;
}

.secao-titulo {
  display: flex;
  align-items: center;
  text-align: center;
  color: #73441b;
  font-size: 0.95rem;
  margin: 24px 0 16px 0;
}

.secao-titulo::before,
.secao-titulo::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #536236;
}

.secao-titulo span {
  padding: 0 15px;
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.input-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid #73441b;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  background-color: transparent;
}

.input-card:hover {
  background-color: #efe8d0;
}

/* Estilo para Objetivo (Seleção Única) */
.input-card.selecionado {
  border-color: #73441b;
  background-color: #f7f4e7;
}

.input-card label {
  color: #5a4a35;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border: 2px solid #b5a68c;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}

.input-card.selecionado .radio-circle::after {
  content: '';
  width: 8px;
  height: 8px;
  background-color: #73441b;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.input-card.card-ativo {
  background-color: #536236;
  border-color: #536236;
}

.input-card.card-ativo label {
  color: #ffffff;
}

.input-card.card-ativo .plus-icon {
  color: #ffffff;
  border-color: #ffffff;
}

.plus-icon {
  color: #73441b;
  font-weight: bold;
  font-size: 1.1rem;
  border: 1px solid #b5a68c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.outro-card {
  cursor: default;
  background-color: #f7f4e7;
}

.outro-card input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #5a4a35;
  font-size: 0.95rem;
}

.outro-card input::placeholder {
  color: #5a4a35;
}

.botoes {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 32px;
}

.btn-limpar {
  padding: 12px 24px;
  background-color: #dcd6c0;
  color: #5a4a35;
  border: 1px solid #b5a68c;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-salvar {
  padding: 12px 32px;
  background-color: #536236;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-salvar:hover {
  background-color: #45522d;
}

/* --- ADAPTAÇÃO PARA CELULAR --- */
@media (max-width: 768px) {
  .container {
    padding: 12px;
  }

  h1 {
    font-size: 30px;
    margin: 30px 30px;
  }

  .grid-form {
    grid-template-columns: 1fr; 
  }

  .botoes {
    flex-direction: column-reverse; 
  }

  .btn-limpar, 
  .btn-salvar {
    width: 100%;
    text-align: center;
  }
}
</style>