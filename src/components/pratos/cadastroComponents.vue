<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario } = useAuth()

const pacienteSelecionadoId = ref('')
const meusPacientes = ref([])

onMounted(() => {
  carregarUsuario()

  if (!isProfissional.value) {
    router.push('/receitas-recomendadas')
    return
  }

  const agendamentos = JSON.parse(localStorage.getItem('dadosAgendamento') || '[]')
  const lista = Array.isArray(agendamentos) ? agendamentos : [agendamentos]

  const doProfissional = lista.filter(
    (item) => item.profissional?.id === usuarioLogado.value.id,
  )

  const vistos = new Set()
  meusPacientes.value = doProfissional
    .filter((item) => {
      if (!item.usuario?.id || vistos.has(item.usuario.id)) return false
      vistos.add(item.usuario.id)
      return true
    })
    .map((item) => item.usuario)
})

const fotoInputRef = ref(null)

const agendamento = ref({
  profissional: {
    nome: '',
    calorias: '',
    foto: null,
    data: '',
    preparo: '',
    ingredientes: '',
  },
})

function triggerInputFoto() {
  if (fotoInputRef.value) {
    fotoInputRef.value.click()
  }
}

function converterParaBase64(arquivo, callback) {
  if (arquivo.size > 1024 * 1024) {
    alert('Selecione uma imagem menor que 1MB.')
    return
  }

  const reader = new FileReader()
  reader.onloadend = () => callback(reader.result)
  reader.readAsDataURL(arquivo)
}

function aoSelecionarFotoPrato(event) {
  const arquivo = event.target.files[0]
  if (arquivo) {
    converterParaBase64(arquivo, (base64) => {
      agendamento.value.profissional.foto = base64
    })
  }
}

function validarFormulario() {
  const { profissional } = agendamento.value

  if (
    !profissional.nome ||
    !profissional.calorias ||
    !profissional.data ||
    !profissional.preparo ||
    !profissional.ingredientes
  ) {
    alert('Preencha todos os campos.')
    return false
  }

  return true
}

function salvar() {
  if (!validarFormulario()) return

  if (!pacienteSelecionadoId.value) {
    alert('Escolha para qual paciente é essa receita.')
    return
  }

  try {
    const dados = agendamento.value.profissional
    const pacienteEscolhido = meusPacientes.value.find(
      (p) => p.id === pacienteSelecionadoId.value,
    )

    const listaIngredientes = dados.ingredientes
      .split('\n')
      .filter((item) => item.trim() !== '')

    const novoPrato = {
      id: Date.now(),
      nome: dados.nome,
      profissional: {
        id: usuarioLogado.value.id,
        nome: usuarioLogado.value.nome,
      },
      usuario: pacienteEscolhido,
      data: dados.data,
      calorias: dados.calorias.includes('Kcal') ? dados.calorias : `${dados.calorias} Kcal`,
      foto: dados.foto,
      modoPreparo: dados.preparo,
      ingredientes: listaIngredientes,
    }

    const listaAtual = JSON.parse(localStorage.getItem('listaPratos') || '[]')
    listaAtual.unshift(novoPrato)

    localStorage.setItem('listaPratos', JSON.stringify(listaAtual))

    router.push('/receitas-recomendadas')
  } catch (error) {
    alert('Erro ao salvar o prato. Tente utilizar fotos menores.')
    console.error(error)
  }
}

function cancelar() {
  agendamento.value.profissional = {
    nome: '',
    calorias: '',
    foto: null,
    data: '',
    preparo: '',
    ingredientes: '',
  }

  if (fotoInputRef.value) {
    fotoInputRef.value.value = ''
  }
}
</script>

<template>
  <main class="resumo-container">
    <header class="header-banner">
      <h1>Cadastro de Pratos</h1>
    </header>

    <section class="conteudo-formulario">
      <div class="linha-superior">
        <div class="avatar-container" @click="triggerInputFoto" title="Adicionar Foto">
          <div
            class="avatar-circle"
            :style="agendamento.profissional.foto ? { backgroundImage: `url(${agendamento.profissional.foto})` } : {}"
          >
            <span v-if="!agendamento.profissional.foto" class="pattern-bg"></span>
          </div>
          <button type="button" class="btn-camera" aria-label="Tirar foto ou anexar">
            <span class="mdi mdi-camera"></span>
          </button>
          <input
            ref="fotoInputRef"
            id="usr-foto"
            type="file"
            accept="image/*"
            class="input-hidden"
            @change="aoSelecionarFotoPrato"
          />
        </div>

        <div class="input-card flex-1">
          <label for="usr-nome">Nome do Prato:</label>
          <input id="usr-nome" type="text" v-model="agendamento.profissional.nome" />
        </div>

        <div class="input-card flex-1">
          <label for="paciente">Paciente:</label>
          <select id="paciente" v-model="pacienteSelecionadoId">
            <option value="" disabled>Selecione um paciente</option>
            <option v-for="p in meusPacientes" :key="p.id" :value="p.id">{{ p.nome }}</option>
          </select>
        </div>
      </div>

      <p v-if="meusPacientes.length === 0" class="aviso-sem-pacientes">
        Você ainda não tem pacientes com consultas agendadas.
      </p>

      <div class="grid-form">
        <div class="input-card">
          <label for="usr-calorias">Calorias:</label>
          <input id="usr-calorias" type="text" v-model="agendamento.profissional.calorias" />
        </div>

        <div class="input-card">
          <label for="data">Data de Criação:</label>
          <input id="data" type="date" v-model="agendamento.profissional.data" />
        </div>

        <div class="input-grande">
          <span class="label-titulo">Modo de Preparo</span>
          <textarea id="preparo" v-model="agendamento.profissional.preparo"></textarea>
        </div>

        <div class="input-grande">
          <span class="label-titulo">Ingredientes</span>
          <textarea
            id="ingredientes"
            v-model="agendamento.profissional.ingredientes"
          ></textarea>
        </div>
      </div>

      <div class="botao-container">
        <button class="button" @click="cancelar">Cancelar</button>
        <button class="button" @click="salvar">Salvar</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.resumo-container {
  width: 80%;
  max-width: 900px;
  margin: 40px auto; 
  padding: 30px 40px;
  box-sizing: border-box;
}

h1 {
  color: #705335;
  text-align: center;
  font-size: 60px; 
  margin-bottom: 30px;
  font-weight: 400;
}

.conteudo-formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.linha-superior {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.avatar-container {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  cursor: pointer;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e5ded0;
  border: 1px solid #8c7355;
  background-size: cover;
  background-position: center;
}

.pattern-bg {
  display: block;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#d3c8b4 20%, transparent 20%);
  background-size: 10px 10px;
  opacity: 0.6;
}

.btn-camera {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.input-hidden {
  display: none;
}

.flex-1 {
  flex: 1;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

.input-card {
  display: flex;
  align-items: center;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 10px 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
}

.input-card label {
  color: #4a5435;
  font-weight: 700;
  font-size: 1.15rem;
  margin-right: 8px;
  white-space: nowrap;
}

.input-card input,
.input-card select {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #4a5435;
  font-size: 1.1rem;
  font-weight: 600;
}

.aviso-sem-pacientes {
  color: #a13d3d;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -10px;
}

.input-grande {
  display: flex;
  flex-direction: column;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  height: 220px;
  box-sizing: border-box;
  width: 100%;
}

.input-grande textarea {
  width: 100%;
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #4a5435;
  font-size: 1.1rem;
  font-family: inherit;
  margin-top: 8px;
}

.label-titulo {
  display: block;
  text-align: center;
  color: #333f34;
  font-weight: 700;
  font-size: 1.25rem;
}

.botao-container {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 10px;
}

.button {
  background-color: #536236;
  color: #f1edd2;
  border: none;
  padding: 12px 30px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.button:hover {
  opacity: 0.9;
}
</style>