<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuarioLogado, isPaciente, carregarUsuario } = useAuth()
const buscaTermo = ref('')

const pratosPadrao = [
  {
    id: 1,
    nome: 'Arroz de Frango Cremoso',
    profissional: 'Marcos Oliveira Santos',
    data: '23/01/26',
    calorias: '730 Kcal',
    foto: '/img/prato.png',
    modoPreparo:
      'Faça a mistura cremosa: Em uma panela pequena ou frigideira grande, coloque o frango desfiado, o milho e adicione o creme de leite (ou requeijão). Mexa em fogo baixo até esquentar e ficar bem homogêneo.',
    ingredientes: [
      '1 xícara (130g): de arroz branco cozido',
      '1 colher de sopa: de azeite de oliva extra virgem',
      '1 pedaço médio (100g): de mandioca ou batata-doce cozida e amassada (estilo purê)',
    ],
  },
  {
    id: 2,
    nome: 'Crepioca de Frango',
    profissional: 'Marcos Oliveira Santos',
    data: '24/02/26',
    calorias: '360 Kcal',
    foto: '/img/prato (1).png',
    modoPreparo:
      'Prepare a massa: Em um recipiente, bata bem o ovo com a goma de tapioca, a água, o sal e o orégano até ficar uma mistura homogênea. Grelhe a crepioca: Aqueça uma frigideira antiaderente em fogo baixo.',
    ingredientes: [
      '1: ovo inteiro',
      '1 colher de sopa: de goma de tapioca',
      '1 colher de sopa: de água (para deixar a massa mais leve)',
    ],
  },
]

const pratos = ref([])

onMounted(() => {
  carregarUsuario()

  const cadastrados = JSON.parse(localStorage.getItem('listaPratos') || '[]')
  
  pratos.value = [...cadastrados, ...pratosPadrao]
})

const pratosFiltrados = computed(() => {
  const termo = buscaTermo.value.trim().toLowerCase()
  if (!termo) return pratos.value

  return pratos.value.filter(
    (item) =>
      item.nome.toLowerCase().includes(termo) || item.profissional.toLowerCase().includes(termo),
  )
})

const temPratos = computed(() => pratos.value.length > 0)

function verPrato(prato) {
  localStorage.setItem('pratoSelecionadoId', prato.id)
  localStorage.setItem('pratoSelecionado', JSON.stringify(prato))
  router.push('/pratos/ver-prato')
}
</script>

<template>
  <div class="container">
    <template v-if="isPaciente">
      <template v-if="temPratos">
        <h1>Buscar Pratos Personalizados</h1>

        <div class="search-bar">
          <input type="text" v-model="buscaTermo" placeholder="Pratos Personalizados..." />
          <span class="search-icon">🔍</span>
        </div>

        <div class="card-list">
          <div v-for="prato in pratosFiltrados" :key="prato.id" class="dish-card">
            
            <!-- Coluna Esquerda: Foto e Botão Ver Prato -->
            <div class="left-col">
              <img v-if="prato.foto" :src="prato.foto" :alt="prato.nome" class="dish-img" />
              <div v-else class="dish-img placeholder">Sem imagem</div>
              <button class="btn-ver" @click="verPrato(prato)">Ver Prato</button>
            </div>

            <!-- Coluna Central: Informações e Modo de Preparo com Scroll -->
            <div class="center-col">
              <p class="field">
                <strong>Nome do Prato:</strong>
                <span class="highlight">{{ prato.nome }}</span>
              </p>
              <p class="field">
                <strong>Nome do Profissional:</strong>
                <span class="highlight">{{ prato.profissional }}</span>
              </p>

              <div class="section-block">
                <h3>Modo de Preparo</h3>
                <div class="scroll-box">
                  <p class="text-body">{{ prato.modoPreparo }}</p>
                </div>
              </div>
            </div>

            <!-- Coluna Direita: Informações e Ingredientes com Scroll -->
            <div class="right-col">
              <p class="field">
                <strong>Data de Criação:</strong>
                <span class="highlight">{{ prato.data }}</span>
              </p>
              <p class="field">
                <strong>Calorias:</strong>
                <span class="highlight">{{ prato.calorias }}</span>
              </p>

              <div class="section-block">
                <h3>Ingredientes</h3>
                <div class="scroll-box">
                  <ul>
                    <li v-for="(ing, idx) in prato.ingredientes" :key="idx">• {{ ing }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <p v-if="pratosFiltrados.length === 0" class="no-results">
            Nenhum prato encontrado para "{{ buscaTermo }}".
          </p>
        </div>
      </template>

      <template v-else>
        <p class="sem-pratos">Você ainda não tem pratos cadastrados.</p>
      </template>
    </template>

    <template v-else>
      <p class="nao-logado">Você precisa estar logado para ver seus pratos.</p>
    </template>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #73441b;
  text-align: center;
  font-size: 2.8rem;
  font-family: 'Cinzel', serif;
  margin-bottom: 24px;
  font-weight: normal;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto 28px auto;
}

.search-bar input {
  width: 100%;
  padding: 12px 45px 12px 20px;
  border-radius: 20px;
  border: 1px solid #5d6742;
  background-color: #909867;
  color: #2b3323;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.search-bar input::placeholder {
  color: #2b3323;
  opacity: 0.8;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dish-card {
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
  gap: 16px;
  background-color: #e6dcbe;
  border: 1px solid #8c5322;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #4a2e16;
  align-items: start;
}

.left-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.dish-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #8c5322;
}

.dish-img.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e7dcc2;
  color: #73441b;
  font-weight: 700;
  font-size: 0.72rem;
  text-align: center;
  padding: 8px;
}

.btn-ver {
  background-color: #69734d;
  color: #fff;
  border: 1px solid #4a5235;
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-ver:hover {
  background-color: #58613e;
}

.field {
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #333f34;
  font-weight: bold;
}

.highlight {
  color: #a8743c;
  margin-left: 4px;
  font-weight: bold;
}

.section-block h3 {
  font-size: 1rem;
  color: #333f34;
  margin: 12px 0 6px 0;
  text-align: center;
  font-weight: bold;
}

/* Caixa com barra de rolagem customizada idêntica à referência */
.scroll-box {
  max-height: 110px;
  overflow-y: auto;
  padding-right: 4px;
}

.scroll-box::-webkit-scrollbar {
  width: 6px;
}

.scroll-box::-webkit-scrollbar-track {
  background: #d8ceb0;
  border-radius: 10px;
}

.scroll-box::-webkit-scrollbar-thumb {
  background: #69734d;
  border-radius: 10px;
}

.text-body {
  font-size: 0.8rem;
  line-height: 1.3;
  font-weight: bold;
  color: #536236;
  margin: 0;
}

.right-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.right-col li {
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 4px;
  color: #536236;
  font-weight: bold;
}

.no-results,
.nao-logado,
.sem-pratos {
  color: #536236;
  text-align: center;
  font-weight: bold;
  padding: 40px 0;
}
</style>
