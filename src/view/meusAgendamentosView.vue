<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { usuarioLogado, carregarUsuario } = useAuth()
const meusAgendamentos = ref([])

onMounted(() => {
  carregarUsuario()
  const salvos = localStorage.getItem('dadosAgendamento')
  if (salvos) {
    const dados = JSON.parse(salvos)
    meusAgendamentos.value = Array.isArray(dados) ? dados : [dados]
  }
})

const estaLogado = computed(() => !!usuarioLogado.value)
</script>

<template>
  <main class="agendamentos-container">
    <header class="hero-banner">
      <h1>Seus agendamentos com profissionais de saúde</h1>
    </header>

    <div class="content-body">
      <!-- ESTADO 1: Deslogado -> Redireciona para /cadastro -->
      <section v-if="!estaLogado" class="card-status-box dashed-border">
        <h2 class="status-title">Não há agendamentos para você</h2>
        <p class="status-sub">
          Converse com profissionais e agende suas consultas. Elas aparecerão aqui!
        </p>

        <RouterLink to="/cadastro" class="btn-action"> Fazer o Cadastro </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
.hero-banner {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url('/img/banner-agendamentos.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  
  /* Garante que o banner ocupe a tela inteira/altura cheia como na foto 1 */
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* H1 na cor creme (#efe8d3) */
.hero-banner h1 {
  color: #efe8d3;
  font-family: 'Playfair Display', serif, Georgia;
  font-size: 2.8rem;
  font-weight: normal;
  margin: 0;
  text-align: center;
}

.content-body {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.card-status-box {
  background-color: transparent;
  padding: 40px 30px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

/* Borda pontilhada no tom marrom (#6a411d) */
.dashed-border {
  border: 2px dashed #6a411d;
  border-radius: 28px;
}

.status-title {
  color: #586937;
  font-size: 1.4rem;
  font-family: 'Playfair Display', serif, Georgia;
  font-weight: normal;
  margin: 0 0 12px 0;
}

.status-sub {
  color: #73441b;
  font-size: 0.95rem;
  margin-bottom: 24px;
  line-height: 1.4;
}

.btn-action {
  display: inline-block;
  background-color: #586937;
  color: #ffffff;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-action:hover {
  opacity: 0.9;
}
</style>