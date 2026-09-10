<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  dataNascimento: '',
  senha: '',
  confirmarSenha: '',
})

const somenteNumeros = (valor) => valor.replace(/\D/g, '')

const dataValida = (data) => data && new Date(`${data}T00:00:00`) <= new Date()

function gerarIdCadastro(cadastros) {
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

function cadastroDuplicado(cpf, email) {
  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const atual = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  const registros = atual ? [...cadastros, atual] : cadastros
  return registros.some(
    (registro) =>
      registro.tipo === 'profissional' &&
      (registro.cpf === cpf || registro.email.toLowerCase() === email.toLowerCase()),
  )
}

function validarFormulario() {
  if (
    !form.value.nome ||
    !form.value.email ||
    !form.value.cpf ||
    !form.value.telefone ||
    !form.value.dataNascimento ||
    !form.value.senha ||
    !form.value.confirmarSenha
  ) {
    alert('Preencha todos os campos.')
    return false
  }

  if (form.value.senha !== form.value.confirmarSenha) {
    alert('As senhas não coincidem.')
    return false
  }

  const cpf = somenteNumeros(form.value.cpf)
  const telefone = somenteNumeros(form.value.telefone)
  const email = form.value.email.trim()

  if (!dataValida(form.value.dataNascimento)) {
    alert('Digite uma data de nascimento válida.')
    return false
  }
  if (form.value.senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.')
    return false
  }
  if (cadastroDuplicado(cpf, email)) {
    alert('Já existe um profissional com este CPF ou e-mail.')
    return false
  }

  return true
}

function cadastrar() {
  if (!validarFormulario()) return

  const cpf = somenteNumeros(form.value.cpf)
  const telefone = somenteNumeros(form.value.telefone)
  const email = form.value.email.trim()

  const dadosProfissional = {
    id: gerarIdCadastro(JSON.parse(localStorage.getItem('cadastros') || '[]')),
    tipo: 'profissional',
    tag: 'nutricionista',
    nome: form.value.nome,
    email,
    cpf,
    telefone,
    dataNascimento: form.value.dataNascimento,
    senha: form.value.senha,
    formacoes: [],
    especializacoes: [],
  }

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  localStorage.setItem('cadastros', JSON.stringify([...cadastros, dadosProfissional]))
  localStorage.setItem('usuarioLogado', JSON.stringify(dadosProfissional))
  router.push(`/profissional/${dadosProfissional.id}`)
}
function limparCampos() {
  form.value = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    senha: '',
    confirmarSenha: '',
  }
}
</script>

<template>
  <div class="cadastroPro">
    <h1>Cadastro de Profissional</h1>

    <form class="form" @submit.prevent="cadastrar">
      <div class="grid-inputs">
        <input v-model="form.nome" type="text" placeholder="Nome:" required />
        <input v-model="form.email" type="email" placeholder="Email:" required />

        <input v-model="form.cpf" type="text" placeholder="Cpf:" required />
        <input v-model="form.telefone" type="text" placeholder="Telefone:" required />

        <div class="campo-nascimento">
          <label>Data de Nascimento:</label>
          <input v-model="form.dataNascimento" type="date" required />
        </div>

        <div class="campo-input-icone">
          <input
            v-model="form.senha"
            :type="mostrarSenha ? 'text' : 'password'"
            placeholder="Criar Senha:"
            required
          />
          <i
            :class="mostrarSenha ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
            @click="mostrarSenha = !mostrarSenha"
          ></i>
        </div>

        <div class="campo-input-icone full-width">
          <input
            v-model="form.confirmarSenha"
            :type="mostrarConfirmarSenha ? 'text' : 'password'"
            placeholder="Confirmar Senha:"
            required
          />
          <i
            :class="mostrarConfirmarSenha ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"
            @click="mostrarConfirmarSenha = !mostrarConfirmarSenha"
          ></i>
        </div>
      </div>

      <div class="acoes">
        <button type="submit" class="btn-salvar">Salvar Cadastro</button>
        <button type="button" class="btn-cancelar" @click="limparCampos">Cancelar Cadastro</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.cadastroPro {
  width: 100%;
  min-height: 100vh;
  background-color: #efe8d3;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 40px;
}

h1 {
  font-size: clamp(3rem, 5vw, 4.5rem);
  color: #536236;
  font-weight: 400;
  margin-bottom: 50px;
  text-align: center;
}

.form {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.grid-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 36px;
}

input {
  width: 100%;
  padding: 18px 24px;
  border: 1.5px solid #8c7355;
  border-radius: 20px;
  background-color: rgba(239, 232, 211, 0.6);
  font-size: 1.25rem;
  color: #333f34;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

input::placeholder {
  color: #536236;
  opacity: 0.9;
}

input:focus {
  border-color: #536236;
  background-color: #efe8d3;
}

.campo-nascimento {
  position: relative;
  display: flex;
  align-items: center;
}

.campo-nascimento label {
  position: absolute;
  left: 24px;
  color: #536236;
  font-size: 1.2rem;
  pointer-events: none;
}

.campo-nascimento input {
  padding-left: 200px;
}

.campo-input-icone {
  position: relative;
  display: flex;
  align-items: center;
}

.campo-input-icone i {
  position: absolute;
  right: 22px;
  cursor: pointer;
  color: #536236;
  font-size: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.acoes {
  display: flex;
  justify-content: center;
  gap: 36px;
  margin-top: 15px;
}

button {
  padding: 18px 48px;
  border-radius: 50px;
  font-size: 1.35rem;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
}

.btn-salvar,
.btn-cancelar {
  background-color: #536236;
  color: #f1edd2;
  box-shadow: 0 4px 14px rgba(83, 98, 54, 0.25);
}

.btn-salvar:hover,
.btn-cancelar:hover {
  background-color: #414e2a;
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .grid-inputs {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .campo-nascimento input {
    padding-left: 24px;
  }

  .campo-nascimento label {
    display: none;
  }

  .acoes {
    flex-direction: column;
  }
}
</style>
