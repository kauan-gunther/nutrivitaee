<template>
  <div class="deletar-container">
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
        <span class="label-text">peso:</span>
        <span class="valor-text">{{ usuario.peso }}</span>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Telefone:</span>
        <span class="valor-text">{{ usuario.telefone }}</span>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Idade:</span>
        <span class="valor-text">{{ calcularIdade(usuario.dataNascimento) }} anos</span>
      </div>
               <div class="input-pill col-half">
          <span class="label-text">email:</span>
          <span class="valor-text">{{ usuario.email }}</span>
        </div>
             <div class="input-pill col-half">
          <span class="label-text">cpf</span>
          <span class="valor-text">{{ usuario.cpf }}</span>
      </div>
    </div>

    <!-- Cards de Preferências e Alergias -->
    <div class="cards-grid">
      <!-- Card Preferências -->
      <div class="card-box light-card">
        <h3 class="card-title">Preferencias</h3>
        <hr class="card-divider" />
        
        <div class="preferencias-columns">
          <div class="pref-col">
            <p class="section-subtitle">gosto:</p>
            <ul>
              <li v-if="!usuario.preferencias?.gosto?.length">• Não registrado</li>
              <li v-for="(item, i) in usuario.preferencias?.gosto" :key="i">• {{ item }}</li>
            </ul>
          </div>

          <div class="pref-col">
            <p class="section-subtitle">Não gosta:</p>
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

        <div class="modal-actions">
          <button type="button" class="btn-modal-pill" @click="abrirModal = false">Cancelar</button>
          <button type="button" class="btn-modal-pill" @click="confirmarExclusao">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const abrirModal = ref(false);
const senhaConfirmacao = ref('');

const usuario = reactive({
  nome: '',
  peso: '',
  telefone: '',
  dataNascimento: '',
  senha: '',
  foto: '',
  preferencias: { gosto: [], naoGosto: [] },
  alergias: []
});

onMounted(() => {
  const dadosSalvos = localStorage.getItem('usuarioLogado');
  if (dadosSalvos) {
    Object.assign(usuario, JSON.parse(dadosSalvos));
  }
});

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

const confirmarExclusao = () => {
  if (!senhaConfirmacao.value) {
    alert('Por favor, digite sua senha.');
    return;
  }

  if (usuario.senha && senhaConfirmacao.value !== usuario.senha) {
    alert('Senha incorreta! Não foi possível excluir a conta.');
    return;
  }

  localStorage.removeItem('usuarioLogado');
  alert('Conta excluída com sucesso.');
  router.push('/cadastro');
};
</script>

<style scoped>
.deletar-container {
  width: 100%;
  max-width: 820px;
  margin: 30px auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Header com Avatar e Títulos */
.header-deletar {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 30px;
  justify-content: flex-start;
}

.avatar-box {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.titles {
  display: flex;
  flex-direction: column;
}

.serif-title {
  font-family: 'Italiana', serif, sans-serif;
  font-weight: 400;
  margin: 0;
}

.page-title {
  font-size: 3rem;
  color: #705335;
}

.user-name {
  font-size: 2.8rem;
  color: #705335;
}

/* Grid de Informações Principais */
.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  margin-bottom: 24px;
}

.col-half {
  width: calc(50% - 12px);
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
  font-family: 'Italiana', serif, sans-serif;
}

.valor-text {
  color: #705335;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Cards Inferiores */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.light-card {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 16px;
  padding: 18px 22px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  min-height: 200px;
}

.card-title {
  text-align: center;
  font-family: 'Italiana', serif, sans-serif;
  font-size: 1.4rem;
  color: #705335;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.card-divider {
  border: 0;
  height: 1.5px;
  background-color: #536236;
  margin-bottom: 12px;
}

.preferencias-columns {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.pref-col {
  flex: 1;
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

/* Botões do Rodapé */
.actions-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.btn-pill {
  flex: 1;
  background-color: #536236;
  color: #f1ebd9;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease, transform 0.2s ease;
  text-align: center;
}

.btn-pill:hover {
  background-color: #43502a;
  transform: translateY(-2px);
}

/* Modal Centralizado na Tela */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  padding: 28px 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 440px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.modal-icon {
  font-size: 2rem;
  color: #4a5435;
  margin-bottom: 6px;
}

.modal-title {
  font-family: 'Italiana', serif, sans-serif;
  font-size: 1.8rem;
  color: #705335;
  margin: 0 0 16px 0;
  font-weight: 400;
}

.input-modal {
  background-color: #f0e8d5;
  border: 1px solid #8c7355;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 20px;
  text-align: left;
}

.modal-label {
  display: block;
  font-size: 0.85rem;
  color: #4a5435;
  font-weight: 600;
  margin-bottom: 4px;
}

.input-modal input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: #705335;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-modal-pill {
  flex: 1;
  background-color: #536236;
  color: #f1ebd9;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-modal-pill:hover {
  background-color: #43502a;
}

@media (max-width: 768px) {
  .col-half {
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .header-deletar {
    flex-direction: column;
    text-align: center;
  }

  .actions-bar {
    flex-direction: column;
    gap: 15px;
  }
}
</style>