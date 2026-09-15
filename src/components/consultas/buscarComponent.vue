<script setup>
import { ref, computed, onMounted } from 'vue'

const buscaTermo = ref('')
const agendamentosPadrao = [
  {
    id: 1,
    profissional: {
      nome: 'Dra. Carolina Paz Alencar',
      foto: 'img/consulta/carolina.png',
    },
    paciente: {
      nome: 'Gabriel Lima da Costa',
      foto: 'img/consulta/gabriel.png',
    },
    data: '17/08/2026',
    horario: '14h30 / 02h30 pm',
    tipo: 'Online (EAD)',
  },
  {
    id: 2,
    profissional: {
      nome: 'Dr. Alexandre Xavier',
      foto: 'img/consulta/alexsndre.png',
    },
    paciente: {
      nome: 'Amanda da sousa Lima',
      foto: 'img/consulta/amanda.png',
    },
    data: '25/09/2026',
    horario: '08h00 / 08h00 am',
    tipo: 'Online (EAD)',
  },
  {
    id: 3,
    profissional: {
      nome: 'Dra. Fabiana Oliveira',
      foto: 'img/consulta/fabiana.png',
    },
    paciente: {
      nome: 'Carlos Eduardo da Silva',
      foto: 'img/consulta/carlos.png',
    },
    data: '02/11/2026',
    horario: '16h30 / 04h30 pm',
    tipo: 'Presencial',
  },
  {
    id: 4,
    profissional: {
      nome: 'Dra. Fernanda Rocha',
      foto: 'img/consulta/fernanda.png',
    },
    paciente: {
      nome: 'Bianca da Silva',
      foto: 'img/consulta/bianca.png',
    },
    data: '12/09/2026',
    horario: '10h00 / 10h00 am',
    tipo: 'Presencial',
  },
]

const agendamentos = ref([...agendamentosPadrao])

onMounted(() => {
  const salvo = localStorage.getItem('dadosAgendamento')
  if (salvo) {
    const dados = JSON.parse(salvo)
    const lista = Array.isArray(dados) ? dados : [dados]

    const novosAgendamentos = lista.map((item, index) => ({
      id: Date.now() + index,
      profissional: {
        nome: item.profissional?.nome || 'Profissional não informado',
        foto: item.profissional?.foto || 'img/consulta/carolina.png',
      },
      paciente: {
        nome: item.usuario?.nome || 'Paciente não informado',
        foto: item.usuario?.foto || 'img/consulta/gabriel.png',
      },
      data: item.consulta?.data,
      horario: item.consulta?.horario,
      tipo: item.consulta?.tipo,
    }))

    agendamentos.value = novosAgendamentos
    return
  }

  agendamentos.value = [...agendamentosPadrao]
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
            <div class="detail-item">
              <span class="icon">📅</span>
              <div class="info-item-content">
                <span class="label">Data:</span>
                <span class="val">{{ card.data }}</span>
              </div>
            </div>

            <div class="detail-item">
              <span class="icon">🕒</span>
              <div class="info-item-content">
                <span class="label">Horario:</span>
                <span class="val">{{ card.horario }}</span>
              </div>
            </div>

            <div class="detail-item full">
              <span class="label">Tipo de agendamento:</span>
              <span class="val">{{ card.tipo }}</span>
            </div>
          </div>
        </div>

        <!-- Mensagem quando nenhum resultado for encontrado -->
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
  color: #73441b;
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
  border: 1.5px solid #73441b;
  background-color: transparent;
  color: #73441b;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  color: #73441b;
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
  border: 1.5px solid #73441b;
  border-radius: 20px;
  padding: 20px;
  gap: 16px;
}

/* Chips de Perfil (Profissional / Paciente) */
.profile-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: transparent;
  border: 1.5px solid #73441b;
  border-radius: 20px;
  padding: 12px 16px;
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
  font-weight: bold;
  color: #333f34;
}

/* Bloco de Informações */
.info-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 6px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-item.full {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.detail-item .icon {
  font-size: 1.2rem;
}

.detail-item .label {
  color: #586937; 
  font-weight: bold;
  font-size: 1.05rem;
}

.detail-item .val {
  color: #73441b; 
  font-weight: bold;
  font-size: 1.05rem;
}

.no-results {
  color: #73441b;
  text-align: center;
  font-weight: 500;
  margin-top: 20px;
}
</style>