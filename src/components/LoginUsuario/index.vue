<script setup>
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const form = reactive({ email: '', senha: '' })
const erro = reactive({ mensagem: '' })

function entrar() {
  erro.mensagem = ''

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const email = form.email.trim().toLowerCase()

  const encontrado = cadastros.find(
    (c) => c.email.toLowerCase() === email && c.senha === form.senha
  )

  if (!encontrado) {
    erro.mensagem = 'E-mail ou senha inválidos.'
    return
  }

  login(encontrado) // <- em vez de localStorage.setItem direto

  router.push(encontrado.tipo === 'profissional' ? `/profissional/${encontrado.id}` : '/perfil')
}
</script>

<template>
  <div class="login-container">
    <div class="header">
      <h1 class="serif-title">Entrar</h1>
      <p class="subtitle">Acesse sua conta de paciente ou profissional</p>
    </div>

    <form @submit.prevent="entrar" class="form-login">
      <div class="input-pill">
        <span class="label-text">E-mail:</span>
        <input type="email" v-model="form.email" required />
      </div>

      <div class="input-pill">
        <span class="label-text">Senha:</span>
        <input type="password" v-model="form.senha" required />
      </div>

      <p v-if="erro.mensagem" class="erro-texto">{{ erro.mensagem }}</p>

      <button type="submit" class="btn-pill btn-entrar">Entrar</button>
    </form>

    <!-- AQUI: fora do form, mas ainda dentro do login-container -->
    <div class="rodape-cadastro">
      <p>Ainda não tem conta?</p>
      <div class="links-cadastro">
        <RouterLink to="/cadastro">Cadastrar como Paciente</RouterLink>
        <RouterLink to="/cadastro-profissional">Cadastrar como Profissional</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  max-width: 480px;
  margin: 60px auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.serif-title {
  font-family: 'Italiana', serif, sans-serif;
  font-size: 2.8rem;
  color: #705335;
  font-weight: 400;
  margin: 0;
}

.subtitle {
  color: #536236;
  font-size: 0.95rem;
  margin-top: 6px;
}

.form-login {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-pill {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  height: 52px;
  box-sizing: border-box;
}

.label-text {
  color: #4a5435;
  font-size: 1.05rem;
  font-weight: 500;
  white-space: nowrap;
}

.input-pill input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: #4a5435;
  margin-left: 8px;
}

.erro-texto {
  color: #a13d3d;
  font-size: 0.9rem;
  text-align: center;
  margin: -8px 0 0 0;
}

.btn-pill {
  background-color: #536236;
  color: #f1ebd9;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-entrar:hover {
  background-color: #43502a;
  transform: translateY(-2px);
}

.rodape-cadastro {
  margin-top: 28px;
  text-align: center;
  color: #536236;
  font-size: 0.9rem;
}

.links-cadastro {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 8px;
}

.links-cadastro a {
  color: #705335;
  font-weight: 600;
  text-decoration: underline;
}
</style>