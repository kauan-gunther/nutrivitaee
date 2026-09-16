<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const STORAGE_KEY = 'nutriVitae.preferencias'

const criarPreferenciasVazias = () => ({
  nome: '',
  cep: '',
  numero: '',
  rua: '',
  preferencias: '',
  restricoes: '',
  adicionar: '',
})

function carregarPreferencias() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (!salvo) return criarPreferenciasVazias()

    const dados = JSON.parse(salvo)
    return { ...criarPreferenciasVazias(), ...dados }
  } catch (error) {
    console.error('Erro ao carregar preferências:', error)
    return criarPreferenciasVazias()
  }
}

const editar = ref(carregarPreferencias())

function limpar() {
  editar.value = criarPreferenciasVazias()
  localStorage.removeItem(STORAGE_KEY)
}

function confirmar() {
  if (!editar.value.nome || !editar.value.cep || !editar.value.rua) {
    alert('Preencha nome, CEP e rua antes de confirmar.')
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editar.value))
    router.push('/perfil')
  } catch (error) {
    console.error('Erro ao salvar preferências:', error)
    alert('Não foi possível salvar suas informações. Tente novamente.')
  }
}
</script>

<template>
  <main class="container">
    <h1></h1>

    <section class="carregar">
      <div class="formulario">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="editar.nome" />
      </div>

      <div class="cep">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" v-model="editar.cep" />
      </div>

      <div class="numero">
        <label for="numero">Número:</label>
        <input type="text" id="numero" v-model="editar.numero" />
      </div>

      <div class="rua">
        <label for="rua">Rua:</label>
        <input type="text" id="rua" v-model="editar.rua" />
      </div>

      <div class="preferencias">
        <label for="preferencias">Preferências:</label>
        <input type="text" id="preferencias" v-model="editar.preferencias" />
      </div>

      <div class="restricoes">
        <label for="restricoes">Restrições:</label>
        <input type="text" id="restricoes" v-model="editar.restricoes" />
      </div>

      <div class="adicionar">
        <label for="adicionar">Adicionar:</label>
        <input type="text" id="adicionar" v-model="editar.adicionar" />
      </div>
    </section>
    <button @click="limpar" class="btn-limpar">limpar/Cancelar</button>
    <button @click="confirmar" class="btn-salvar">Confirmar</button>
    <button @click="router.push('/buscar')" class="btn-buscar">buscar pofissionais</button>
  </main>
</template>

<style scoped></style>