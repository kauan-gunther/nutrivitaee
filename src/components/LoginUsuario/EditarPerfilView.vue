<template>
  <div class="editar-container">
    <!-- Cabeçalho com Avatar, Título e Nome -->
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img :src="form.foto || 'https://via.placeholder.com/150'" :alt="form.nome" class="avatar-img" />
      </div>
      <div class="header-titles">
        <h1 class="serif-title page-title">Editar Perfil</h1>
        <h2 class="serif-title user-name">{{ form.nome }}</h2>
      </div>
    </div>

    <!-- Grid do Formulário -->
    <div class="edit-grid">
      <!-- Nome e CPF -->
      <div class="input-pill col-half">
        <span class="label-text">Nome</span>
        <input v-model="form.nome" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">CPF</span>
        <input
          inputmode="numeric"
          :value="form.cpf"
          @input="form.cpf = mascaraCpf($event.target.value)"
        />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Peso (meia largura) -->
      <div class="input-pill col-half">
        <span class="label-text">Peso</span>
        <input v-model="form.peso" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Data de Nascimento (largura total) -->
      <div class="input-pill col-full">
        <span class="label-text">Data de nascimento</span>
        <input type="date" v-model="form.dataNascimento" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Telefone e E-mail -->
      <div class="input-pill col-half">
        <span class="label-text">Telefone</span>
        <input
          inputmode="tel"
          :value="form.telefone"
          @input="form.telefone = mascaraTelefone($event.target.value)"
        />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">E-mail</span>
        <input v-model="form.email" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- NOVO: endereço (o CEP preenche rua, bairro, cidade e estado) -->
      <h3 class="secao-titulo col-full">Endereço</h3>

      <div class="input-pill col-half">
        <span class="label-text">CEP</span>
        <input
          inputmode="numeric"
          placeholder="00000-000"
          :value="form.endereco.cep"
          @input="aoDigitarCep($event.target.value)"
        />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Número</span>
        <input v-model="form.endereco.numero" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-full">
        <span class="label-text">Rua</span>
        <input v-model="form.endereco.rua" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Bairro</span>
        <input v-model="form.endereco.bairro" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Cidade</span>
        <input v-model="form.endereco.cidade" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Estado (UF)</span>
        <input maxlength="2" v-model="form.endereco.estado" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <p v-if="avisoCep.texto" class="aviso col-full" :class="avisoCep.tipo">{{ avisoCep.texto }}</p>

      <!-- Cards de Preferências e Alergias -->
      <div class="card-light card-edit col-half">
        <div class="card-header">
          <h3 class="card-title">Preferências</h3>
          <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
        </div>
        <hr class="card-divider" />
        <p class="section-subtitle">Gosto</p>
        <ul>
          <li v-for="(p, i) in form.preferencias?.gosto" :key="i">• {{ p }}</li>
          <li v-if="!form.preferencias?.gosto?.length">• Não registrado</li>
        </ul>
        <p class="section-subtitle mt-2">Não gosta</p>
        <ul>
          <li v-for="(np, i) in form.preferencias?.naoGosto" :key="i">• {{ np }}</li>
          <li v-if="!form.preferencias?.naoGosto?.length">• Não registrado</li>
        </ul>
      </div>

      <div class="card-light card-edit col-half">
        <div class="card-header">
          <h3 class="card-title">Alergias</h3>
          <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
        </div>
        <hr class="card-divider" />
        <ul>
          <li v-for="(a, i) in form.alergias" :key="i">• {{ a }}</li>
          <li v-if="!form.alergias?.length">• Não registrado</li>
        </ul>
      </div>

      <p v-if="erroForm" class="aviso erro col-full" role="alert">{{ erroForm }}</p>

      <!-- Botões Inferiores -->
      <div class="footer-confirm">
        <button type="button" class="btn-pill btn-confirmar" :disabled="salvando" @click="salvar">
          {{ salvando ? 'Salvando...' : 'Confirmar' }}
        </button>
        <button
          type="button"
          class="btn-pill btn-cancelar"
          :disabled="salvando"
          @click="$emit('cancelar')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { buscarCep } from '@/services/pacientesApi.js';
import {
  cpfValido,
  dataNascimentoValida,
  emailValido,
  mascaraCep,
  mascaraCpf,
  mascaraTelefone,
  somenteNumeros,
} from '@/utils/mascaras.js';

const props = defineProps({
  usuario: { type: Object, required: true },
  salvando: { type: Boolean, default: false }
});

const emit = defineEmits(['salvar-edicao', 'cancelar']);

// Prepara os dados para a tela: máscaras nos campos e endereço sempre completo
// (pacientes antigos podem não ter endereço salvo ainda)
function prepararForm(dados) {
  return {
    ...dados,
    cpf: mascaraCpf(dados.cpf),
    telefone: mascaraTelefone(dados.telefone),
    endereco: {
      rua: '', numero: '', bairro: '', cidade: '', estado: '',
      ...dados.endereco,
      cep: mascaraCep(dados.endereco?.cep),
    },
  };
}

const form = reactive(prepararForm(props.usuario));
const erroForm = ref('');
const avisoCep = ref({ tipo: '', texto: '' });

watch(() => props.usuario, (novo) => {
  Object.assign(form, prepararForm(JSON.parse(JSON.stringify(novo))));
}, { deep: true, immediate: true });

// Digitou o CEP: máscara e, ao completar 8 números, consulta o ViaCEP
async function aoDigitarCep(valor) {
  form.endereco.cep = mascaraCep(valor);
  avisoCep.value = { tipo: '', texto: '' };

  if (somenteNumeros(form.endereco.cep).length !== 8) return;

  avisoCep.value = { tipo: 'carregando', texto: 'Buscando endereço...' };
  try {
    const endereco = await buscarCep(form.endereco.cep);
    Object.assign(form.endereco, endereco);
    avisoCep.value = { tipo: '', texto: '' };
  } catch (erro) {
    avisoCep.value = { tipo: 'erro', texto: `${erro.message} Preencha o endereço manualmente.` };
  }
}

const salvar = () => {
  erroForm.value = '';

  if (!form.nome.trim()) return (erroForm.value = 'Ops, o nome é obrigatório!');
  if (!emailValido(form.email)) return (erroForm.value = 'Digite um e-mail válido.');
  if (!cpfValido(form.cpf)) return (erroForm.value = 'Digite um CPF válido.');
  if (somenteNumeros(form.telefone).length < 10) return (erroForm.value = 'Digite um telefone com DDD.');
  if (!dataNascimentoValida(form.dataNascimento)) return (erroForm.value = 'Digite uma data de nascimento válida.');

  const dados = JSON.parse(JSON.stringify(form));
  // volta para o formato salvo na API: só números em CPF, telefone e CEP
  dados.cpf = somenteNumeros(dados.cpf);
  dados.telefone = somenteNumeros(dados.telefone);
  dados.endereco.cep = somenteNumeros(dados.endereco.cep);
  dados.endereco.estado = dados.endereco.estado.trim().toUpperCase();

  emit('salvar-edicao', dados);
};
</script>

<style scoped>
.editar-container {
  width: 100%;
  max-width: 920px;
  margin: 40px auto 80px;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== Topo ===== */
.profile-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 36px;
  width: 100%;
  justify-content: center;
}

.avatar-wrapper {
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
}

.header-titles {
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
  color: #73441b;
}

.user-name {
  font-size: 1.5rem;
  color: #536236;
}

/* ===== Campos ===== */
.edit-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 20px;
  width: 100%;
}

.col-half {
  width: calc(50% - 10px);
}

.col-full {
  width: 100%;
}

.input-pill {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px 52px 12px 18px;
  background: #fbf8ec;
  border: 1px solid rgba(115, 68, 27, 0.45);
  border-radius: 12px;
  box-sizing: border-box;
}

.input-pill:focus-within {
  border-color: #536236;
  outline: 2px solid #536236;
  outline-offset: 2px;
}

.label-text {
  font-family: 'Roboto', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #536236;
}

.input-pill input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
  font-family: inherit;
  font-weight: 500;
  color: #333f34;
}

.icon-circle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(83, 98, 54, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #536236;
  flex-shrink: 0;
}

/* ===== Cartões ===== */
.card-light {
  background: #f7f3e1;
  border: 1px solid rgba(51, 63, 52, 0.18);
  border-radius: 16px;
  padding: 24px 26px;
  box-sizing: border-box;
  min-height: 220px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .icon-circle {
  position: static;
  transform: none;
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

.mt-2 {
  margin-top: 16px;
}

/* ===== Botões ===== */
.footer-confirm {
  width: 100%;
  display: flex;
  gap: 16px;
  margin-top: 16px;
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

.btn-confirmar {
  background: #536236;
  border: 1.5px solid #536236;
  color: #f1edd2;
}

.btn-confirmar:hover {
  background: #333f34;
  border-color: #333f34;
}

.btn-cancelar {
  background: transparent;
  border: 1.5px solid #536236;
  color: #536236;
}

.btn-cancelar:hover {
  background: rgba(83, 98, 54, 0.1);
}

.btn-pill:focus-visible {
  outline: 3px solid #73441b;
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .col-half {
    width: 100%;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .footer-confirm {
    flex-direction: column;
  }
}

/* ===== Novidades da versão com API ===== */
.secao-titulo {
  font-family: 'Italiana', serif;
  font-size: 1.8rem;
  font-weight: 400;
  color: #73441b;
  margin: 12px 0 0;
}

.aviso {
  margin: 0;
  font-size: 0.95rem;
  color: #536236;
}

.aviso.erro {
  padding: 12px 16px;
  border-radius: 12px;
  background: #f3dcd6;
  color: #8a2f2f;
  text-align: center;
  font-size: 1rem;
}

.btn-pill:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
