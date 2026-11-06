<template>
  <div class="perfil-container">
    <!-- NOVO: mensagens de carregamento, sucesso e erro -->
    <p v-if="mensagem.texto" class="feedback" :class="mensagem.tipo" role="status">
      {{ mensagem.texto }}
    </p>

    <p v-if="carregando" class="estado" role="status">Carregando seu perfil...</p>

    <div v-else-if="erroCarregar" class="estado estado-erro" role="alert">
      <p>{{ erroCarregar }}</p>
      <button class="btn-editar" @click="carregarPaciente">Tentar novamente</button>
    </div>

    <EditarPerfilView
      v-else-if="editando"
      :usuario="usuario"
      :salvando="salvando"
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
        <div class="header-texto">
          <h1 class="user-name">{{ usuario.nome }}</h1>
          <div class="header-acoes">
            <button class="btn-editar" @click="editando = true">Editar perfil</button>
            <button class="btn-sair" @click="sair">Sair</button>
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box input-pill">
          <span class="label-text">Peso</span>
          <span class="valor-text">{{ usuario.peso }}</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">Telefone</span>
          <span class="valor-text">{{ mascaraTelefone(usuario.telefone) }}</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">Idade</span>
          <span class="valor-text">{{ calcularIdade(usuario.dataNascimento) }} anos</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">E-mail</span>
          <span class="valor-text">{{ usuario.email }}</span>
        </div>
        <div class="info-box input-pill">
          <span class="label-text">CPF</span>
          <span class="valor-text">{{ mascaraCpf(usuario.cpf) }}</span>
        </div>
        <div class="info-box input-pill info-largo">
          <span class="label-text">Endereço</span>
          <span class="valor-text">{{ enderecoTexto }}</span>
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
            <span class="subtitulo">Objetivo do Usuário</span>
          </div>
          <ul>
            <li v-if="!usuario.preferencias?.objetivo">• Não registrado</li>
            <li v-else>• {{ usuario.preferencias.objetivo }}</li>
          </ul>

          <div class="subsecao">
            <span class="subtitulo">Dieta do Usuário</span>
          </div>
          <ul>
            <li v-if="!usuario.preferencias?.dieta?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.preferencias?.dieta" :key="i">• {{ item }}</li>
          </ul>

          <div class="subsecao">
            <span class="subtitulo">Preferências do Usuário</span>
          </div>
          <ul>
            <li v-if="!usuario.preferencias?.gosto?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.preferencias?.gosto" :key="i">• {{ item }}</li>
          </ul>
        </div>

        <div class="card-box light-card">
          <div class="card-header-action">
            <h3 class="card-title">Alergias / Restrições</h3>
          </div>
          <hr class="card-divider" />

          <div class="subsecao">
            <span class="subtitulo">Alergias do Usuário</span>
          </div>

          <ul>
            <li v-if="!usuario.alergias?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.alergias" :key="i">• {{ item }}</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EditarPerfilView from './EditarPerfilView.vue'
import { useAuth } from '@/composables/useAuth'
import {
  atualizarPaciente,
  buscarPacientePorId,
  buscarPacientes,
} from '@/services/pacientesApi.js'
import { cpfValido, emailValido, mascaraCpf, mascaraTelefone } from '@/utils/mascaras.js'

const { logout } = useAuth()
const router = useRouter()

function sair() {
  logout()
  router.push('/login')
}

const editando = ref(false)

// estados da tela: carregando, erro ao carregar, salvando e a mensagem de aviso
const carregando = ref(true)
const erroCarregar = ref('')
const salvando = ref(false)
const mensagem = ref({ tipo: '', texto: '' }) // tipo: 'carregando' | 'sucesso' | 'erro'

const usuario = reactive({
  id: null,
  nome: '',
  cpf: '',
  peso: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  foto: '',
  endereco: { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' },
  preferencias: { objetivo: '', dieta: [], gosto: [], naoGosto: [] },
  alergias: [],
})

// "Rua X, 120 - Centro, Itajaí/SC"
const enderecoTexto = computed(() => {
  const e = usuario.endereco || {}
  if (!e.rua && !e.cidade) return 'Não registrado'
  return `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}`
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

// GET /pacientes/:id -> busca o paciente logado na API
async function carregarPaciente() {
  carregando.value = true
  erroCarregar.value = ''

  // A sessão (localStorage) só guarda QUEM está logado; os dados vêm da API.
  const sessao = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
  if (!sessao?.id) {
    erroCarregar.value = 'Nenhum usuário logado. Faça login para ver seu perfil.'
    carregando.value = false
    return
  }

  try {
    const dados = await buscarPacientePorId(sessao.id)
    delete dados.senha // a senha não precisa ficar na tela
    Object.assign(usuario, dados)
    carregarPreferenciasDoCadastro()
  } catch (erro) {
    erroCarregar.value = erro.message
  } finally {
    carregando.value = false
  }
}

onMounted(carregarPaciente)

// Mantém a sessão (quem está logado) igual aos dados novos, sem a senha
const atualizarSessao = (dados) => {
  const semSenha = { ...dados }
  delete semSenha.senha
  const sessao = JSON.parse(localStorage.getItem('usuarioLogado') || '{}')
  localStorage.setItem('usuarioLogado', JSON.stringify({ ...sessao, ...semSenha }))
}

// PATCH /pacientes/:id -> grava só os campos enviados
async function enviarAtualizacao(dados, textoSucesso) {
  salvando.value = true
  mensagem.value = { tipo: 'carregando', texto: 'Salvando alterações...' }

  try {
    const atualizado = await atualizarPaciente(usuario.id, dados)
    delete atualizado.senha
    Object.assign(usuario, atualizado)
    atualizarSessao(atualizado)
    mensagem.value = { tipo: 'sucesso', texto: textoSucesso }
    return true
  } catch (erro) {
    mensagem.value = { tipo: 'erro', texto: erro.message }
    return false
  } finally {
    salvando.value = false
  }
}

const selecionarFoto = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    mensagem.value = { tipo: 'erro', texto: 'Selecione uma imagem válida.' }
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    mensagem.value = { tipo: 'erro', texto: 'A imagem deve ter no máximo 2 MB.' }
    return
  }

  const reader = new FileReader()
  reader.onload = () => enviarAtualizacao({ foto: reader.result }, 'Foto atualizada com sucesso!')
  reader.readAsDataURL(file)
}

const salvarAlteracoes = async (novosDados) => {
  const erroForm = (texto) => {
    mensagem.value = { tipo: 'erro', texto }
  }

  if (!novosDados.nome.trim()) return erroForm('Ops, o nome é obrigatório!')
  if (!emailValido(novosDados.email)) return erroForm('Digite um e-mail válido.')
  if (!cpfValido(novosDados.cpf)) return erroForm('Digite um CPF válido.')

  const email = novosDados.email.trim().toLowerCase()

  salvando.value = true
  mensagem.value = { tipo: 'carregando', texto: 'Verificando os dados...' }

  try {
    // CPF e e-mail não podem ser de OUTRO paciente (filtra na API e ignora o próprio)
    const [comMesmoCpf, comMesmoEmail] = await Promise.all([
      buscarPacientes({ cpf: novosDados.cpf }),
      buscarPacientes({ email }),
    ])
    const deOutro = (p) => String(p.id) !== String(usuario.id)

    if (comMesmoCpf.some(deOutro) || comMesmoEmail.some(deOutro)) {
      salvando.value = false
      return erroForm('Já existe outro paciente com este CPF ou e-mail.')
    }
  } catch (erro) {
    salvando.value = false
    return erroForm(erro.message)
  }

  // id e senha não vão no PATCH: a senha continua como está na API
  const dados = Object.fromEntries(
    Object.entries(novosDados).filter(([chave]) => chave !== 'id' && chave !== 'senha'),
  )
  const salvo = await enviarAtualizacao({ ...dados, email }, 'Perfil atualizado com sucesso!')
  if (salvo) editando.value = false
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
  max-width: 920px;
  margin: 48px auto 96px;
  padding: 0 24px;
  box-sizing: border-box;
  position: relative;
}

.perfil-content {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ===== Topo: foto, nome e ações ===== */
.profile-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin: 8px 0 40px;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(51, 63, 52, 0.25);
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(38, 48, 31, 0.4);
  color: #f1edd2;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-wrapper:hover .upload-foto,
.upload-foto:focus-within {
  opacity: 1;
}

.upload-foto input {
  display: none;
}

.upload-foto i {
  font-size: 1.3rem;
  background: #536236;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #f1edd2;
}

.header-texto {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.user-name {
  font-family: 'Italiana', serif;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 400;
  line-height: 1.05;
  color: #73441b;
  margin: 0;
}

.header-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-editar,
.btn-sair {
  border-radius: 10px;
  padding: 9px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-editar {
  background: #536236;
  border: 1.5px solid #536236;
  color: #f1edd2;
}

.btn-editar:hover {
  background: #333f34;
  border-color: #333f34;
}

.btn-sair {
  background: transparent;
  border: 1.5px solid #536236;
  color: #536236;
}

.btn-sair:hover {
  background: rgba(83, 98, 54, 0.1);
}

.btn-editar:focus-visible,
.btn-sair:focus-visible,
.btn-definir-pref:focus-visible,
.delete-icon-btn:focus-visible {
  outline: 3px solid #73441b;
  outline-offset: 3px;
}

.delete-icon-btn {
  position: absolute;
  top: 8px;
  right: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px solid rgba(51, 63, 52, 0.3);
  color: #536236;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.delete-icon-btn:hover {
  border-color: #a13d3d;
  color: #a13d3d;
}

/* ===== Dados pessoais ===== */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 20px;
  margin-bottom: 40px;
}

.input-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px 18px;
  background: #f7f3e1;
  border: 1px solid rgba(51, 63, 52, 0.18);
  border-radius: 12px;
  box-sizing: border-box;
}

.label-text {
  font-family: 'Roboto', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #536236;
}

.valor-text {
  font-size: 1.05rem;
  font-weight: 500;
  color: #333f34;
  word-break: break-word;
}

/* ===== Cartões de preferências e alergias ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.light-card {
  background: #f7f3e1;
  border: 1px solid rgba(51, 63, 52, 0.18);
  border-radius: 16px;
  padding: 24px 26px;
  min-height: 200px;
}

.card-header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-title {
  font-family: 'Italiana', serif;
  font-size: 1.7rem;
  font-weight: 400;
  color: #73441b;
  margin: 0;
}

.btn-definir-pref {
  background: transparent;
  color: #536236;
  border: 1.5px solid #536236;
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-definir-pref:hover {
  background: rgba(83, 98, 54, 0.1);
}

.card-divider {
  border: 0;
  height: 1px;
  background: rgba(51, 63, 52, 0.2);
  margin: 12px 0 16px;
}

.subsecao {
  display: block;
  margin: 16px 0 6px;
}

.subtitulo {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #73441b;
}

ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

li {
  color: #333f34;
  font-size: 1rem;
  margin-bottom: 4px;
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

  .header-texto {
    align-items: center;
  }

  .header-acoes {
    justify-content: center;
  }
}

/* ===== Novidades da versão com API ===== */
.info-largo {
  grid-column: 1 / -1;
}

.estado {
  text-align: center;
  color: #536236;
  font-size: 1.1rem;
  padding: 60px 0;
}

.estado-erro {
  color: #8a2f2f;
}

.estado-erro p {
  margin: 0 0 16px;
}

.feedback {
  margin: 0 0 24px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  text-align: center;
}

.feedback.carregando {
  background: #ebe2cc;
  color: #4a5435;
}

.feedback.sucesso {
  background: #dfe8cf;
  color: #3b4a22;
}

.feedback.erro {
  background: #f3dcd6;
  color: #8a2f2f;
}
</style>
