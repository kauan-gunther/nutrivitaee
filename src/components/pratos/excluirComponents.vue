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

    <!-- Seção Superior: Foto alinhada ao lado dos campos -->
    <div class="topo-formulario">
      <div class="foto-wrapper">
        <img :src="prato.foto || 'https://via.placeholder.com/150'" class="foto-prato" />
      </div>

      <div class="campos-direita">
        <div class="campo full-width">
          <span class="label">Nome do Prato:</span>
          <span class="valor">{{ prato.nome }}</span>
         
        </div>

        <div class="linha-dupla-topo">
          <div class="campo">
            <span class="label">Calorias:</span>
            <span class="valor">{{ prato.calorias }}</span>
     
          </div>
          <div class="campo">
            <span class="label">Data de Criação:</span>
            <span class="valor">{{ prato.data }}</span>
            <span class="icone-input">📅</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção Inferior: Textareas de Modo de Preparo e Ingredientes -->
    <div class="linha-dupla-baixo">
      <div class="box-texto">
        <div class="box-header">
          <h3>Modo de Preparo</h3>
        </div>
        <p>{{ prato.modoPreparo }}</p>
      </div>

      <div class="box-texto">
        <div class="box-header">
          <h3>Ingredientes</h3>
        </div>
        <ul>
          <li v-for="(ing, idx) in prato.ingredientes" :key="idx">• {{ ing }}</li>
        </ul>
      </div>
    </div>

    <!-- Botões de Ação -->
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
  padding: 30px;
  border-radius: 20px;
  font-weight: bold;
}

.titulo {
  color: #73441b;
  text-align: center;
  font-size: 50px;
  margin-bottom: 25px;
  font-weight: bold;
}

/* Layout do Topo (Foto + Campos) */
.topo-formulario {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.foto-wrapper {
  position: relative;
  flex-shrink: 0;
}

.foto-prato {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #73441b;
}

.campos-direita {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.linha-dupla-topo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Estilização dos Campos */
.campo {
  position: relative;
  border: 1px solid #73441b;
  border-radius: 16px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
}

.full-width {
  width: 100%;
  box-sizing: border-box;
}

.label {
  color: #536236;
  font-weight: bold;
  font-size: 0.95rem;
  margin-right: 6px;
  white-space: nowrap;
}

.valor {
  color: #73441b;
  font-weight: bold;
  font-size: 0.95rem;
  flex: 1;
}

.icone-input {
  margin-left: 8px;
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Layout Inferior (Modo de preparo e Ingredientes) */
.linha-dupla-baixo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.box-texto {
  border: 1px solid #73441b;
  border-radius: 16px;
  padding: 14px 16px;
  max-height: 160px;
  overflow-y: auto;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.box-texto h3 {
  text-align: center;
  color: #333f34;
  margin: 0;
  font-weight: bold;
  font-size: 1.1rem;
  flex: 1;
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

/* Botões */
.botoes {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.btn-cancelar,
.btn-excluir {
  flex: 1;
  max-width: 220px;
  padding: 12px 24px;
  background-color: #69734d;
  color: #f1f1e6;
  border: 1px solid #4a5235;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: background-color 0.2s;
}

.btn-cancelar:hover,
.btn-excluir:hover {
  background-color: #58613e;
}
</style>