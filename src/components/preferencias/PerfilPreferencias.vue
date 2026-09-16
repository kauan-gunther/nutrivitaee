<script setup>
import { ref } from 'vue'

const STORAGE_KEY = 'nutriVitae.preferencias'

const criarPerfilVazio = () => ({
  nome: '',
  cep: '',
  numero: '',
  rua: '',
  preferencias: '',
  restricoes: '',
  adicionar: '',
})

function carregarPerfil() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (!salvo) return criarPerfilVazio()

    return { ...criarPerfilVazio(), ...JSON.parse(salvo) }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
    return criarPerfilVazio()
  }
}

const perfil = ref(carregarPerfil())
</script>

<template>
  <main class="perfil-container">
    <h1>Perfil</h1>

    <section class="perfil-card">
      <div class="campo">
        <span class="label">Nome</span>
        <strong>{{ perfil.nome || 'Não informado' }}</strong>
      </div>

      <div class="campo">
        <span class="label">CEP</span>
        <strong>{{ perfil.cep || 'Não informado' }}</strong>
      </div>

      <div class="campo">
        <span class="label">Número</span>
        <strong>{{ perfil.numero || 'Não informado' }}</strong>
      </div>

      <div class="campo">
        <span class="label">Rua</span>
        <strong>{{ perfil.rua || 'Não informado' }}</strong>
      </div>

      <div class="campo">
        <span class="label">Preferências</span>
        <strong>{{ perfil.preferencias || 'Não informado' }}</strong>
      </div>

      <div class="campo">
        <span class="label">Restrições</span>
        <strong>{{ perfil.restricoes || 'Não informado' }}</strong>
      </div>

      <div class="campo">
        <span class="label">Adicionar</span>
        <strong>{{ perfil.adicionar || 'Não informado' }}</strong>
      </div>
    </section>
  </main>
</template>

<style scoped>
.perfil-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  text-align: center;
  color: #73441b;
  margin-bottom: 24px;
}

.perfil-card {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 18px;
  background: #f3ead7;
  border: 1px solid #c9b694;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.campo {
  display: flex;
  flex-direction: column;
  background: #fffaf0;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #ded0b3;
}

.label {
  color: #536236;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

strong {
  color: #333f34;
  font-size: 1rem;
}

@media (max-width: 640px) {
  .perfil-card {
    grid-template-columns: 1fr;
  }
}
</style>