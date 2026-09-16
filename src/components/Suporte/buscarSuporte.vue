<script setup>
import { computed, onMounted, ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const buscarTermo = ref('')
const suportes = ref([])
const filtros = ref({ data: '', status: '', prioridade: '' })
const imagemSelecionada = ref(null)
const alerta = ref('')
const ehAdministrador = computed(() => route.query.admin === 'true')

function obterStatus(item) {
  return item.status || item.chamada || 'em-andamento'
}

function textoStatus(status) {
  return status === 'resolvido' ? 'Resolvido' : 'Em andamento'
}

function formatarData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data
}

const suportesFiltrados = computed(() => {
  const termo = buscarTermo.value.trim().toLowerCase()

  return suportes.value.filter((item) => {
    const texto = [
      item.id,
      item.usuario?.nome,
      item.usuario?.email,
      item.assunto,
      item.usuario?.categoria,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return (
      (!termo || texto.includes(termo)) &&
      (!filtros.value.data || item.data === filtros.value.data) &&
      (!filtros.value.status || obterStatus(item) === filtros.value.status) &&
      (!filtros.value.prioridade || item.prioridade === filtros.value.prioridade)
    )
  })
})

onMounted(() => {
  suportes.value = JSON.parse(localStorage.getItem('suportes') || '[]').map((item) => ({
    ...item,
    status: obterStatus(item),
  }))
})

function apagarSuporte(id) {
  const suporte = suportes.value.find((item) => item.id === id)

  if (!suporte) {
    return
  }

  if (obterStatus(suporte) !== 'resolvido') {
    alerta.value = 'Atenção, para apagar você precisa marcar como resolvido.'
    return
  }

  // Remove o suporte diretamente da lista e atualiza o localStorage
  suportes.value = suportes.value.filter((item) => item.id !== id)
  localStorage.setItem('suportes', JSON.stringify(suportes.value))
}

function resolverSuporte(id) {
  suportes.value = suportes.value.map((item) =>
    item.id === id ? { ...item, status: 'resolvido' } : item,
  )
  localStorage.setItem('suportes', JSON.stringify(suportes.value))
}

function visualizarSuporte(id) {
  router.push({
    path: `/perfilSuporte/${id}`,
    query: ehAdministrador.value ? { admin: 'true' } : {},
  })
}

function limparFiltros() {
  buscarTermo.value = ''
  filtros.value = { data: '', status: '', prioridade: '' }
}

function abrirImagem(src, alt) {
  imagemSelecionada.value = { src, alt }
}

function fecharImagem() {
  imagemSelecionada.value = null
}

function fecharAlerta() {
  alerta.value = ''
}

function fecharImagemComEsc(event) {
  if (event.key === 'Escape') {
    fecharImagem()
  }
}
</script>

<template>
  <main class="principal">
    <h1>Buscar suporte</h1>

    <div class="barra-buscar">
      <input v-model="buscarTermo" type="text" placeholder="Buscar suporte..." />
      <span class="search-icon mdi mdi-magnify" aria-hidden="true"></span>
    </div>

    <div class="filtros">
      <div class="filtro">
        <label for="status">Status:</label>
        <select id="status" v-model="filtros.status">
          <option value="">Selecione o status</option>
          <option value="em-andamento">Em andamento</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </div>

      <div class="filtro">
        <label for="data">Data:</label>
        <input id="data" v-model="filtros.data" type="date" />
      </div>

      <div class="filtro-prioridade">
        <div class="filtro">
          <label for="prioridade">Prioridade:</label>
          <select id="prioridade" v-model="filtros.prioridade">
            <option value="">Selecione a prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        <button
          type="button"
          class="botao-limpar-filtros"
          aria-label="Limpar filtros"
          title="Limpar filtros"
          @click="limparFiltros"
        >
          <span class="trash-icon" aria-hidden="true">🗑️</span>
        </button>
      </div>
    </div>

    <div v-if="suportesFiltrados.length" class="resultados">
      <article v-for="item in suportesFiltrados" :key="item.id" class="suporte">
        <div class="suporte-cabecalho">
          <div>
            <h2>
              {{ item.assunto || 'Suporte' }} -
              <span class="id-titulo">Id:{{ item.id }}</span>
            </h2>
            <div class="suporte-detalhes">
              <p>
                <strong>ID:</strong> <span class="valor-suporte">{{ item.id }}</span>
              </p>
              <p>
                <strong>Nome:</strong> <span class="valor-suporte">{{ item.usuario?.nome }}</span>
              </p>
              <p>
                <strong>Email:</strong> <span class="valor-suporte">{{ item.usuario?.email }}</span>
              </p>
              <p>
                <strong>Data:</strong>
                <span class="valor-suporte">{{ formatarData(item.data) }}</span>
              </p>
              <p>
                <strong>Status:</strong>
                <span class="valor-suporte">{{ textoStatus(obterStatus(item)) }}</span>
              </p>
              <p>
                <strong>Prioridade:</strong>
                <span class="valor-suporte">{{ item.prioridade }}</span>
              </p>
              <p v-if="item.usuario?.categoria">
                <strong>Categoria:</strong>
                <span class="valor-suporte">{{ item.usuario.categoria }}</span>
              </p>
            </div>
          </div>
          <button
            v-if="item.usuario?.foto || item.foto"
            type="button"
            class="botao-imagem"
            @click="
              abrirImagem(
                item.usuario?.foto || item.foto,
                `Imagem do suporte ${item.assunto || 'sem assunto'}`,
              )
            "
          >
            <img
              :src="item.usuario?.foto || item.foto"
              :alt="`Imagem do suporte ${item.assunto || 'sem assunto'}`"
              class="foto-suporte"
            />
          </button>
        </div>
        <p v-if="item.usuario?.descrever" class="descricao">
          <strong>Descrição:</strong>
          <span class="valor-suporte">{{ item.usuario.descrever }}</span>
        </p>
        <div class="acoes-suporte">
          <button
            v-if="obterStatus(item) !== 'resolvido'"
            type="button"
            class="botao-resolver"
            @click="resolverSuporte(item.id)"
          >
            Marcar como resolvido
          </button>
          <button type="button" class="botao-apagar" @click="apagarSuporte(item.id)">Apagar</button>
        </div>
      </article>
    </div>
  </main>

  <div
    v-if="imagemSelecionada"
    class="visualizador"
    role="dialog"
    aria-modal="true"
    aria-label="Imagem ampliada"
    tabindex="0"
    @click.self="fecharImagem"
    @keydown="fecharImagemComEsc"
  >
    <button
      type="button"
      class="fechar-visualizador"
      aria-label="Fechar imagem"
      @click="fecharImagem"
    >
      <span class="mdi mdi-close"></span>
    </button>
    <img :src="imagemSelecionada.src" :alt="imagemSelecionada.alt" class="imagem-ampliada" />
  </div>

  <!-- Alerta Estilizado -->
  <div
    v-if="alerta"
    class="alerta-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="titulo-alerta"
    @click.self="fecharAlerta"
  >
    <div class="alerta-caixa">
      <h2 id="titulo-alerta">Atenção</h2>
      <p>{{ alerta }}</p>
      <button type="button" class="botao-alerta" @click="fecharAlerta">Entendi</button>
    </div>
  </div>
</template>

<style scoped>
.principal {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  max-width: 1000px;
  margin: 0 auto;
  padding: 36px 28px 30px;
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-family: 'Italiana', serif;
  margin: 0 0 24px;
  color: #705335;
  font-size: 3.2rem;
  font-weight: 400;
  text-align: center;
}

/* Barra de Pesquisa */
.barra-buscar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 18px;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.barra-buscar input {
  width: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  color: #4a5435;
  font-family: inherit;
  font-size: 1.15rem;
  font-weight: 600;
}

.barra-buscar input::placeholder {
  color: #4a5435;
  opacity: 0.65;
}

.search-icon {
  color: #4a5435;
  font-size: 1.35rem;
  margin-left: 10px;
}

/* Filtros */
.filtros {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.filtro {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 10px 16px;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.filtro-prioridade {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
}

.filtro-prioridade .filtro {
  flex: 1;
}

.botao-limpar-filtros {
  display: grid;
  flex: 0 0 38px;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  background-color: #ebe2cc;
  color: #705335;
  border: 1.5px solid #8c7355;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.botao-limpar-filtros:hover {
  background-color: #536236;
  color: #f1ebd9;
}

.trash-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.filtro label {
  margin-right: 8px;
  color: #4a5435;
  font-weight: 700;
  font-size: 1.05rem;
  white-space: nowrap;
}

.filtro select,
.filtro input {
  width: 100%;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: 0;
  color: #4a5435;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
}

.filtro select {
  cursor: pointer;
}

.filtro select option {
  background-color: #ebe2cc;
  color: #4a5435;
  padding: 10px;
}

/* Resultados e Card de Suporte */
.resultados {
  display: grid;
  gap: 20px;
  margin: 20px 0;
}

.suporte {
  padding: 24px;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.suporte-cabecalho {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
}

.suporte-detalhes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 24px;
}

.suporte h2 {
  font-family: 'Italiana', serif;
  margin: 0 0 16px;
  color: #705335;
  font-size: 2rem;
  font-weight: 400;
}

.id-titulo {
  color: #705335;
}

.suporte p {
  margin: 4px 0;
  color: #4a5435;
  font-size: 1.05rem;
  font-weight: 700;
}

.valor-suporte {
  color: #705335;
  font-weight: 600;
}

.descricao {
  padding-top: 14px;
  margin-top: 14px;
  border-top: 1.5px solid #8c7355;
}

/* Foto do Suporte */
.foto-suporte {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border: 1.5px solid #8c7355;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.botao-imagem {
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
  cursor: zoom-in;
}

/* Modal de Visualização da Imagem */
.visualizador {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(0, 0, 0, 0.6);
}

.imagem-ampliada {
  max-width: min(100%, 1100px);
  max-height: calc(100vh - 64px);
  object-exit: contain;
  border: 2px solid #8c7355;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}

.fechar-visualizador {
  position: absolute;
  top: 18px;
  right: 22px;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin: 0;
  padding: 0;
  background: #ebe2cc;
  color: #705335;
  border: 1.5px solid #8c7355;
  border-radius: 50%;
  font-size: 1.4rem;
  cursor: pointer;
}

.fechar-visualizador:hover {
  background: #536236;
  color: #f1ebd9;
}

/* Botões do Suporte e Ações */
.acoes-suporte {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.acoes-suporte button {
  background-color: #536236;
  color: #f1ebd9;
  border: 1.5px solid #536236;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.acoes-suporte button:hover {
  background-color: #43502a;
  border-color: #43502a;
  transform: translateY(-2px);
}

.acoes-suporte .botao-apagar {
  background-color: transparent;
  color: #536236;
  border: 1.5px solid #536236;
}

.acoes-suporte .botao-apagar:hover {
  background-color: #536236;
  color: #f1ebd9;
}

/* Estilização do Alerta Personalizado */
.alerta-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
}

.alerta-caixa {
  width: 100%;
  max-width: 400px;
  padding: 28px;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.alerta-caixa h2 {
  font-family: 'Italiana', serif;
  margin: 0 0 12px;
  color: #705335;
  font-size: 2rem;
  font-weight: 400;
}

.alerta-caixa p {
  margin: 0 0 20px;
  color: #4a5435;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.4;
}

.botao-alerta {
  background-color: #536236;
  color: #f1ebd9;
  border: 1.5px solid #536236;
  border-radius: 50px;
  padding: 10px 24px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.botao-alerta:hover {
  background-color: #43502a;
  border-color: #43502a;
  transform: translateY(-2px);
}
</style>