<script setup>
import { ref, computed, onMounted } from 'vue'

const buscaTermo = ref('')
const agendamentos = ref([
  {
    id: 1,
    profissional: {
      nome: 'Dra. Carolina Paz Alencar',
      foto: '/profissionais/ana.png',
    },
    paciente: {
      nome: 'Gabriel Lima da Costa',
      foto: '/logo.png',
    },
    data: '17/08/2026',
    horario: '14h30 / 02h30 pm',
    tipo: 'Online (EAD)',
  },
  {
    id: 2,
    profissional: {
      nome: 'Dr. Alexandre Xavier',
      foto: '/profissionais/marcos.png',
    },
    paciente: {
      nome: 'Amanda da sousa Lima',
      foto: '/logo.png',
    },
    data: '25/09/2026',
    horario: '08h00 / 08h00 am',
    tipo: 'Online (EAD)',
  },
  {
    id: 3,
    profissional: {
      nome: 'Dra. Fabiana Oliveira',
      foto: '/profissionais/fernanda.png',
    },
    paciente: {
      nome: 'Carlos Eduardo da Silva',
      foto: '/logo.png',
    },
    data: '02/11/2026',
    horario: '16h30 / 04h30 pm',
    tipo: 'Presencial',
  },
  {
    id: 4,
    profissional: {
      nome: 'Dr. Marcos Vinicius',
      foto: '/profissionais/gabriel.png',
    },
    paciente: {
      nome: 'Bianca da Silva',
      foto: '/logo.png',
    },
    data: '12/09/2026',
    horario: '10h00 / 10h00 am',
    tipo: 'Presencial',
  },
])

onMounted(() => {
  const salvo = localStorage.getItem('dadosAgendamento')
  if (salvo) {
    const dados = JSON.parse(salvo)
    // Se ainda for um objeto antigo (de antes da mudança), envolve num array.
    const lista = Array.isArray(dados) ? dados : [dados]

    // Transforma CADA agendamento salvo no mesmo formato usado pelos
    // cards mockados acima, e insere todos no início da lista exibida.
    const novosAgendamentos = lista.map((item, index) => ({
      id: Date.now() + index,
      profissional: {
        nome: item.profissional?.nome || 'Profissional não informado',
        foto: item.profissional?.foto || '/profissionais/ana.png',
      },
      paciente: {
        nome: item.usuario?.nome || 'Paciente não informado',
        foto: item.usuario?.foto || '/logo.png',
      },
      data: item.consulta?.data,
      horario: item.consulta?.horario,
      tipo: item.consulta?.tipo,
    }))

    agendamentos.value.unshift(...novosAgendamentos)
  }
})

const agendamentosFiltrados = computed(() => {
  const termo = buscaTermo.value.trim().toLowerCase()
  if (!termo) return agendamentos.value

  return agendamentos.value.filter(
    (item) =>
      item.paciente.nome.toLowerCase().includes(termo) ||
      item.profissional.nome.toLowerCase().includes(termo),
  )
})
</script>

<template>
    <main class="main-content">
      <h1 class="page-title">Buscar Perfil do Profissional</h1>

      <!-- Barra de Pesquisa -->
      <div class="search-bar">
        <input type="text" v-model="buscaTermo" placeholder="" />
        <span class="search-icon">🔍</span>
      </div>

      <!-- Lista de Cards -->
      <div class="card-list">
        <div v-for="card in agendamentosFiltrados" :key="card.id" class="appointment-card">
          <!-- Bloco Profissional -->
          <div class="profile-chip">
            <img :src="card.profissional.foto" :alt="card.profissional.nome" class="avatar" />
            <span class="name">{{ card.profissional.nome }}</span>
          </div>

          <!-- Bloco Paciente -->
          <div class="profile-chip">
            <img :src="card.paciente.foto" :alt="card.paciente.nome" class="avatar" />
            <span class="name">{{ card.paciente.nome }}</span>
          </div>

          <!-- Bloco de Informações -->
          <div class="info-block">
            <p><span class="icon">📅</span><span class="label">Data:</span> <span class="val">{{ card.data }}</span></p>
            <p><span class="icon">🕒</span><span class="label">Horario:</span> <span class="val">{{ card.horario }}</span></p>
            <p class="tipo-row"><span class="label">Tipo de agendamento:</span> <span class="val">{{ card.tipo }}</span></p>
          </div>
        </div>

        <!-- Mensagem quando nenhum paciente for encontrado -->
        <p v-if="agendamentosFiltrados.length === 0" class="no-results">
          Nenhum agendamento encontrado para "{{ buscaTermo }}".
        </p>
      </div>
    </main>
</template>

<style scoped>

.main-content {
  flex: 1;
  padding: 40px 20px;
  background-color: #f1ede0;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Título */
.page-title {
  color: #6a411d;
  text-align: center;
  font-size: 3.5rem;
  font-family: 'Cinzel', serif;
  font-weight: 400;
  margin: 0 0 35px 0;
  text-shadow: 2px 2px 3px rgba(106, 65, 29, 0.2);
}

/* Barra de Pesquisa */
.search-bar {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 35px auto;
}

.search-bar input {
  width: 100%;
  height: 48px;
  padding: 8px 45px 8px 24px;
  border-radius: 25px;
  border: 1.5px solid #6a411d;
  background-color: transparent;
  color: #3b2817;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: #3b2817;
  pointer-events: none;
  opacity: 0.8;
}

/* Lista e Cards */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.appointment-card {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 2px solid #6a411d;
  border-radius: 20px;
  padding: 20px;
  gap: 16px;
}

/* Chips de Perfil (Profissional / Paciente) */
.profile-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #e5dec9;
  border: 1.5px solid #6a411d;
  border-radius: 35px;
  padding: 12px 18px;
  flex: 1;
  min-height: 90px;
  box-sizing: border-box;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.name {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3831;
  font-family: 'Montserrat', sans-serif;
  line-height: 1.25;
}

/* Bloco de Informações */
.info-block {
  flex: 1;
  font-size: 1.05rem;
  line-height: 1.3;
  padding-left: 6px;
  color: #2c3831;
}

.info-block p {
  margin: 3px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Montserrat', sans-serif;
}

.info-block .icon {
  font-size: 1.2rem;
}

.info-block .label {
  color: #2c3831;
  font-weight: 700;
}

.info-block .val {
  color: #6a411d;
  font-weight: 700;
}

.info-block .tipo-row {
  display: block;
  margin-top: 4px;
}

.no-results {
  color: #6a411d;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  margin-top: 20px;
}
</style>