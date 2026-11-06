<script setup>
import { ref, onMounted } from 'vue'
import PerfilView from './PerfilView.vue'
import PerfilProfissionalView from '@/components/profissional/PerfilProfissionalView.vue'

const usuarioLogado = ref(null)

onMounted(() => {
  const dados = localStorage.getItem('usuarioLogado')
  if (dados) {
    try {
      usuarioLogado.value = JSON.parse(dados)
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e)
    }
  }
})
</script>

<template>
  <div class="perfil-wrapper">
    <!-- Exibe o Perfil do Paciente -->
    <PerfilView
      v-if="usuarioLogado && (usuarioLogado.tipo === 'paciente' || usuarioLogado.tag === 'paciente')"
    />

    <!-- Exibe a Página Completa de Perfil do Profissional -->
    <PerfilProfissionalView
      v-else-if="
        usuarioLogado &&
        (usuarioLogado.tipo === 'profissional' || usuarioLogado.tag === 'nutricionista')
      "
      :id-prop="usuarioLogado.id"
    />

    <!-- Estado quando não há ninguém logado -->
    <div v-else class="nao-logado">
      <p>Nenhum usuário logado. Faça login para acessar seu perfil.</p>
      <RouterLink to="/login" class="botao-login">Ir para o login</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.perfil-wrapper {
  width: 100%;
}

.nao-logado {
  margin: 80px auto;
  padding: 0 24px;
  text-align: center;
  color: #536236;
}

.nao-logado p {
  font-size: 1.15rem;
  margin: 0 0 24px;
}

.botao-login {
  display: inline-block;
  padding: 13px 28px;
  border-radius: 12px;
  background: #536236;
  color: #f1edd2;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.botao-login:hover {
  background: #333f34;
}

.botao-login:focus-visible {
  outline: 3px solid #73441b;
  outline-offset: 3px;
}
</style>
