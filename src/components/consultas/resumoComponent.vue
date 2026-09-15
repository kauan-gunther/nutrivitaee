<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const agendamento = ref({
  usuario: {
    nome: '',
    telefone: '',
    email: '',
    foto: null,
  },

  profissional: {
    nome: '',
    telefone: '',
    email: '',
    foto: null,
  },

  consulta: {
    data: '',
    horario: '',
    tipo: 'Presencial',
  },
})

onMounted(() => {
  const dadosSalvos = localStorage.getItem('dadosAgendamento')
  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos)
    const lista = Array.isArray(dados) ? dados : [dados]
    agendamento.value = lista[lista.length - 1]
  }
})

function formatarData(dataIso) {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}

function extrairPrimeiroNome(nomeCompleto, ehProfissional = false) {
  if (!nomeCompleto) return ''
  const partes = nomeCompleto.trim().split(' ')
  
  if (ehProfissional && partes.length > 1 && partes[0].toLowerCase().startsWith('dr')) {
    return `${partes[0]} ${partes[1]}`
  }
  
  return partes[0]
}

const modalAberto = ref(false)
const pessoaSelecionada = ref({
  titulo: '',
  nome: '',
  telefone: '',
  email: '',
  foto: null
})

function verPerfil(tipo) {
  if (tipo === 'profissional') {
    pessoaSelecionada.value = {
      titulo: 'Perfil do Profissional',
      nome: agendamento.value.profissional.nome || 'Não informado',
      telefone: agendamento.value.profissional.telefone || 'Não informado',
      email: agendamento.value.profissional.email || 'Não informado',
      foto: agendamento.value.profissional.foto
    }
  } else {
    pessoaSelecionada.value = {
      titulo: 'Perfil do Paciente',
      nome: agendamento.value.usuario.nome || 'Não informado',
      telefone: agendamento.value.usuario.telefone || 'Não informado',
      email: agendamento.value.usuario.email || 'Não informado',
      foto: agendamento.value.usuario.foto
    }
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
}
</script>

<template>
  <div class="resumo-container">
    <div class="main-layout">
      <!-- Coluna da Esquerda: Cards de Pessoas + Ações Footer -->
      <div class="coluna-esquerda">
        <div class="cards-coluna">
          <!-- Card Profissional -->
          <div class="person-card">
            <img
              :src="agendamento.profissional.foto || 'https://via.placeholder.com/150'"
              alt="Profissional"
              class="avatar"
            />
            <div class="info">
              <h2>
                {{ agendamento.profissional.nome || 'Nome Profissional' }}
              </h2>

              <p>
                <strong>Telefone:</strong>
                {{ agendamento.profissional.telefone }}
              </p>

              <button class="bnt-perfil" @click="verPerfil('profissional')">Ver Perfil</button>
            </div>
            <button class="bnt-chat">Conversar com profissional</button>
          </div>

          <!-- Card Usuário / Paciente -->
          <div class="person-card">
            <img
              :src="agendamento.usuario.foto || 'https://via.placeholder.com/150'"
              alt="Usuário"
              class="avatar"
            />
            <div class="info">
              <h2>
                {{ agendamento.usuario.nome || 'Nome Usuário' }}
              </h2>

              <p>
                <strong>Telefone:</strong>
                {{ agendamento.usuario.telefone }}
              </p>

              <button class="bnt-perfil" @click="verPerfil('paciente')">Ver Perfil</button>
            </div>
            <button class="bnt-chat">Conversar com o paciente</button>
          </div>
        </div>

        <!-- Ações (Editar, Excluir, Buscar) -->
        <div class="actions-footer">
          <button class="btn-lapis" title="Editar" @click="router.push('/editar')">✏️</button>
          <button class="btn-lapis" title="Excluir" @click="router.push('/excluir')">🗑️</button>
          <button class="btn-buscar" @click="router.push('/buscar')">
            Buscar Agendamentos
          </button>
        </div>
      </div>

      <!-- Coluna da Direita: Título + Detalhes da Consulta -->
      <div class="coluna-direita">
        <header class="header-banner">
          <h1>Agendamento</h1>
          <p>
            {{ extrairPrimeiroNome(agendamento.profissional.nome, true) }} &
            {{ extrairPrimeiroNome(agendamento.usuario.nome) }}
          </p>
        </header>

        <div class="details-coluna">
          <div class="detail-item">
            <span class="icon">📅</span>
            <div class="info-item">
              <span class="label">Data:</span>
              <span class="value">{{ formatarData(agendamento.consulta.data) }}</span>
            </div>
          </div>

          <div class="detail-item">
            <span class="icon">🕒</span>
            <div class="info-item">
              <span class="label">Horario:</span>
              <span class="value">{{ agendamento.consulta.horario }}</span>
            </div>
          </div>

          <div class="detail-item tipo-bloco">
            <span class="label">Tipo de agendamento:</span>
            <span class="value">{{ agendamento.consulta.tipo }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Perfil -->
  <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
    <div class="modal-card">
      <button class="modal-close" @click="fecharModal">✕</button>

      <div class="modal-header">
        <img
          :src="pessoaSelecionada.foto || 'https://via.placeholder.com/150'"
          alt="Foto de Perfil"
          class="modal-avatar"
        />
        <h2>{{ pessoaSelecionada.titulo }}</h2>
      </div>

      <div class="modal-body">
        <p><strong>Nome:</strong> <span class="modal-value">{{ pessoaSelecionada.nome }}</span></p>
        <p><strong>Telefone:</strong> <span class="modal-value">{{ pessoaSelecionada.telefone }}</span></p>
        <p><strong>E-mail:</strong> <span class="modal-value">{{ pessoaSelecionada.email }}</span></p>
      </div>

      <button class="btn-fechar" @click="fecharModal">Fechar</button>
    </div>
  </div>
</template>

<style scoped>
.resumo-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 20px;
  min-height: 500px;
}

.main-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.coluna-esquerda {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  max-width: 480px;
}

.coluna-direita {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

.header-banner {
  text-align: left;
  margin-bottom: 40px;
}

.header-banner h1 {
  color: #705335;
  font-size: 4rem; 
  font-family: serif;
  font-weight: 400;
  margin: 0;
  line-height: 1;
}

.header-banner p {
  color: #705335;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 10px 0 0 0;
}

.cards-coluna {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.person-card {
  border: 1.5px solid #705335;
  border-radius: 20px;
  padding: 16px; 
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px; 
  align-items: center;
  background-color: transparent;
}

.avatar {
  width: 80px; 
  height: 80px; 
  border-radius: 20px;
  object-fit: cover;
}

.info h2 {
  margin: 0 0 4px 0;
  color: #333f34;
  font-size: 1.1rem; 
  font-weight: bold;
}

.info p {
  margin: 0 0 8px 0;
  color: #333f34;
  font-size: 0.88rem;
  font-weight: bold;
}

.bnt-perfil {
  background-color: transparent;
  border: 1px solid #705335;
  color: #705335;
  font-weight: bold;
  border-radius: 12px;
  padding: 2px 16px;
  font-size: 0.8rem;
  cursor: pointer;
}

.bnt-chat {
  grid-column: span 2;
  background-color: transparent;
  border: 1px dashed #705335;
  border-radius: 14px;
  padding: 6px;
  color: #705335;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
}

.details-coluna {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-item .icon {
  font-size: 1.4rem;
}

.detail-item .label {
  color: #536236;
  font-weight: bold;
  font-size: 1.25rem;
}

.detail-item .value {
  color: #536236;
  font-weight: bold;
  font-size: 1.25rem;
}

.tipo-bloco {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.actions-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.btn-lapis {
  background-color: #ebe2cc;
  border: 1.5px solid #536236;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s, box-shadow 0.2s;
}

.btn-lapis:hover {
  transform: translateY(-1px);
  box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.15);
}

.btn-buscar {
  background-color: #536236;
  color: #f1edd2;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
}

.btn-buscar:hover {
  opacity: 0.9;
}

/* Modal Estilizado Compacto */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background-color: #ebe2cc;
  border-radius: 22px;
  padding: 22px 20px 18px 20px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #705335;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.modal-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #705335;
}

.modal-header h2 {
  font-size: 1.2rem;
  color: #705335;
  margin: 0;
}

.modal-body {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  color: #333f34;
}

.modal-value {
  font-weight: normal;
}

.btn-fechar {
  background-color: #536236;
  color: #f1edd2;
  border: none;
  border-radius: 16px;
  padding: 8px 20px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

/* --- Ajuste Responsivo para Mobile --- */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column-reverse;
    gap: 30px;
  }

  .coluna-esquerda, .coluna-direita {
    width: 100%;
    max-width: 100%;
  }

  .header-banner {
    text-align: center;
    margin-bottom: 20px;
  }

  .header-banner h1 {
    font-size: 2.8rem;
  }
}
</style>