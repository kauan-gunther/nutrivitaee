<template>
  <div class="cadastro-container">
    <div class="header">
      <h1 class="serif-title">Cadastro do Paciente</h1>
    </div>

    <form @submit.prevent="submitCadastro" class="form-grid">
      <!-- Coluna da Esquerda -->
      <div class="form-col">
        <div class="input-pill">
          <span class="label-text">Nome:</span>
          <input type="text" v-model="form.nome" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Cpf:</span>
          <input type="text" v-model="form.cpf" required />
        </div>

        <div class="input-pill">
          <span class="label-text">peso:</span>
          <input type="text" v-model="form.peso" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Criar senha:</span>
          <input type="password" v-model="form.senha" required />
        </div>
      </div>

      <!-- Coluna da Direita -->
      <div class="form-col">
        <div class="input-pill">
          <span class="label-text">E-mail:</span>
          <input type="text" v-model="form.email" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Telefone:</span>
          <input type="text" v-model="form.telefone" required />
        </div>

        <div class="input-pill date-field">
          <span class="label-text">Data de nascimento:</span>
          <input type="date" v-model="form.dataNascimento" placeholder="DD/MM/AAAA" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Confirmar senha:</span>
          <input type="password" v-model="form.confirmarSenha" required />
        </div>
      </div>

      <!-- Botões inferiores -->
      <div class="action-bar">
        <button type="submit" class="btn-pill btn-confirmar">Confirmar</button>
        <button type="button" class="btn-pill btn-cancelar" @click="cancelarCadastro">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  nome: '',
  cpf: '',
  peso: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  senha: '',
  confirmarSenha: '',
})

const somenteNumeros = (valor) => valor.replace(/\D/g, '')

const dataValida = (data) => data && new Date(`${data}T00:00:00`) <= new Date()

const gerarIdCadastro = (cadastros) => {
  let id
  do {
    const quantidadeDigitos = (crypto.getRandomValues(new Uint32Array(1))[0] % 8) + 2
    const menorValor = 10 ** (quantidadeDigitos - 1)
    const intervalo = 10 ** quantidadeDigitos - menorValor
    const valorAleatorio = crypto.getRandomValues(new Uint32Array(1))[0] % intervalo
    id = String(menorValor + valorAleatorio)
  } while (cadastros.some((cadastro) => String(cadastro.id) === id))

  return id
}

const cadastroDuplicado = (tipo, cpf, email) => {
  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const atual = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  const registros = atual ? [...cadastros, atual] : cadastros
  return registros.some(
    (registro) =>
      registro.tipo === tipo &&
      (registro.cpf === cpf || registro.email.toLowerCase() === email.toLowerCase()),
  )
}

const submitCadastro = () => {
  const cpf = somenteNumeros(form.cpf)
  const telefone = somenteNumeros(form.telefone)
  const email = form.email.trim()

  if (!email || !email.includes('@')) {
    alert('Digite um e-mail válido com @.')
    return
  }
  if (!dataValida(form.dataNascimento)) {
    alert('Digite uma data de nascimento válida.')
    return
  }
  if (form.senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.')
    return
  }
  if (form.senha !== form.confirmarSenha) {
    alert('As senhas não coincidem!')
    return
  }
  if (cadastroDuplicado('paciente', cpf, email)) {
    alert('Já existe um paciente com este CPF ou e-mail.')
    return
  }

  const dadosUsuario = {
    id: gerarIdCadastro(JSON.parse(localStorage.getItem('cadastros') || '[]')),
    tipo: 'paciente',
    tag: 'paciente',
    nome: form.nome,
    cpf,
    peso: form.peso.includes('kg') ? form.peso : `${form.peso}kg`,
    dataNascimento: form.dataNascimento,
    email,
    telefone,
    senha: form.senha,
    preferencias: { gosto: [], naoGosto: [] },
    alergias: [],
  }

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  localStorage.setItem('cadastros', JSON.stringify([...cadastros, dadosUsuario]))
  localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario))
  router.push('/perfil')
}

const cancelarCadastro = () => {
  router.push('/login')
}
</script>

<style scoped>
.cadastro-container {
  width: 100%;
  max-width: 820px;
  margin: 40px auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 35px;
  text-align: center;
}

.serif-title {
  font-family: 'Italiana', serif, sans-serif;
  font-size: 3.2rem;
  color: #705335;
  font-weight: 400;
  margin: 0;
}

.form-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}

.form-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-pill {
  position: relative;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  height: 52px;
}

.label-text {
  color: #4a5435;
  font-size: 1.15rem;
  font-weight: 500;
  white-space: nowrap;
}

.input-pill input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 1.05rem;
  color: #4a5435;
  margin-left: 8px;
  font-family: inherit;
}

.input-pill input[type='date'] {
  color: #705335;
}

.input-pill input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: brightness(0) saturate(100%) invert(28%) sepia(14%) saturate(17%) hue-rotate(34deg)
    brightness(90%) contrast(90%);
}

/* Ações/Botões */
.action-bar {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 35px;
}

.btn-pill {
  flex: 1;
  background-color: #536236;
  color: #f1ebd9;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  text-align: center;
}

.btn-pill:hover {
  background-color: #43502a;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    grid-column: span 1;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
