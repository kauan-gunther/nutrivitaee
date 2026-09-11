<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario } = useAuth()

const prato = ref({
  id: null,
  nome: '',
  calorias: '',
  data: '',
  foto: null,
  modoPreparo: '',
  ingredientes: [],
})

onMounted(() => {
  carregarUsuario()

  const idSelecionado = localStorage.getItem('pratoSelecionadoId')
  const listaSalva = localStorage.getItem('listaPratos')

  if (listaSalva && idSelecionado) {
    const lista = JSON.parse(listaSalva)
    const encontrado = lista.find((item) => item.id === Number(idSelecionado))
    if (encontrado) {
      prato.value = encontrado
    }
  }

  if (!prato.value.id) {
    const salvo = localStorage.getItem('pratoSelecionado')
    if (salvo) {
      prato.value = JSON.parse(salvo)
    }
  }

  const souDono = isProfissional.value && prato.value.profissional?.id === usuarioLogado.value?.id
  if (!souDono) {
    router.push('/receitas-recomendadas')
  }
})

function excluirPrato() {
  const listaSalva = localStorage.getItem('listaPratos')

  if (listaSalva && prato.value.id) {
    const lista = JSON.parse(listaSalva)
    const listaAtualizada = lista.filter((item) => item.id !== prato.value.id)
    localStorage.setItem('listaPratos', JSON.stringify(listaAtualizada))
  }

  localStorage.removeItem('pratoSelecionado')
  localStorage.removeItem('pratoSelecionadoId')

  router.push('/receitas-recomendadas')
}

function cancelarExclusao() {
  router.push('/pratos/ver-prato')
}
</script>

<template>
  <main class="excluir-prato">
    <h1 class="titulo">Deletar Prato Personalizado</h1>

    <div class="foto-wrapper">
      <img :src="prato.foto || 'https://via.placeholder.com/150'" class="foto-prato" />
    </div>

    <div class="campo full-width">
      <span class="label">Nome do Prato:</span>
      <span class="valor">{{ prato.nome }}</span>
    </div>

    <div class="linha-dupla">
      <div class="campo">
        <span class="label">Calorias:</span>
        <span class="valor">{{ prato.calorias }}</span>
      </div>
      <div class="campo">
        <span class="label">Data de Criação:</span>
        <span class="valor">{{ prato.data }} 📅</span>
      </div>
    </div>

    <div class="linha-dupla">
      <div class="box-texto">
        <h3>Modo de Preparo</h3>
        <p>{{ prato.modoPreparo }}</p>
      </div>

      <div class="box-texto">
        <h3>Ingredientes</h3>
        <ul>
          <li v-for="(ing, idx) in prato.ingredientes" :key="idx">• {{ ing }}</li>
        </ul>
      </div>
    </div>

    <div class="botoes">
      <button class="btn-cancelar" @click="cancelarExclusao">Cancelar Exclusão</button>
      <button class="btn-excluir" @click="excluirPrato">Excluir Prato</button>
    </div>
  </main>
</template>

<style scoped>
.excluir-prato {
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

.valor {
  color: #333f34;
  font-weight: bold;
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
  max-height: 160px;
  overflow-y: auto;
}

.box-texto h3 {
  text-align: center;
  color: #333f34;
  margin: 0 0 8px 0;
}

.box-texto p,
.box-texto li {
  color: #536236;
  font-weight: bold;
  font-size: 0.85rem;
}

.box-texto ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.botoes {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.btn-cancelar,
.btn-excluir {
  min-width: 160px;
  padding: 10px 20px;
  background-color: #9a9e70;
  color: #333f34;
  border: 1px solid #536236;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>