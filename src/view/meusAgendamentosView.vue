<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { usuarioLogado, isPaciente, isProfissional, carregarUsuario } = useAuth()
const meusAgendamentos = ref([])

onMounted(() => {
  carregarUsuario()

  const salvos = localStorage.getItem('dadosAgendamento')
  if (salvos && usuarioLogado.value) {
    const dados = JSON.parse(salvos)
    const lista = Array.isArray(dados) ? dados : [dados]

    meusAgendamentos.value = lista.filter((item) => {
      if (isProfissional.value) {
        return item.profissional?.id === usuarioLogado.value.id
      }
      return item.usuario?.id === usuarioLogado.value.id
    })
  }
})

const estaLogado = computed(() => !!usuarioLogado.value)

const temAgendamentos = computed(() => meusAgendamentos.value.length > 0)

function formatarData(dataIso) {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}

const textos = computed(() => {
  if (!estaLogado.value) {
    return { hero: 'Agendamentos' }
  }
  if (isProfissional.value) {
    return {
      hero: 'Suas Consultas Agendadas Com os Seus Pacientes',
      semAgendTitulo: 'Você ainda não tem nenhuma consulta agendada',
      semAgendSub: 'Escolha um paciente e agende sua primeira consulta. Ela vai aparecer aqui!',
      listaTitulo: 'Suas consultas agendadas',
      botaoNovo: '+ Nova consulta',
    }
  }
  return {
    hero: 'Seus agendamentos com profissionais de saúde',
    semAgendTitulo: 'Você ainda não tem agendamentos',
    semAgendSub: 'Escolha um profissional e marque sua primeira consulta. Ela vai aparecer aqui!',
    listaTitulo: 'Seus agendamentos',
    botaoNovo: '+ Novo agendamento',
  }
})
</script>

<template>
  <main class="agendamentos-container">
    <header class="hero-banner">
      <h1>{{ textos.hero }}</h1>
    </header>

    <div class="content-body">
      <!-- ESTADO 1: Deslogado -> Redireciona para /cadastro -->
      <section v-if="!estaLogado" class="card-status-box dashed-border">
        <h2 class="status-title">Não há agendamentos para você</h2>
        <p class="status-sub">
          Você precisa estar logado para visualizar seus agendamentos. Eles aparecerão aqui!
        </p>
        <RouterLink to="/login" class="btn-action">Fazer login</RouterLink>
      </section>

      <!-- ESTADO 2: Logada, mas ainda sem nenhum agendamento -->
      <section v-else-if="!temAgendamentos" class="card-status-box dashed-border">
        <h2 class="status-title">{{ textos.semAgendTitulo }}</h2>
        <p class="status-sub">{{ textos.semAgendSub }}</p>
        <RouterLink to="/agendamento" class="btn-action">Agendar Consulta</RouterLink>
      </section>

      <!-- ESTADO 3: Logada e com um ou mais agendamentos -->
      <section v-else class="lista-agendamentos">
        <div class="lista-header">
          <h2 class="status-title-alt">{{ textos.listaTitulo }}</h2>
          <RouterLink to="/agendamento" class="btn-action-small">{{ textos.botaoNovo }}</RouterLink>
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
.agendamentos-container {
  width: 100%;
  overflow-x: hidden;
}

.hero-banner {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/img/banner-agendamentos.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  min-height: calc(100vh - 80px);
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  box-sizing: border-box;
}

.hero-banner h1 {
  color: #f1edd2;
  font-size: clamp(2.2rem, 5vw, 4.5rem); /* Ajuste responsivo fluido */
  font-weight: normal;
  margin: 0;
  text-align: center;
  line-height: 1.2;
  max-width: 900px;
}

.content-body {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
}

.card-status-box {
  background-color: transparent;
  padding: 30px 20px;
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
  font-size: clamp(1.2rem, 2vw, 1.4rem);
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
  color: #f1edd2;
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
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: bold;
  margin: 0;
}

.btn-action-small {
  display: inline-block;
  background-color: #536236;
  color: #f1edd2;
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
  box-sizing: border-box;
}

.agendamento-info p {
  margin: 4px 0;
  color: #bf945a;
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

/* Ajustes específicos para telas bem pequenas */
@media (max-width: 600px) {
  .agendamento-card {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-detalhe {
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }

  .lista-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>