<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { profissionais } from "@/data/profissionais"
import { useAuth } from "@/composables/useAuth"

const route = useRoute()
const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario, login } = useAuth()

const targetId = route.params.id
const profissional = ref(null)

const nome = ref("")
const email = ref("")
const telefone = ref("")
const dataNascimento = ref("")
const formacoes = ref([])
const especializacoes = ref([])

const modalAberto = ref(null)
const novoTipo = ref("")
const novoNome = ref("")

onMounted(() => {
  carregarUsuario()

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const listaCompleta = [...profissionais, ...cadastros]
  profissional.value = listaCompleta.find((item) => String(item.id) === String(targetId))

  const souDono =
    profissional.value &&
    isProfissional.value &&
    String(usuarioLogado.value?.id) === String(profissional.value.id)

  if (!souDono) {
    router.push(profissional.value ? `/profissional/${targetId}` : '/profissionais')
    return
  }

  nome.value = profissional.value.nome || ""
  email.value = profissional.value.email || ""
  telefone.value = profissional.value.telefone || ""
  dataNascimento.value = profissional.value.dataNascimento || ""
  formacoes.value = profissional.value.formacoes
    ? JSON.parse(JSON.stringify(profissional.value.formacoes))
    : []
  especializacoes.value = profissional.value.especializacoes
    ? JSON.parse(JSON.stringify(profissional.value.especializacoes))
    : []
})

function abrirModal(tipo) {
  modalAberto.value = tipo
  novoTipo.value = ""
  novoNome.value = ""
}

function fecharModal() {
  modalAberto.value = null
}

function adicionarItem() {
  if (!novoTipo.value.trim() || !novoNome.value.trim()) return

  if (modalAberto.value === 'formacoes') {
    formacoes.value.push({ tipo: novoTipo.value, nome: novoNome.value })
  } else if (modalAberto.value === 'especializacoes') {
    especializacoes.value.push({ tipo: novoTipo.value, nome: novoNome.value })
  }

  novoTipo.value = ""
  novoNome.value = ""
}

function removerItem(lista, index) {
  if (lista === 'formacoes') {
    formacoes.value.splice(index, 1)
  } else if (lista === 'especializacoes') {
    especializacoes.value.splice(index, 1)
  }
}

function salvar() {
  if (!profissional.value) return

  const dadosAtualizados = {
    ...profissional.value,
    nome: nome.value,
    email: email.value,
    telefone: telefone.value,
    dataNascimento: dataNascimento.value,
    formacoes: formacoes.value,
    especializacoes: especializacoes.value,
  }

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const idx = cadastros.findIndex((c) => String(c.id) === String(dadosAtualizados.id))
  if (idx !== -1) {
    cadastros[idx] = dadosAtualizados
    localStorage.setItem('cadastros', JSON.stringify(cadastros))
  }

  login(dadosAtualizados)

  router.push(`/profissional/${dadosAtualizados.id}`)
}

function cancelar() {
  router.push(profissional.value ? `/profissional/${profissional.value.id}` : '/profissionais')
}

function alterarFoto(event) {
  const arquivo = event.target.files[0]
  if (arquivo && profissional.value) {
    const reader = new FileReader()
    reader.onloadend = () => {
      profissional.value.foto = reader.result
    }
    reader.readAsDataURL(arquivo)
  }
}
</script>
<template>
  <main v-if="profissional" class="edit-container">
    <h1>Editar Perfil</h1>

    <div class="edit-conteudo">
      <div class="avatar-wrapper">
        <img
          :src="profissional.foto || 'https://via.placeholder.com/150'"
          :alt="nome"
          class="foto-perfil"
        />
        <label class="upload-foto" title="Alterar foto de perfil">
          <input type="file" accept="image/*" @change="alterarFoto" />
          <i class="mdi mdi-camera-plus-outline"></i>
        </label>
      </div>

      <div class="campos-form">
        <div class="campo-form">
          <label for="nome">Nome</label>
          <input id="nome" v-model="nome" type="text" placeholder="Nome completo" />
        </div>

        <div class="campo-form">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Email" />
        </div>

        <div class="campo-form">
          <label for="telefone">Telefone</label>
          <input id="telefone" v-model="telefone" type="tel" placeholder="Telefone" />
        </div>

        <div class="campo-form">
          <label for="dataNascimento">Data de Nascimento</label>
          <input id="dataNascimento" v-model="dataNascimento" type="date" />
        </div>
      </div>

      <div class="cards-informacoes">
        <!-- Formações -->
        <div class="card-info">
          <div class="card-header">
            <h2>Formação Acadêmica</h2>
            <button class="btn-definir" @click="abrirModal('formacoes')">Adicionar</button>
          </div>
          <ul>
            <li v-if="!formacoes.length" class="sem-registro">• Não registrada</li>
            <li v-for="(formacao, index) in formacoes" :key="index" class="item-lista">
              <span><strong>{{ formacao.tipo }}:</strong> {{ formacao.nome }}</span>
              <button class="btn-remover" title="Remover" @click="removerItem('formacoes', index)">
                <i class="mdi mdi-close"></i>
              </button>
            </li>
          </ul>
        </div>

        <!-- Especializações -->
        <div class="card-info">
          <div class="card-header">
            <h2>Especializações</h2>
            <button class="btn-definir" @click="abrirModal('especializacoes')">Adicionar</button>
          </div>
          <ul>
            <li v-if="!especializacoes.length" class="sem-registro">• Não registrada</li>
            <li v-for="(especializacao, index) in especializacoes" :key="index" class="item-lista">
              <span><strong>{{ especializacao.tipo }}:</strong> {{ especializacao.nome }}</span>
              <button class="btn-remover" title="Remover" @click="removerItem('especializacoes', index)">
                <i class="mdi mdi-close"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="acoes-form">
        <button class="btn-cancelar" @click="cancelar">Cancelar</button>
        <button class="btn-salvar" @click="salvar">Salvar</button>
      </div>
    </div>

    <!-- Modal Adicionar Formação/Especialização -->
    <div v-if="modalAberto" class="modal-overlay">
      <div class="modal-card">
        <h2>{{ modalAberto === 'formacoes' ? 'Nova Formação' : 'Nova Especialização' }}</h2>

        <div class="campo-form">
          <label for="novoTipo">Tipo</label>
          <input id="novoTipo" v-model="novoTipo" type="text" placeholder="Ex: Graduação, Curso..." />
        </div>

        <div class="campo-form">
          <label for="novoNome">Nome</label>
          <input id="novoNome" v-model="novoNome" type="text" placeholder="Ex: Nutrição - USP" />
        </div>

        <div class="acoes-form">
          <button class="btn-cancelar" @click="fecharModal">Cancelar</button>
          <button class="btn-salvar" @click="adicionarItem">Adicionar</button>
        </div>
      </div>
    </div>
  </main>

  <main v-else class="naoEncontrado">
    <h2>Profissional não encontrado.</h2>
    <RouterLink to="/profissionais" class="btn-voltar">
      <i class="mdi mdi-account-group-outline"></i> Ver Profissionais
    </RouterLink>
  </main>
</template>
<style scoped>
.edit-container {
  width: 100%;
  min-height: 100vh;
  background-color: #efe8d3;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

h1 {
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  color: #536236;
  font-weight: 400;
  margin-bottom: 30px;
  text-align: center;
}

.edit-conteudo {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #8c7355;
}

.foto-perfil {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.upload-foto {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  color: #f1edd2;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-wrapper:hover .upload-foto {
  opacity: 1;
}

.upload-foto input {
  display: none;
}

.campos-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-form label {
  font-size: 0.95rem;
  font-weight: bold;
  color: #536236;
}

.campo-form input {
  padding: 12px 16px;
  border-radius: 14px;
  border: 1.5px solid #8c7355;
  background-color: rgba(239, 232, 211, 0.6);
  font-size: 1rem;
  color: #333f34;
  outline: none;
}

.cards-informacoes {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card-info {
  border: 1.5px solid #8c7355;
  border-radius: 20px;
  padding: 20px;
  background-color: rgba(239, 232, 211, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-info h2 {
  font-size: 1.3rem;
  color: #536236;
  font-weight: 400;
  margin: 0;
}

.btn-definir {
  background-color: #536236;
  border: 2px solid #536236;
  color: #efe8d3;
  border-radius: 20px;
  padding: 4px 16px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-definir:hover {
  background-color: #414e2a;
}

.card-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-lista {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #333f34;
}

.btn-remover {
  background: none;
  border: none;
  color: #8c5322;
  cursor: pointer;
  font-size: 1.1rem;
}

.sem-registro {
  font-style: italic;
  color: #8c7355;
}

.acoes-form {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancelar,
.btn-salvar {
  border-radius: 20px;
  padding: 10px 26px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancelar {
  background-color: transparent;
  border: 1.5px solid #8c7355;
  color: #8c7355;
}

.btn-cancelar:hover {
  background-color: #8c7355;
  color: #efe8d3;
}

.btn-salvar {
  background-color: #536236;
  border: 1.5px solid #536236;
  color: #efe8d3;
}

.btn-salvar:hover {
  background-color: #414e2a;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  background-color: #efe8d3;
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.naoEncontrado {
  min-height: 100vh;
  background-color: #efe8d3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  text-align: center;
}

.naoEncontrado h2 {
  font-size: 2.2rem;
  color: #536236;
  font-weight: 400;
}

.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #536236;
  color: #efe8d3;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-voltar:hover {
  background-color: #414e2a;
}

@media (max-width: 700px) {
  .cards-informacoes {
    grid-template-columns: 1fr;
  }
}
</style>