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
  text-align: left;
  margin-bottom: 30px;
}

.header-banner h1 {
  color: #73441b;
  font-size: 3rem; 
  font-family: serif;
  font-weight: normal;
  margin: 0;
}

.resumo-content {
  display: flex;
  gap: 50px;
  align-items: flex-start;
  margin-top: 20px;
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
  border: 1px solid #73441b;
  color: #73441b;
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
  padding-top: 10px;
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
  font-size: 1.2rem;
}

.detail-item .value {
  color: #586937;
  font-weight: bold;
  font-size: 1.2rem;
}

.edit-input,
.edit-select {
  border: 1.5px solid #586937;
  border-radius: 8px;
  padding: 4px 8px;
  background-color: #EFE8D3;
  color: #586937;
  font-weight: bold;
  margin-left: 8px;
  outline: none;
}

.btn-lapis {
  background-color: #EFE8D3;
  border: 1.5px solid #586937;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s, box-shadow 0.2s;
}

.btn-lapis:hover {
  transform: translateY(-1px);
  box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.25);
}

.btn-confirmar {
  margin-top: 20px;
  background-color: #586937;
  color: #EFE8D3;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  transition: background 0.2s, transform 0.1s;
}

.btn-confirmar:hover {
  background-color: #435129;
  transform: translateY(-1px);
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
  background-color: #EFE8D3;
  border-radius: 22px;
  padding: 22px 20px 18px 20px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.modal-titulo {
  color: #1a1a1a;
  font-family: serif;
  font-size: 1.6rem;
  font-weight: normal;
  line-height: 1.15;
  margin: 0 0 16px 0;
}

.modal-input {
  width: 100%;
  height: 68px;
  border-radius: 16px;
  border: 1px solid #48542c;
  background-color: transparent;
  color: #48542c;
  font-family: sans-serif;
  font-size: 0.95rem;
  font-weight: bold;
  padding: 10px 14px;
  box-sizing: border-box;
  outline: none;
  resize: none;
  margin-bottom: 18px;
}

.modal-input::placeholder {
  color: #48542c;
  font-weight: bold;
  opacity: 0.9;
  line-height: 1.25;
}

.modal-botoes {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-modal {
  flex: 1;
  background-color: #48542c;
  color: #EFE8D3;
  border: none;
  border-radius: 20px;
  padding: 9px 0;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-modal:hover {
  opacity: 0.9;
}

/* --- Ajuste Responsivo para Mobile --- */
@media (max-width: 768px) {
  .resumo-content {
    flex-direction: column;
    gap: 30px;
  }

  .header-banner {
    text-align: center;
    margin-bottom: 20px;
  }

  .header-banner h1 {
    font-size: 2.3rem;
  }

  .details-coluna {
    padding-top: 0;
    width: 100%;
  }

  .cards-coluna {
    width: 100%;
  }
}
</style>