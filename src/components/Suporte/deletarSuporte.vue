<script setup>
import { ref } from 'vue'


const perfil = ref({
  buscar: {
    chamado: '',
    status: '',
    data: '',
    solicitante: '',
    prioridade: '',
    categoria: '',
    descricao: ''
  },
})
</script>

<template>
  <div class="principal">
  <h1>Perfil do suporte</h1>

<div class="nome cartao-entrada">
      <label for="nome">Nome:</label>
      <input type="text" id="nome" v-model="perfil.buscar.solicitante" />
    </div>

    </div>
</template>

<style scoped></style>
