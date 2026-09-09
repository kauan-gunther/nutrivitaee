<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { usuarioLogado, carregarUsuario } = useAuth()
const meusAgendamentos = ref([])

onMounted(() => {
  carregarUsuario()
  const salvos = localStorage.getItem('dadosAgendamento')
  if (salvos) {
    const dados = JSON.parse(salvos)
    meusAgendamentos.value = Array.isArray(dados) ? dados : [dados]
  }
})

const estaLogado = computed(() => !!usuarioLogado.value)

// NOVO: diz se, além de logada, a pessoa já tem algum agendamento salvo.
// É essa variável que vai decidir entre o ESTADO 2 e o ESTADO 3 do template.
const temAgendamentos = computed(() => meusAgendamentos.value.length > 0)

// Mesma função de formatação de data que você já usa no resumoComponent,
// só repeti aqui porque essa view não importa nada de lá.
function formatarData(dataIso) {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}
</script>

<template>
  <main class="agendamentos-container">
    <header class="hero-banner">
      <h1>Seus agendamentos com profissionais de saúde</h1>
    </header>

    <div class="content-body">
      <!-- ESTADO 1: Deslogado -> Redireciona para /cadastro (igual já estava) -->
      <section v-if="!estaLogado" class="card-status-box dashed-border">
        <h2 class="status-title">Não há agendamentos para você</h2>
        <p class="status-sub">
          Você precisa estar logado para visualizar seus agendamentos. Eles aparecerão aqui!
        </p>

        <RouterLink to="/cadastro" class="btn-action"> Fazer o login </RouterLink>
      </section>

      <!-- ESTADO 2: Logada, mas ainda sem nenhum agendamento -->
      <section v-else-if="!temAgendamentos" class="card-status-box dashed-border">
        <h2 class="status-title">Você ainda não tem agendamentos</h2>
        <p class="status-sub">
          Escolha um profissional e marque sua primeira consulta. Ela vai aparecer aqui!
        </p>

        <RouterLink to="/agendamento" class="btn-action"> Agendar Consulta </RouterLink>
      </section>

      <!-- ESTADO 3: Logada e com um ou mais agendamentos -->
      <section v-else class="lista-agendamentos">
        <div class="lista-header">
          <h2 class="status-title-alt">Seus agendamentos</h2>
          <RouterLink to="/agendamento" class="btn-action-small">+ Novo agendamento</RouterLink>
        </div>

        <div v-for="(item, index) in meusAgendamentos" :key="index" class="agendamento-card">
          <div class="agendamento-info">
            <p><strong>Profissional:</strong> {{ item.profissional?.nome || 'Não informado' }}</p>
            <p><strong>Paciente:</strong> {{ item.usuario?.nome || 'Não informado' }}</p>
            <p>
              <strong>Data:</strong> {{ formatarData(item.consulta?.data) }} às
              {{ item.consulta?.horario }}
            </p>
            <p><strong>Tipo:</strong> {{ item.consulta?.tipo }}</p>
          </div>

          <RouterLink to="/resumo" class="btn-detalhe">Ver detalhes</RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.hero-banner {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url('/img/banner-agendamentos.png');
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
  color: #F1EDD2;
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
  background-color: transparent;
  padding: 40px 30px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
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
  display: inline-block;
  background-color: #536236;
  color: #F1EDD2;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-action:hover {
  opacity: 0.9;
}

.lista-agendamentos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lista-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.status-title-alt {
  color: #536236;
  font-size: 30px;
  font-weight: bold;
  margin: 0;
}

.btn-action-small {
  display: inline-block;
  background-color: #536236;
  color: #F1EDD2;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.btn-action-small:hover {
  opacity: 0.9;
}

.agendamento-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1.5px solid #6a411d;
  border-radius: 20px;
  padding: 20px;
  flex-wrap: wrap;
}

.agendamento-info p {
  margin: 4px 0;
  color: #BF945A;
  font-size: 0.95rem;
  font-weight: bold;
}

.agendamento-info strong {
  color: #536236;
  font-weight: bold;
}

.btn-detalhe {
  background-color: transparent;
  border: 1.5px solid #536236;
  color: #333f34;
  font-weight: bold;
  border-radius: 14px;
  padding: 8px 18px;
  font-size: 0.95rem;
  text-decoration: none;
  white-space: nowrap;
}
</style>
