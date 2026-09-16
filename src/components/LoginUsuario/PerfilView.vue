<template>
  <div class="perfil-container">
    <EditarPerfilView
      v-if="editando"
      :usuario="usuario"
      @salvar-edicao="salvarAlteracoes"
      @cancelar="editando = false"
    />

    <div v-else class="perfil-content">
      <button
        class="delete-icon-btn"
        title="Excluir Perfil"
        @click="router.push('/perfil/deletar')"
      >
        <i class="mdi mdi-delete-outline"></i>
      </button>

      <div class="profile-header">
        <div class="avatar-wrapper">
          <img
            :src="usuario.foto || 'https://via.placeholder.com/150'"
            :alt="usuario.nome"
            class="avatar-img"
          />

          <label class="upload-foto" title="Adicionar foto de perfil">
            <input type="file" accept="image/*" @change="selecionarFoto" />
            <i class="mdi mdi-camera-plus-outline"></i>
          </label>
        </div>
        <h1 class="user-name">{{ usuario.nome }}</h1>
        <button class="btn-sair" @click="sair">Sair</button>
      </div>

      <div class="info-grid">
        <div class="info-box input-pill">
          <span class="label-text">peso:</span>
          <span class="valor-text">{{ usuario.peso }}</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">Telefone:</span>
          <span class="valor-text">{{ usuario.telefone }}</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">Idade:</span>
          <span class="valor-text">{{ calcularIdade(usuario.dataNascimento) }} anos</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">email:</span>
          <span class="valor-text">{{ usuario.email }}</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">cpf</span>
          <span class="valor-text">{{ usuario.cpf }}</span>
        </div>
      </div>

      <div class="cards-grid">
        <div class="card-box light-card">
          <div class="card-header-action">
            <h3 class="card-title">Preferências</h3>
            <button
              class="btn-definir-pref"
              title="Definir Preferências"
              @click="router.push('/CadastrarPreferencias')"
            >
              Definir
            </button>
          </div>

          <hr class="card-divider" />

          <div class="subsecao">
            <span class="subtitulo">Objetivo do Paciente</span>
          </div>
          <ul>
            <li v-if="!usuario.preferencias?.objetivo">• Não registrado</li>
            <li v-else>• {{ usuario.preferencias.objetivo }}</li>
          </ul>

          <div class="subsecao">
            <span class="subtitulo">Dieta do Paciente</span>
          </div>
          <ul>
            <li v-if="!usuario.preferencias?.dieta?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.preferencias?.dieta" :key="i">• {{ item }}</li>
          </ul>

          <div class="subsecao">
            <span class="subtitulo">Preferências do  Paciente</span>
          </div>
          <ul>
            <li v-if="!usuario.preferencias?.gosto?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.preferencias?.gosto" :key="i">• {{ item }}</li>
          </ul>
        </div>

        <div class="card-box light-card">
          <div class="subsecao titulo-alergias">
            <h3 class="card-title">Alergias / Restrições</h3>
          </div>
          <hr class="card-divider" />

          <div class="subsecao">
            <span class="subtitulo">Alergias do  Paciente</span>
          </div>

          <ul>
            <li v-if="!usuario.alergias?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.alergias" :key="i">• {{ item }}</li>
          </ul>
        </div>
      </div>

      <button class="floating-edit-btn" title="Editar Perfil" @click="editando = true">
        <i class="mdi mdi-pencil-outline"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EditarPerfilView from './EditarPerfilView.vue'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

function sair() {
  logout()
  router.push('/login')
}

const router = useRouter()
const editando = ref(false)

const usuario = reactive({
  nome: '',
  cpf: '',
  peso: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  foto: '',
  preferencias: { objetivo: '', dieta: [], gosto: [], naoGosto: [] },
  alergias: [],
})

const carregarPreferenciasDoCadastro = () => {
  const prefsSalvas = localStorage.getItem('nutriVitae.preferencias')
  if (!prefsSalvas) return

  try {
    const prefs = JSON.parse(prefsSalvas)

    const objetivoSelecionado = prefs.objetivo || prefs.outroObjetivo || ''

    const dietaSelecionada = [
      ...(Array.isArray(prefs.dieta) ? prefs.dieta : []),
      ...(prefs.outraDieta ? [prefs.outraDieta] : [])
    ].filter(Boolean)

    const preferenciasSelecionadas = [
      ...(Array.isArray(prefs.preferencias) ? prefs.preferencias : []),
      ...(prefs.outrasPreferencias ? [prefs.outrasPreferencias] : [])
    ].filter(Boolean)

    const alergiasSelecionadas = [
      ...(Array.isArray(prefs.alergias) ? prefs.alergias : []),
      ...(prefs.outrasAlergias ? [prefs.outrasAlergias] : [])
    ].filter(Boolean)

    usuario.preferencias = {
      objetivo: objetivoSelecionado,
      dieta: dietaSelecionada,
      gosto: preferenciasSelecionadas,
      naoGosto: []
    }

    usuario.alergias = alergiasSelecionadas
  } catch (e) {
    console.error('Erro ao ler preferências:', e)
  }
}

onMounted(() => {
  const dadosSalvos = localStorage.getItem('usuarioLogado')
  if (dadosSalvos) {
    Object.assign(usuario, JSON.parse(dadosSalvos))
  }

  carregarPreferenciasDoCadastro()
})

const persistirUsuario = (dadosUsuario) => {
  const dados = { ...dadosUsuario }
  localStorage.setItem('usuarioLogado', JSON.stringify(dados))

  if (dados.id) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
    const listaAtualizada = cadastros.filter((cadastro) => String(cadastro.id) !== String(dados.id))
    listaAtualizada.push(dados)
    localStorage.setItem('cadastros', JSON.stringify(listaAtualizada))
  }
}

const selecionarFoto = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Selecione uma imagem válida.')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const fotoBase64 = reader.result
    usuario.foto = fotoBase64
    persistirUsuario({ ...usuario, foto: fotoBase64 })
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const salvarAlteracoes = (novosDados) => {
  Object.assign(usuario, novosDados)
  persistirUsuario(novosDados)
  editando.value = false
}

const calcularIdade = (dataNasc) => {
  if (!dataNasc) return '--'
  const hoje = new Date()
  const nascimento = new Date(dataNasc)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const m = hoje.getMonth() - nascimento.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}
</script>

<style scoped>
.perfil-container {
  width: 100%;
  max-width: 820px;
  margin: 40px auto 80px auto;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
}

.perfil-content {
  position: relative;
  display: flex;
  flex-direction: column;
}

.btn-sair {
  background-color: transparent;
  border: 1.5px solid #536236;
  color: #536236;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
}

.delete-icon-btn {
  position: absolute;
  top: 15px;
  right: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  color: #536236;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.delete-icon-btn:hover {
  transform: scale(1.05);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-top: 10px;
  margin-bottom: 35px;
}

.avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.upload-foto {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  color: #f1edd2;
  cursor: pointer;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-wrapper:hover .upload-foto {
  opacity: 1;
}

.upload-foto input {
  display: none;
}

.upload-foto i {
  font-size: 1.3rem;
  background: #536236;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #f1edd2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.user-name {
  font-size: 3rem;
  color: #705335;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 24px;
  margin-bottom: 35px;
}

.input-pill {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 12px 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 52px;
}

.label-text {
  color: #4a5435;
  font-size: 1.15rem;
  font-weight: 500;
}

.valor-text {
  color: #705335;
  font-size: 1.1rem;
  font-weight: 600;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.light-card {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 16px;
  padding: 18px 22px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  min-height: 200px;
}

.card-header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subsecao {
  display: flex;
  align-items: center;
  text-align: center;
  color: #73441b;
  margin: 12px 0 8px;
}

.subsecao::before,
.subsecao::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #536236;
}

.subtitulo {
  padding: 0 10px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-title {
  text-align: center;
  font-size: 1.4rem;
  color: #705335;
  font-weight: 600;
  margin: 0;
}

.btn-definir-pref {
  background-color: #536236;
  color: #f1edd2;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-definir-pref:hover {
  background-color: #888c60;
}

.card-divider {
  border: 0;
  height: 1.5px;
  background-color: #536236;
  margin-bottom: 12px;
}

.section-subtitle {
  color: #4a5435;
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0 0 4px 0;
}

ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

li {
  color: #4a5435;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 3px;
  padding-left: 12px;
}

.mt-2 {
  margin-top: 10px;
}

.floating-edit-btn {
  position: absolute;
  bottom: -60px;
  left: -60px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  color: #536236;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.floating-edit-btn:hover {
  transform: scale(1.08);
}

@media (max-width: 768px) {
  .info-grid,
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .floating-edit-btn {
    bottom: -50px;
    left: 0;
  }
}
</style>