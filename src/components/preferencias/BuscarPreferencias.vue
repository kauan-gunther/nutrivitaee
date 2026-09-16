<script setup>
import { ref } from 'vue'

const termoBusca = ref('')

const buscar = () => {
  console.log('Buscando por:', termoBusca.value)
  // Lógica para realizar a pesquisa ou chamar uma API
}
</script>

<template>
  <div class="container">
    <h1>Buscar Preferências</h1>

    <div class="form-busca">
      <div class="campo">
        <label for="busca">Nome ou CPF:</label>
        <input 
          v-model="termoBusca" 
          type="text" 
          id="busca" 
          placeholder="Digite o nome completo ou CPF..." 
        />
      </div>

      <button type="button" @click="buscar">Pesquisar</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>