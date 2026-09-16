<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario } = useAuth()

const receitas = ref([])
const buscaTermo = ref('')

const estaLogado = computed(() => {
  const usuario = usuarioLogado.value
  return !!usuario && !!(usuario.email || usuario.id || usuario.nome || usuario.tipo || usuario._id)
})
const temReceitas = computed(() => receitas.value.length > 0)

onMounted(() => {
  carregarUsuario()

  const todas = JSON.parse(localStorage.getItem('listaPratos') || '[]')

  if (usuarioLogado.value) {
    receitas.value = todas.filter((item) => {
      if (isProfissional.value) return item.profissional?.id === usuarioLogado.value.id
      return item.usuario?.id === usuarioLogado.value.id
    })
  }
})

const receitasFiltradas = computed(() => {
  const termo = buscaTermo.value.trim().toLowerCase()
  if (!termo) return receitas.value

  return receitas.value.filter((item) => {
    const pessoa = isProfissional.value ? item.usuario?.nome : item.profissional?.nome
    return (
      item.nome.toLowerCase().includes(termo) ||
      (pessoa && pessoa.toLowerCase().includes(termo))
    )
  })
})

const textos = computed(() => {
  if (!estaLogado.value) return { hero: 'Pratos Personalizados' }

  if (isProfissional.value) {
    return {
      hero: 'Seus Pratos Personalizados',
      semReceitasTitulo: 'Não há recomendações de Pratos Personalizados',
      semReceitasSub: 'Cadastre Pratos que você recomenda! Elas aparecerão aqui!',
      rotuloPessoa: 'Para o Paciente',
      botaoConversar: 'Conversar com Paciente',
      placeholderBusca: 'Buscar por prato ou paciente...',
    }
  }
  return {
    hero: 'Pratos Personalizados Recomendados pelos Profissionais De Saúde',
    semReceitasTitulo: 'Não há pratos personalizados recomendados para você',
    semReceitasSub: 'Converse com profissionais e eles recomendarão pratos personalizados para você, elas aparecerão aqui!',
    rotuloPessoa: 'Recomendado Por',
    botaoConversar: 'Conversar com Profissional',
    placeholderBusca: 'Buscar por prato ou profissional...',
  }
})

function verPrato(prato) {
  localStorage.setItem('pratoSelecionadoId', prato.id)
  localStorage.setItem('pratoSelecionado', JSON.stringify(prato))
  router.push('/pratos/ver-prato')
}

function conversar(prato) {
  const destinoId = isProfissional.value ? prato.usuario?.id : prato.profissional?.id
  router.push(`/mensagens/${destinoId}`)
}
</script>

<template>
  <main class="receitas-container">
    <header class="hero-banner">
      <h1>{{ textos.hero }}</h1>
    </header>

    <div class="content-body">
      <section v-if="!estaLogado" class="card-status-box dashed-border">
        <h2 class="status-title">Não há pratos personalizados para você</h2>
        <p class="status-sub">Você precisa estar logado para ver seus pratos personalizados recomendados.</p>
        <RouterLink to="/login" class="btn-action">Fazer login</RouterLink>
      </section>

  
<section v-else-if="!temReceitas" class="card-status-box dashed-border">
  <h2 class="status-title">{{ textos.semReceitasTitulo }}</h2>
  <p class="status-sub">{{ textos.semReceitasSub }}</p>
  <RouterLink
    v-if="!isProfissional"
    to="/consultas/:id/agendamento"
    class="btn-action"
  >
    Agendar Consulta
  </RouterLink>
</section>
      <section v-else class="lista-receitas">
        <div class="search-bar">
          <input type="text" v-model="buscaTermo" :placeholder="textos.placeholderBusca" />
          <span class="search-icon">🔍</span>
        </div>

        <div class="card-list">
          <div v-for="receita in receitasFiltradas" :key="receita.id" class="dish-card">
            <div class="left-col">
              <img v-if="receita.foto" :src="receita.foto" :alt="receita.nome" class="dish-img" />
              <div v-else class="dish-img placeholder">Sem imagem</div>
              <button class="btn-ver" @click="verPrato(receita)">Ver Prato</button>
              <button class="btn-conversar" @click="conversar(receita)">{{ textos.botaoConversar }}</button>
            </div>

            <div class="center-col">
              <p class="field">
                <strong>Nome do Prato:</strong>
                <span class="highlight">{{ receita.nome }}</span>
              </p>
              <p class="field">
                <strong>{{ textos.rotuloPessoa }}:</strong>
                <span class="highlight">
                  {{ isProfissional ? receita.usuario?.nome : receita.profissional?.nome }}
                </span>
              </p>

              <div class="section-block">
                <h3>Modo de Preparo</h3>
                <p class="text-body">{{ receita.modoPreparo }}</p>
              </div>
            </div>

            <div class="right-col">
              <p class="field">
                <strong>Data de Criação:</strong>
                <span class="highlight">{{ receita.data }}</span>
              </p>
              <p class="field">
                <strong>Calorias:</strong>
                <span class="highlight">{{ receita.calorias }}</span>
              </p>

              <div class="section-block">
                <h3>Ingredientes</h3>
                <ul>
                  <li v-for="(ing, idx) in receita.ingredientes" :key="idx">• {{ ing }}</li>
                </ul>
              </div>
            </div>
          </div>

          <p v-if="receitasFiltradas.length === 0" class="no-results">
            Nenhuma receita encontrada para "{{ buscaTermo }}".
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.hero-banner {
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/img/banner-receitasCliente.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.hero-banner h1 {
  color: #f1edd2;
  font-size: 80px;
  font-weight: normal;
  margin: 0;
  text-align: center;
}

.content-body {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.card-status-box {
  display: block;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 40px 30px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
}

.dashed-border {
  border: 2px dashed #6a411d;
  border-radius: 28px;
}

.status-title {
  color: #536236;
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.status-sub {
  color: #73441b;
  font-size: 0.95rem;
  margin-bottom: 24px;
  line-height: 1.4;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #536236;
  color: #f1edd2 !important;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  text-decoration: none !important;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  line-height: 1;
}

.btn-action:hover {
  background-color: #43502a;
  transform: translateY(-1px);
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
  max-width: 850px;
  margin: 0 auto;
}

.dish-card {
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
  gap: 16px;
  background-color: #d6caaf;
  border: 1px solid #8c5322;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #4a2e16;
}

.left-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.dish-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #8c5322;
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

.btn-ver,
.btn-conversar {
  display: block;
  width: 100%;
  background-color: #536236;
  color: #f1ebd9;
  border: 1.5px solid #536236;
  border-radius: 12px;
  padding: 8px 10px;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.btn-ver:hover,
.btn-conversar:hover {
  background-color: #43502a;
  border-color: #43502a;
  transform: translateY(-1px);
}

@media (max-width: 700px) {
  .hero-banner {
    min-height: 100vh;
    width: 100%;
    background-size: cover;
    background-position: center;
    padding: 20px 16px;
  }

  .hero-banner h1 {
    font-size: 65px;
    line-height: 1.2;
  }
}
</style>