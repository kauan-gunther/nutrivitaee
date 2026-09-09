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
    // Se ainda for um objeto antigo (de antes da mudança), envolve num array.
    const lista = Array.isArray(dados) ? dados : [dados]
    // O resumo é sempre do agendamento que acabou de ser feito,
    // ou seja, o último item da lista.
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
    <header class="header-banner">
      <h1>Agendamento</h1>
      <p>
        {{ extrairPrimeiroNome(agendamento.profissional.nome, true) }} &
        {{ extrairPrimeiroNome(agendamento.usuario.nome) }}
      </p>
    </header>

    <div class="resumo-content">
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

        <div class="detail-item full">
          <span class="label">Tipo de agendamento:</span>
          <span class="value">{{ agendamento.consulta.tipo }}</span>
        </div>
      </div>
    </div>

    <!-- Ações (Editar, Excluir, Buscar) -->
    <div class="actions-footer">
      <button class="btn-icon" title="Editar" @click="router.push('/editar')">✏️</button>

      <button class="btn-icon" title="Excluir" @click="router.push('/excluir')">🗑️</button>

      <button class="btn-buscar" @click="router.push('/buscar')">
        Buscar Agendamentos
      </button>
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
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 500px;
}

.header-banner {
  text-align: right;
  margin-bottom: 20px;
}

.header-banner h1 {
  color: #73441b;
  font-size: 3.5rem; 
  margin: 0;
}

.header-banner p {
  margin: 0;
  color: #73441b;
  font-size: 1.5rem;
}

.resumo-content {
  display: flex;
  gap: 50px;
  align-items: flex-start;
}

.cards-coluna {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1.1;
}

.person-card {
  border: 1.5px solid #73441b;
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
  border-radius: 50%;
  object-fit: cover;
}

.info h2 {
  margin: 0 0 4px 0;
  color: #333f34;
  font-size: 1.1rem; 
  font-weight: bold;
}

.info p {
  margin: 0 0 6px 0;
  color: #333f34;
  font-size: 0.88rem;
  font-weight: bold;
}

.bnt-perfil {
  background-color: transparent;
  border: 1px solid #586937;
  color: #333f34;
  font-weight: bold;
  border-radius: 12px;
  padding: 2px 16px;
  font-size: 0.8rem;
  cursor: pointer;
}

.bnt-chat {
  grid-column: span 2;
  background-color: transparent;
  border: 1px dashed #73441b;
  border-radius: 14px;
  padding: 6px;
  color: #73441b;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
}

.details-coluna {
  flex: 0.9;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 30px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
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
  color: #586937;
  font-weight: bold;
  font-size: 1.3rem;
}

.detail-item .value {
  color: #73441b;
  font-weight: bold;
  font-size: 1.3rem;
}

.actions-footer {
  display: flex;
  gap: 12px;
  margin-top: 40px;
  align-items: center;
}

.btn-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid #586937;
  background-color: #EFE8D3; 
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: transform 0.1s, box-shadow 0.2s;
}

.btn-icon:hover {
  transform: translateY(-1px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
}

.btn-buscar {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #586937;
  color: #EFE8D3;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25); 
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
}

.btn-buscar:hover {
  background-color: #435129;
  transform: translateY(-1px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background-color: #EFE8D3; 
  border: 1.5px solid #586937;
  border-radius: 24px;
  padding: 32px 24px 24px 24px;
  width: 90%;
  max-width: 400px;
  position: relative;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  font-weight: 300;
  color: #333f34;
  cursor: pointer;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.modal-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #73441b;
  margin-bottom: 12px;
}

.modal-header h2 {
  margin: 0;
  color: #73441b;
  font-size: 1.5rem;
  font-family: serif;
  font-weight: normal;
}

.modal-body {
  text-align: left;
  background-color: transparent;
  padding: 0 10px;
  margin-bottom: 24px;
}

.modal-body p {
  margin: 12px 0;
  font-size: 1rem;
}

.modal-body strong {
  color: #586937;
  font-weight: bold;
}

.modal-value {
  color: #586937;
  font-weight: bold;
  margin-left: 4px;
}

.btn-fechar {
  background-color: #586937;
  color: #EFE8D3;
  border: none;
  border-radius: 12px;
  padding: 8px 36px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;
}

.btn-fechar:hover {
  background-color: #435129;
}
</style>