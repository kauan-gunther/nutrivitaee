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

const preferencias = ref(carregarPreferencias())

function limpar() {
  preferencias.value = criarPreferenciasVazias()
  localStorage.removeItem(STORAGE_KEY)
}

function confirmar() {
  if (!preferencias.value.nome || !preferencias.value.cep || !preferencias.value.rua) {
    alert('preencha todas as informações antes de confirmar.')
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencias.value))

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}')

    const gostoList = []
    if (preferencias.value.preferencias) gostoList.push(preferencias.value.preferencias)
    if (preferencias.value.adicionar) gostoList.push(preferencias.value.adicionar)

    usuarioLogado.preferencias = {
      gosto: gostoList,
      naoGosto: usuarioLogado.preferencias?.naoGosto || [],
    }

    if (preferencias.value.restricoes) {
      usuarioLogado.alergias = [preferencias.value.restricoes]
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado))

    router.push('/perfil')
  } catch (error) {
    console.error('Erro ao salvar preferências:', error)
    alert('Não foi possível salvar suas informações. Tente novamente.')
  }
}

function redirecionar() {
  router.push('/consultas')
}
</script>

<template>
  <main class="container">
    <h1>Preferências do Usuario</h1>

    <section class="grid-form">
      <div class="input-card">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="preferencias.nome" />
      </div>

      <div class="input-card">
        <label for="cep">CEP:</label>
        <input type="text" id="cep" v-model="preferencias.cep" />
      </div>

      <div class="input-card">
        <label for="numero">Número:</label>
        <input type="text" id="numero" v-model="preferencias.numero" />
      </div>

      <div class="input-card">
        <label for="rua">Rua:</label>
        <input type="text" id="rua" v-model="preferencias.rua" />
      </div>

      <div class="input-card">
        <label for="restricoes">Restrições:</label>
        <input type="text" id="restricoes" v-model="preferencias.restricoes" />
      </div>

      <div class="input-card">
        <label for="adicionar">Adicionar:</label>
        <input type="text" id="adicionar" v-model="preferencias.adicionar" />
      </div>

      <div class="comida">
        <label for="preferencias">Preferências Gastronômicas:</label>
        <input type="text" id="preferencias" v-model="preferencias.preferencias" />
      </div>
    </section>

    <div class="botoes">
      <button @click="limpar" class="btn-limpar">Limpar/Cancelar</button>
      <button @click="confirmar" class="btn-salvar">Confirmar</button>
    </div>
    <button @click="redirecionar" class="btn-buscar">Buscar Profissionais</button>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #73441b;
  text-align: center;
  font-size: 3rem;
  margin-bottom: 24px;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.comida {
  display: flex;
  align-items: center;
  background-color: #cbba9c;
  border: 1px solid #9c8a6f;
  border-radius: 12px;
  padding: 50px 10px;
  box-shadow: 4px 5px 8px rgba(0, 0, 0, 0.25);
}

.comida label {
  color: #333f34;
  font-weight: bold;
  white-space: nowrap;
  font-size: 1rem;
}

.comida input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #73441b;
  font-size: 1rem;
  font-weight: bold;
}

.botoes {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 24px;
}

.input-card {
  display: flex;
  align-items: center;
  background-color: #cbba9c;
  border: 1px solid #9c8a6f;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 4px 5px 8px rgba(0, 0, 0, 0.25);
}

.input-card label {
  color: #333f34;
  font-weight: bold;
  margin-right: 8px;
  white-space: nowrap;
}

.input-card input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #333f34;
  font-size: 1rem;
  font-weight: bold;
}

.btn-limpar,
.btn-salvar,
.btn-buscar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px auto 0 auto;
  padding: 11px 38px;
  background-color: #9a9e70;
  color: #333f34;
  border: 1px solid #536236;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
}
</style>