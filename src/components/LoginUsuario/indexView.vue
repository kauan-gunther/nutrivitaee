<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { buscarPacientes } from '@/services/pacientesApi.js'
import AuthSplit from '../AuthSplit.vue'

const router = useRouter()
const { login } = useAuth()

// Só muda o visual (lado da foto e texto). Quem define se a conta é de paciente
// ou de profissional é o próprio cadastro dela, lá no entrar().
const tipo = ref('paciente')

const form = reactive({ email: '', senha: '' })
const erro = reactive({ mensagem: '' })
const carregando = ref(false)

async function entrar() {
  erro.mensagem = ''
  carregando.value = true

  const email = form.email.trim().toLowerCase()
  let encontrado = null
  let apiFalhou = false

  // 1) PACIENTES: vêm da API (GET /pacientes?email=...)
  try {
    const pacientes = await buscarPacientes({ email })
    encontrado = pacientes.find((p) => p.senha === form.senha) || null
  } catch {
    apiFalhou = true
  }

  // 2) PROFISSIONAIS: por enquanto ainda ficam no localStorage.
  //    (Provisório: quando o cadastro de profissional for para a API, este bloco sai.)
  if (!encontrado) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
    encontrado =
      cadastros.find(
        (c) =>
          c.tipo === 'profissional' && c.email.toLowerCase() === email && c.senha === form.senha,
      ) || null
  }

  carregando.value = false

  if (!encontrado) {
    erro.mensagem = apiFalhou
      ? 'Não foi possível conectar à API. Verifique se ela está rodando (npm run api).'
      : 'E-mail ou senha inválidos.'
    return
  }

  // Paciente vem da API: guardamos na sessão sem a senha
  if (encontrado.tipo === 'paciente') {
    const semSenha = { ...encontrado }
    delete semSenha.senha
    login(semSenha)
  } else {
    login(encontrado)
  }

  router.push(encontrado.tipo === 'profissional' ? `/profissional/${encontrado.id}` : '/perfil')
}
</script>

<template>
  <AuthSplit v-model:tipo="tipo">
    <form @submit.prevent="entrar">
      <label class="rotulo" for="email">E-mail</label>
      <input
        id="email"
        v-model="form.email"
        class="campo"
        type="email"
        autocomplete="email"
        required
      />

      <label class="rotulo" for="senha">Senha</label>
      <input
        id="senha"
        v-model="form.senha"
        class="campo"
        type="password"
        autocomplete="current-password"
        required
      />

      <p v-if="erro.mensagem" class="erro" role="alert">{{ erro.mensagem }}</p>

      <button type="submit" class="botao" :disabled="carregando">
        {{ carregando ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="texto-extra">Ainda não tem conta?</p>
    <div class="links">
      <RouterLink to="/cadastro">Cadastrar como paciente</RouterLink>
      <RouterLink to="/cadastro-profissional">Cadastrar como profissional</RouterLink>
    </div>
  </AuthSplit>
</template>
