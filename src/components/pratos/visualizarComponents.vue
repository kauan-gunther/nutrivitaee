<script setup>
import { ref, onMounted, computed } from 'vue'
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

onMounted(() => {
  carregarUsuario()

  const listaSalva = localStorage.getItem('listaPratos')
  const idSelecionado = localStorage.getItem('pratoSelecionadoId')

  if (listaSalva && idSelecionado) {
    const lista = JSON.parse(listaSalva)
    const encontrado = lista.find((item) => item.id === Number(idSelecionado))

    if (encontrado) {
      prato.value = encontrado
    }
  }
})

const souDono = computed(
  () => isProfissional.value && prato.value.profissional?.id === usuarioLogado.value?.id,
)

function irParaEditar() {
  router.push('/pratos/editar')
}

function irParaExcluir() {
  router.push('/pratos/excluir')
}
</script>

<template>
  <main class="visualizar-prato">
    <button v-if="souDono" class="btn-excluir-topo" @click="irParaExcluir" title="Excluir">
      🗑️
    </button>

    <h1 class="titulo">Vizualizar Prato Personalizado</h1>

    <div class="linha-superior">
      <div class="foto-wrapper">
        <img :src="prato.foto || 'https://via.placeholder.com/150'" class="foto-prato" />
      </div>

      <div class="campo flex-1">
        <span class="label">Nome do Prato:</span>
        <span class="valor">{{ prato.nome }}</span>
      </div>

      <div class="campo flex-1">
        <span class="label">{{ isProfissional ? 'Para o Paciente:' : 'Recomendado Por:' }}</span>
        <span class="valor">{{ isProfissional ? prato.usuario?.nome : prato.profissional?.nome }}</span>
      </div>
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
        <div class="conteudo-scroll">
          <p>{{ prato.modoPreparo }}</p>
        </div>
      </div>

      <div class="box-texto">
        <h3>Ingredientes</h3>
        <div class="conteudo-scroll">
          <ul>
            <li v-for="(ing, idx) in prato.ingredientes" :key="idx">• {{ ing }}</li>
          </ul>
        </div>
      </div>
    </div>

    <button v-if="souDono" class="btn-editar" @click="irParaEditar" title="Editar">
      ✏️
    </button>
  </main>
</template>

<style scoped>
.visualizar-prato {
  max-width: 850px;
  margin: 20px auto;
  padding: 20px;
  background: transparent;
  position: relative;
  box-sizing: border-box;
}

.titulo {
  font-family: 'Italiana', serif;
  color: #633b1e;
  text-align: center;
  font-size: 3.5rem;
  margin-top: 0;
  margin-bottom: 25px;
  font-weight: 400;
}

/* Botão Lixeira Redondo */
.btn-excluir-topo {
  position: absolute;
  top: 10px;
  right: 15px;
  background-color: #eee3c8;
  border: 1.5px solid #633b1e;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.25);
  font-size: 1.1rem;
}

.linha-superior {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.foto-wrapper {
  width: 95px;
  height: 95px;
  flex-shrink: 0;
}

.foto-prato {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.2);
}

.flex-1 {
  flex: 1;
}

/* Camadas de entrada / cards */
.campo {
  display: flex;
  align-items: center;
  background-color: #eee3c8;
  border: 1.5px solid #846d50;
  border-radius: 16px;
  padding: 12px 20px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
}

.label {
  color: #4e5d32;
  font-weight: 700;
  font-size: 1.2rem;
  margin-right: 8px;
  white-space: nowrap;
}

.valor {
  color: #633b1e;
  font-weight: 700;
  font-size: 1.2rem;
}

.linha-dupla {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* Boxes de Modo de Preparo e Ingredientes */
.box-texto {
  background-color: #eee3c8;
  border: 1.5px solid #846d50;
  border-radius: 18px;
  padding: 16px;
  height: 220px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
}

.box-texto h3 {
  font-family: 'Italiana', serif;
  text-align: center;
  color: #4e5d32;
  font-size: 2rem;
  margin: 0 0 10px 0;
  font-weight: 400;
}

.conteudo-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  
  /* Firefox Scrollbar */
  scrollbar-color: #838e55 #333d29;
  scrollbar-width: thin;
}

/* Custom WebKit Scrollbar sem estourar os limites */
.conteudo-scroll::-webkit-scrollbar {
  width: 10px;
}

.conteudo-scroll::-webkit-scrollbar-track {
  background-color: #333d29;
  border-radius: 10px;
  margin: 4px 0;
}

.conteudo-scroll::-webkit-scrollbar-thumb {
  background-color: #838e55;
  border-radius: 10px;
  border: 2px solid #333d29;
}

.box-texto p,
.box-texto li {
  color: #4e5d32;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.35;
  word-break: break-word;
}

.box-texto ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.box-texto li {
  margin-bottom: 6px;
}

/* Botão Lápis Redondo no Canto Inferior */
.btn-editar {
  position: absolute;
  bottom: -10px;
  left: 0px;
  background-color: #eee3c8;
  border: 1.5px solid #633b1e;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.25);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .linha-superior,
  .linha-dupla {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>