<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario } = useAuth()

const prato = ref({
  nome: '',
  calorias: '',
  data: '',
  foto: null,
  modoPreparo: '',
  ingredientes: [],
})

const ingredientesTexto = ref('')

onMounted(() => {
  carregarUsuario()

  const salvo = localStorage.getItem('pratoSelecionado')
  if (salvo) {
    prato.value = JSON.parse(salvo)
    ingredientesTexto.value = prato.value.ingredientes.join('\n')
  }

  const souDono = isProfissional.value && prato.value.profissional?.id === usuarioLogado.value?.id
  if (!souDono) {
    router.push('/receitas-recomendadas')
  }
})

function salvar() {
  prato.value.ingredientes = ingredientesTexto.value
    .split('\n')
    .filter((item) => item.trim() !== '')

  localStorage.setItem('pratoSelecionado', JSON.stringify(prato.value))

  const listaSalva = localStorage.getItem('listaPratos')
  if (listaSalva) {
    const lista = JSON.parse(listaSalva)
    const listaAtualizada = lista.map((item) =>
      item.id === prato.value.id ? prato.value : item,
    )
    localStorage.setItem('listaPratos', JSON.stringify(listaAtualizada))
  }

  router.push('/pratos/ver-prato')
}

function cancelar() {
  router.push('/pratos/ver-prato')
}
</script>

<template>
  <main class="editar-prato">
    <h1 class="titulo">Editar Prato Personalizado</h1>

    <div class="foto-wrapper">
      <img :src="prato.foto || 'https://via.placeholder.com/150'" class="foto-prato" />
    </div>

    <div class="campo full-width">
      <span class="label">Nome do Prato:</span>
      <input type="text" v-model="prato.nome" class="input-editavel" />
    </div>

    <div class="linha-dupla">
      <div class="campo">
        <span class="label">Calorias:</span>
        <input type="text" v-model="prato.calorias" class="input-editavel" />
      </div>
      <div class="campo">
        <span class="label">Data de Criação:</span>
        <input type="date" v-model="prato.data" class="input-editavel" />
      </div>
    </div>

    <div class="linha-dupla">
      <div class="box-texto">
        <h3>Modo de Preparo</h3>
        <textarea v-model="prato.modoPreparo"></textarea>
      </div>

      <div class="box-texto">
        <h3>Ingredientes</h3>
        <textarea v-model="ingredientesTexto" placeholder="Um ingrediente por linha"></textarea>
      </div>
    </div>

    <div class="botoes">
      <button class="btn-salvar" @click="salvar">Salvar</button>
      <button class="btn-cancelar" @click="cancelar">Cancelar</button>
    </div>
  </main>
</template>

<style scoped>
.editar-prato {
  max-width: 850px;
  margin: 40px auto;
  padding: 24px;
  background-color: #f1edd2;
  border: 1px solid #73441b;
  border-radius: 20px;
}

.titulo {
  color: #73441b;
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.foto-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.foto-prato {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #73441b;
}

.campo {
  background-color: #cbba9c;
  border: 1px solid #9c8a6f;
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
}

.full-width {
  width: 100%;
  box-sizing: border-box;
}

.label {
  color: #536236;
  font-weight: bold;
  margin-right: 8px;
}

.input-editavel {
  background: transparent;
  border: none;
  outline: none;
  color: #333f34;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
}

.linha-dupla {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.box-texto {
  background-color: #cbba9c;
  border: 1px solid #9c8a6f;
  border-radius: 12px;
  padding: 12px;
}

.box-texto h3 {
  text-align: center;
  color: #333f34;
  margin: 0 0 8px 0;
}

.box-texto textarea {
  width: 100%;
  height: 100px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #536236;
  font-weight: bold;
  font-size: 0.85rem;
  font-family: inherit;
  box-sizing: border-box;
}

.botoes {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.btn-salvar,
.btn-cancelar {
  min-width: 140px;
  padding: 10px 24px;
  background-color: #9a9e70;
  color: #333f34;
  border: 1px solid #536236;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>