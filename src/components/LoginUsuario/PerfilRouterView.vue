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
    </div>
  </div>
</template>

<style scoped>
.perfil-wrapper {
  width: 100%;
}

.nao-logado {
  margin-top: 50px;
  font-size: 1.2rem;
  color: #536236;
  text-align: center;
}
</style>