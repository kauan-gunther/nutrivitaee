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
    ingredientesTexto.value = Array.isArray(prato.value.ingredientes) 
      ? prato.value.ingredientes.join('\n') 
      : (prato.value.ingredientes || '')
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

    <!-- Seção Superior: Foto alinhada ao lado dos campos -->
    <div class="topo-formulario">
      <div class="foto-wrapper">
        <img :src="prato.foto || 'https://via.placeholder.com/150'" class="foto-prato" />
        <span class="icone-camera">📷</span>
      </div>

      <div class="campos-direita">
        <div class="campo full-width">
          <span class="label">Nome do Prato:</span>
          <input type="text" v-model="prato.nome" class="input-editavel" />
          <span class="icone-input">✏️</span>
        </div>

        <div class="linha-dupla-topo">
          <div class="campo">
            <span class="label">Calorias:</span>
            <input type="text" v-model="prato.calorias" class="input-editavel" />
            <span class="icone-input">✏️</span>
          </div>
          <div class="campo">
            <span class="label">Data de Criação:</span>
            <input type="date" v-model="prato.data" class="input-editavel" />
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
          <span class="icone-input">✏️</span>
        </div>
        <textarea v-model="prato.modoPreparo" placeholder="Descreva o modo de preparo..."></textarea>
      </div>

      <div class="box-texto">
        <div class="box-header">
          <h3>Ingredientes</h3>
          <span class="icone-input">✏️</span>
        </div>
        <textarea v-model="ingredientesTexto" placeholder="Um ingrediente por linha"></textarea>
      </div>
    </div>

    <!-- Botões de Ação -->
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
  padding: 30px;
  border-radius: 20px;
}

.titulo {
  color: #73441b;
  text-align: center;
  font-size: 50px;
  margin-bottom: 25px;
  font-weight: bold;
}

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

.icone-camera {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #333;
  color: #fff;
  font-size: 0.7rem;
  padding: 3px;
  border-radius: 50%;
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

.campo {
  position: relative;
  border: 1px solid #73441b;
  border-radius: 16px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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

.input-editavel {
  background: transparent;
  border: none;
  outline: none;
  color: #73441b;
  font-weight: bold;
  font-size: 0.95rem;
  font-family: inherit;
  flex: 1;
  width: 100%;
}

.icone-input {
  margin-left: 8px;
  font-size: 0.85rem;
  opacity: 0.7;
}

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
  font-size: 1.1rem;
  flex: 1;
}

.box-texto textarea {
  width: 100%;
  height: 110px;
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
  gap: 20px;
}

.btn-salvar,
.btn-cancelar {
  flex: 1;
  max-width: 200px;
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

.btn-salvar:hover,
.btn-cancelar:hover {
  background-color: #58613e;
}
</style>