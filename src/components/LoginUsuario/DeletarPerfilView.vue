
<template>
  <div class="deletar-container">
    <!-- NOVO: mensagens de carregamento, sucesso e erro -->
    <p v-if="sucesso" class="feedback sucesso" role="status">{{ sucesso }}</p>

    <p v-else-if="carregando" class="estado" role="status">Carregando seus dados...</p>

    <div v-else-if="erroCarregar" class="estado estado-erro" role="alert">
      <p>{{ erroCarregar }}</p>
      <button type="button" class="btn-pill btn-cancelar" @click="carregarPaciente">
        Tentar novamente
      </button>
    </div>

    <template v-else>
    <!-- Header com Avatar, Título e Nome -->
    <div class="header-deletar">
      <div class="avatar-box">
        <img :src="usuario.foto || 'https://via.placeholder.com/150'" :alt="usuario.nome" />
      </div>
      <div class="titles">
        <h1 class="serif-title page-title">Deletar Perfil</h1>
        <h2 class="serif-title user-name">{{ usuario.nome || 'Usuário' }}</h2>
      </div>
    </div>

    <!-- Pílulas de Informação -->
    <div class="info-grid">
      <div class="input-pill col-half">
        <span class="label-text">Peso</span>
        <span class="valor-text">{{ usuario.peso }}</span>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Telefone</span>
        <span class="valor-text">{{ mascaraTelefone(usuario.telefone) }}</span>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Idade</span>
        <span class="valor-text">{{ calcularIdade(usuario.dataNascimento) }} anos</span>
      </div>
      <div class="input-pill col-half">
        <span class="label-text">E-mail</span>
        <span class="valor-text">{{ usuario.email }}</span>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">CPF</span>
        <span class="valor-text">{{ mascaraCpf(usuario.cpf) }}</span>
      </div>

      <div class="input-pill col-full">
        <span class="label-text">Endereço</span>
        <span class="valor-text">{{ enderecoTexto }}</span>
      </div>
    </div>

    <!-- Cards de Preferências e Alergias -->
    <div class="cards-grid">
      <!-- Card Preferências -->
      <div class="card-box light-card">
        <h3 class="card-title">Preferências</h3>
        <hr class="card-divider" />

        <div class="preferencias-columns">
          <div class="pref-col">
            <p class="section-subtitle">Gosto</p>
            <ul>
              <li v-if="!usuario.preferencias?.gosto?.length">• Não registrado</li>
              <li v-for="(item, i) in usuario.preferencias?.gosto" :key="i">• {{ item }}</li>
            </ul>
          </div>

          <div class="pref-col">
            <p class="section-subtitle">Não gosta</p>
            <ul>
              <li v-if="!usuario.preferencias?.naoGosto?.length">• Não registrado</li>
              <li v-for="(item, i) in usuario.preferencias?.naoGosto" :key="i">• {{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Card Alergias -->
      <div class="card-box light-card">
        <h3 class="card-title">Alergias</h3>
        <hr class="card-divider" />
        <ul>
          <li v-if="!usuario.alergias?.length">• Não registrado</li>
          <li v-for="(item, i) in usuario.alergias" :key="i">• {{ item }}</li>
        </ul>
      </div>
    </div>

    <!-- Botões Inferiores -->
    <div class="actions-bar">
      <button type="button" class="btn-pill btn-confirmar" @click="abrirModal = true">
        Confirmar
      </button>
      <button type="button" class="btn-pill btn-cancelar" @click="router.push('/perfil')">
        Cancelar
      </button>
    </div>

    <!-- Modal de Confirmação (Centralizado no centro da tela) -->
    <div v-if="abrirModal" class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-icon"><i class="mdi mdi-delete-outline"></i></div>
        <h2 class="modal-title">Excluir Perfil</h2>

        <div class="input-modal">
          <label class="modal-label">Digite sua senha para confirmar exclusão:</label>
          <input
            type="password"
            v-model="senhaConfirmacao"
          />
        </div>

        <p v-if="erroModal" class="modal-erro" role="alert">{{ erroModal }}</p>

        <div class="modal-actions">
          <button type="button" class="btn-modal-pill" :disabled="excluindo" @click="fecharModal">
            Cancelar
          </button>
          <button type="button" class="btn-modal-pill" :disabled="excluindo" @click="confirmarExclusao">
            {{ excluindo ? 'Excluindo...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { buscarPacientePorId, excluirPaciente } from '@/services/pacientesApi.js';
import { mascaraCpf, mascaraTelefone } from '@/utils/mascaras.js';

const router = useRouter();
const { logout } = useAuth();
const abrirModal = ref(false);
const senhaConfirmacao = ref('');

// estados da tela
const carregando = ref(true);
const erroCarregar = ref('');
const excluindo = ref(false);
const erroModal = ref('');
const sucesso = ref('');

const usuario = reactive({
  id: '',
  tipo: 'paciente',
  nome: '',
  cpf: '',
  email: '',
  peso: '',
  telefone: '',
  dataNascimento: '',
  foto: '',
  endereco: { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '' },
  preferencias: { gosto: [], naoGosto: [] },
  alergias: []
});

const enderecoTexto = computed(() => {
  const e = usuario.endereco || {};
  if (!e.rua && !e.cidade) return 'Não registrado';
  return `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}`;
});

// GET /pacientes/:id -> busca os dados na API para mostrar o que será excluído
async function carregarPaciente() {
  carregando.value = true;
  erroCarregar.value = '';

  const sessao = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  if (!sessao?.id) {
    erroCarregar.value = 'Nenhum usuário logado.';
    carregando.value = false;
    return;
  }

  try {
    const dados = await buscarPacientePorId(sessao.id);
    delete dados.senha; // a senha não fica guardada na tela
    Object.assign(usuario, dados);
  } catch (erro) {
    erroCarregar.value = erro.message;
  } finally {
    carregando.value = false;
  }
}

onMounted(carregarPaciente);

const calcularIdade = (dataNasc) => {
  if (!dataNasc) return '--';
  const hoje = new Date();
  const nascimento = new Date(dataNasc);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

const fecharModal = () => {
  abrirModal.value = false;
  senhaConfirmacao.value = '';
  erroModal.value = '';
};

// A confirmação antes de excluir é o modal com a senha.
// Depois: confere a senha na API e manda DELETE /pacientes/:id
const confirmarExclusao = async () => {
  erroModal.value = '';

  if (!senhaConfirmacao.value.trim()) {
    erroModal.value = 'Por favor, digite sua senha.';
    return;
  }

  excluindo.value = true;

  try {
    // busca de novo para conferir a senha que está de verdade na API
    const atual = await buscarPacientePorId(usuario.id);
    if (senhaConfirmacao.value !== atual.senha) {
      erroModal.value = 'Senha incorreta! Não foi possível excluir a conta.';
      return;
    }

    await excluirPaciente(usuario.id);

    logout();
    fecharModal();
    sucesso.value = 'Conta excluída com sucesso. Redirecionando...';
    setTimeout(() => router.push('/login'), 1500);
  } catch (erro) {
    erroModal.value = erro.message;
  } finally {
    excluindo.value = false;
  }
};
</script>

<style scoped>
.deletar-container {
  width: 100%;
  max-width: 920px;
  margin: 40px auto 80px;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* ===== Topo ===== */
.header-deletar {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 36px;
}

.avatar-box {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(51, 63, 52, 0.25);
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.serif-title {
  font-family: 'Italiana', serif;
  font-weight: 400;
  margin: 0;
}

.page-title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  line-height: 1.05;
  color: #a13d3d;
}

.user-name {
  font-size: 1.5rem;
  color: #536236;
}

/* ===== Dados ===== */
.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 20px;
  margin-bottom: 24px;
}

.col-half {
  width: calc(50% - 10px);
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

/* ===== Cartões ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.light-card {
  background: #f7f3e1;
  border: 1px solid rgba(51, 63, 52, 0.18);
  border-radius: 16px;
  padding: 24px 26px;
  min-height: 200px;
}

.card-title {
  font-family: 'Italiana', serif;
  font-size: 1.7rem;
  font-weight: 400;
  color: #73441b;
  margin: 0;
}

.card-divider {
  border: 0;
  height: 1px;
  background: rgba(51, 63, 52, 0.2);
  margin: 12px 0 16px;
}

.preferencias-columns {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.pref-col {
  flex: 1;
}

.section-subtitle {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #73441b;
  margin: 0 0 6px;
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

/* ===== Botões ===== */
.actions-bar {
  width: 100%;
  display: flex;
  gap: 16px;
}

.btn-pill {
  flex: 1;
  border-radius: 12px;
  padding: 15px 28px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

/* Excluir é uma ação perigosa: o botão que confirma fica vermelho */
.btn-confirmar {
  background: #a13d3d;
  border: 1.5px solid #a13d3d;
  color: #f1edd2;
}

.btn-confirmar:hover {
  background: #832f2f;
  border-color: #832f2f;
}

.btn-cancelar {
  background: transparent;
  border: 1.5px solid #536236;
  color: #536236;
}

.btn-cancelar:hover {
  background: rgba(83, 98, 54, 0.1);
}

.btn-pill:focus-visible,
.btn-modal-pill:focus-visible {
  outline: 3px solid #73441b;
  outline-offset: 3px;
}

/* ===== Janela de confirmação ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(51, 63, 52, 0.45);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: #f7f3e1;
  border: 1px solid rgba(51, 63, 52, 0.2);
  padding: 32px;
  border-radius: 16px;
  width: 90%;
  max-width: 460px;
  text-align: center;
}

.modal-icon {
  font-size: 2rem;
  color: #a13d3d;
  margin-bottom: 6px;
}

.modal-title {
  font-family: 'Italiana', serif;
  font-size: 2rem;
  font-weight: 400;
  color: #73441b;
  margin: 0 0 20px;
}

.input-modal {
  background: #fbf8ec;
  border: 1px solid rgba(115, 68, 27, 0.45);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  text-align: left;
}

.input-modal:focus-within {
  border-color: #536236;
  outline: 2px solid #536236;
  outline-offset: 2px;
}

.modal-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #536236;
  margin-bottom: 4px;
}

.input-modal input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: #333f34;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.btn-modal-pill {
  flex: 1;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

/* Primeiro botão (Cancelar): contorno verde. Segundo (Confirmar): vermelho */
.btn-modal-pill:first-child {
  background: transparent;
  border: 1.5px solid #536236;
  color: #536236;
}

.btn-modal-pill:first-child:hover {
  background: rgba(83, 98, 54, 0.1);
}

.btn-modal-pill:last-child {
  background: #a13d3d;
  border: 1.5px solid #a13d3d;
  color: #f1edd2;
}

.btn-modal-pill:last-child:hover {
  background: #832f2f;
  border-color: #832f2f;
}

@media (max-width: 768px) {
  .col-half {
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .preferencias-columns {
    flex-direction: column;
  }

  .header-deletar {
    flex-direction: column;
    text-align: center;
  }

  .actions-bar {
    flex-direction: column;
  }
}

/* ===== Novidades da versão com API ===== */
.col-full {
  width: 100%;
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

.feedback.sucesso {
  background: #dfe8cf;
  color: #3b4a22;
}

.modal-erro {
  margin: -8px 0 16px;
  font-size: 0.92rem;
  color: #a13d3d;
}

.btn-pill:disabled,
.btn-modal-pill:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
