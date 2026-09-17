<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuarioLogado, isPaciente, isProfissional, carregarUsuario } = useAuth()

const listaProfissionais = ref([
  {
    id: 1,
    nome: 'Dra. Carolina Paz Alencar - Especialista em Nutrição Esportiva',
    telefone: '(47) 99999-1111',
    email: 'carolina@email.com',
    foto: '/consulta/carolina.png',
  },
  {
    id: 2,
    nome: 'Dr. Alexandre Xavier - Especialista em Nutrição Clínica & Emagrecimento',
    telefone: '(47) 99999-2222',
    email: 'alexandre@email.com',
    foto: '/consulta/alexsndre.png',
  },
  {
    id: 3,
    nome: 'Dra. Fabiana Oliveira - Especialista em Nutrição Infantil',
    telefone: '(47) 99999-3333',
    email: 'fabiana@email.com',
    foto: '/consulta/fabiana.png',
  },
  {
    id: 4,
    nome: 'Dra. Fernanda Rocha - Especialista em Nutrição Funcional',
    telefone: '(47) 99999-4444',
    email: 'fernanda@email.com',
    foto: '/consulta/fernanda.png',
  },
])

const listaPacientes = ref([
  {
    id: 101,
    nome: 'Gabriel Lima da Costa',
    telefone: '(47) 98888-1111',
    email: 'gabriel@email.com',
    foto: '/consulta/gabriel.png',
  },
  {
    id: 102,
    nome: 'Amanda de Sousa Lima',
    telefone: '(47) 98888-2222',
    email: 'amanda@email.com',
    foto: '/consulta/amanda.png',
  },
  {
    id: 103,
    nome: 'Carlos Eduardo da Silva',
    telefone: '(47) 98888-3333',
    email: 'carlos@email.com',
    foto: '/consulta/carlos.png',
  },
  {
    id: 104,
    nome: 'Bianca da Silva',
    telefone: '(47) 98888-4444',
    email: 'bianca@email.com',
    foto: '/consulta/bianca.png',
  },
])

const profissionalSelecionadoId = ref('')
const pacienteSelecionadoId = ref('')

const agendamento = ref({
  usuario: { nome: '', telefone: '', email: '', foto: null, senha: '' },
  profissional: { nome: '', telefone: '', email: '', foto: null, senha: '' },
  consulta: { data: '', horario: '', tipo: 'Presencial' },
})

onMounted(() => {
  carregarUsuario()

  if (usuarioLogado.value) {
    if (isPaciente.value) {
      agendamento.value.usuario = {
        id: usuarioLogado.value.id,
        nome: usuarioLogado.value.nome || '',
        telefone: usuarioLogado.value.telefone || '',
        email: usuarioLogado.value.email || '',
        foto: usuarioLogado.value.foto || null,
        senha: usuarioLogado.value.senha || '',
      }
    } else if (isProfissional.value) {
      agendamento.value.profissional = {
        id: usuarioLogado.value.id,
        nome: usuarioLogado.value.nome || '',
        telefone: usuarioLogado.value.telefone || '',
        email: usuarioLogado.value.email || '',
        foto: usuarioLogado.value.foto || null,
        senha: usuarioLogado.value.senha || '',
      }
    }
  }
})

function converterParaBase64(arquivo, callback) {
  if (arquivo.size > 1024 * 1024) {
    alert('Selecione uma imagem menor que 1MB.')
    return
  }
  const reader = new FileReader()
  reader.onloadend = () => callback(reader.result)
  reader.readAsDataURL(arquivo)
}

function aoSelecionarFotoUsuario(event) {
  const arquivo = event.target.files[0]
  if (arquivo) {
    converterParaBase64(arquivo, (base64) => {
      agendamento.value.usuario.foto = base64
    })
  }
}

function aoSelecionarFotoProfissional(event) {
  const arquivo = event.target.files[0]
  if (arquivo) {
    converterParaBase64(arquivo, (base64) => {
      agendamento.value.profissional.foto = base64
    })
  }
}

watch(profissionalSelecionadoId, (novoId) => {
  if (isPaciente.value) {
    const prof = listaProfissionais.value.find((p) => p.id === Number(novoId))
    if (prof) agendamento.value.profissional = { ...prof }
  }
})

watch(pacienteSelecionadoId, (novoId) => {
  if (isProfissional.value) {
    const pac = listaPacientes.value.find((p) => p.id === Number(novoId))
    if (pac) agendamento.value.usuario = { ...pac }
  }
})

function validarFormulario() {
  const { usuario, profissional, consulta } = agendamento.value
  if (
    !usuario.nome ||
    !usuario.telefone ||
    !usuario.email ||
    !profissional.nome ||
    !profissional.telefone ||
    !profissional.email ||
    !consulta.data ||
    !consulta.horario
  ) {
    alert('Preencha ou selecione todas as informações do profissional, usuário e consulta.')
    return false
  }
  return true
}

function agendar() {
  if (!validarFormulario()) return

  try {
    const salvos = localStorage.getItem('dadosAgendamento')
    let lista = []
    if (salvos) {
      const dados = JSON.parse(salvos)
      lista = Array.isArray(dados) ? dados : [dados]
    }

    lista.push(agendamento.value)
    localStorage.setItem('dadosAgendamento', JSON.stringify(lista))

    router.push('/resumo')
  } catch (error) {
    alert('Erro ao salvar o agendamento.')
    console.error(error)
  }
}
</script>

<template>
  <main class="agendamento-page">
    <h1 class="main-title">Agendar Consulta</h1>

    <template v-if="isPaciente">
      <section class="section-block">
        <div class="divider"><span>Escolha o Profissional</span></div>
        <div class="grid-form">
          <div class="input-card full-width">
            <label for="select-prof">Profissional:</label>
            <select id="select-prof" v-model="profissionalSelecionadoId">
              <option value="" disabled>Selecione quem vai te atender...</option>
              <option v-for="prof in listaProfissionais" :key="prof.id" :value="prof.id">
                {{ prof.nome }}
              </option>
            </select>
          </div>

          <div v-if="agendamento.profissional.nome" class="profile-preview full-width">
            <img
              :src="agendamento.profissional.foto || 'https://via.placeholder.com/150'"
              class="preview-avatar"
            />
            <div>
              <p><strong>E-mail:</strong> {{ agendamento.profissional.email }}</p>
              <p><strong>Telefone:</strong> {{ agendamento.profissional.telefone }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section-block">
        <div class="divider"><span>Seus Dados (Paciente)</span></div>
        <div class="grid-form">
          <div class="input-card">
            <label for="usr-nome">Nome:</label>
            <input id="usr-nome" type="text" v-model="agendamento.usuario.nome" />
          </div>
          <div class="input-card">
            <label for="usr-tel">Telefone:</label>
            <input id="usr-tel" type="text" v-model="agendamento.usuario.telefone" />
          </div>
          <div class="input-card">
            <label for="usr-email">E-mail:</label>
            <input id="usr-email" type="email" v-model="agendamento.usuario.email" />
          </div>
          <div class="input-card">
            <label for="usr-foto">Sua Foto:</label>
            <input id="usr-foto" type="file" accept="image/*" @change="aoSelecionarFotoUsuario" />
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="isProfissional">
      <section class="section-block">
        <div class="divider"><span>Seus Dados (Profissional)</span></div>
        <div class="grid-form">
          <div class="input-card">
            <label for="prof-nome">Nome:</label>
            <input id="prof-nome" type="text" v-model="agendamento.profissional.nome" />
          </div>
          <div class="input-card">
            <label for="prof-tel">Telefone:</label>
            <input id="prof-tel" type="text" v-model="agendamento.profissional.telefone" />
          </div>
          <div class="input-card">
            <label for="prof-email">E-mail:</label>
            <input id="prof-email" type="email" v-model="agendamento.profissional.email" />
          </div>
          <div class="input-card">
            <label for="prof-foto">Sua Foto:</label>
            <input
              id="prof-foto"
              type="file"
              accept="image/*"
              @change="aoSelecionarFotoProfissional"
            />
          </div>
        </div>
      </section>

      <section class="section-block">
        <div class="divider"><span>Escolha o Paciente</span></div>
        <div class="grid-form">
          <div class="input-card full-width">
            <label for="select-pac">Paciente:</label>
            <select id="select-pac" v-model="pacienteSelecionadoId">
              <option value="" disabled>Selecione o paciente a ser agendado...</option>
              <option v-for="paciente in listaPacientes" :key="paciente.id" :value="paciente.id">
                {{ paciente.nome }}
              </option>
            </select>
          </div>
          <div v-if="agendamento.usuario.nome" class="profile-preview full-width">
            <img
              :src="agendamento.usuario.foto || 'https://via.placeholder.com/150'"
              class="preview-avatar"
            />
            <div>
              <p><strong>E-mail:</strong> {{ agendamento.usuario.email }}</p>
              <p><strong>Telefone:</strong> {{ agendamento.usuario.telefone }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <template v-else>
      <div class="nao-logado">
        <p>Você precisa estar logado para realizar um agendamento.</p>
      </div>
    </template>

    <section v-if="isPaciente || isProfissional" class="section-block">
      <div class="divider"><span>Sobre a consulta</span></div>
      <div class="grid-form">
        <div class="input-card">
          <label for="data">Data:</label>
          <input id="data" type="date" v-model="agendamento.consulta.data" />
        </div>
        <div class="input-card">
          <label for="horario">Horário:</label>
          <input id="horario" type="time" v-model="agendamento.consulta.horario" />
        </div>
        <div class="input-card full-width">
          <label for="tipo">Tipo de agendamento:</label>
          <select id="tipo" v-model="agendamento.consulta.tipo">
            <option value="Presencial">Presencial</option>
            <option value="Online (EAD)">Online (EAD)</option>
          </select>
        </div>
      </div>

      <button @click="agendar" class="btn-agendar">Confirmar Agendamento</button>
    </section>
  </main>
</template>

<style scoped>
.agendamento-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 16px;
  box-sizing: border-box;
}

.main-title {
  color: #6a4e32;
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 24px;
}

.section-block {
  margin-bottom: 20px;
}

.nao-logado {
  text-align: center;
  color: #6a4e32;
  font-weight: bold;
  padding: 40px 0;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0 16px 0;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #586937;
}
.divider span {
  padding: 0 12px;
  color: #586937;
  font-size: 0.95rem;
  font-weight: 600;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.full-width {
  grid-column: span 2;
}

.input-card {
  display: flex;
  align-items: center;
  border: 1.5px solid #6a4e32;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 0;
}

.input-card label {
  color: #586937;
  font-weight: bold;
  margin-right: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.input-card input,
.input-card select {
  width: 100%;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #3e4d27;
  font-size: 0.92rem;
  font-weight: 600;
}

.input-card input[type='time']::-webkit-calendar-picker-indicator,
.input-card input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(30%) sepia(20%) saturate(1000%) hue-rotate(50deg);
  display: block !important;
  opacity: 1 !important;
}

.profile-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1.5px solid #6a4e32;
  border-radius: 16px;
  padding: 12px;
}

.preview-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-agendar {
  width: 100%;
  margin-top: 24px;
  padding: 14px;
  background-color: #526335;
  color: #f1edd2;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease;
}

.btn-agendar:hover {
  background-color: #43522a;
}

.input-card input[type='file'] {
  font-size: 0.8rem;
  color: #3e4d27;
  padding: 0;
}

.input-card input[type='file']::-webkit-file-upload-button {
  background-color: #526335;
  color: #f1edd2;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 6px;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.input-card input[type='file']::-webkit-file-upload-button:hover {
  background-color: #43522a;
}

@media (max-width: 600px) {
  .grid-form {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>