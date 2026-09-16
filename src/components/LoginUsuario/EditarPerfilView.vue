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
        <span class="label-text">Nome:</span>
        <input v-model="form.nome" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">Cpf:</span>
        <input v-model="form.cpf" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Peso (meia largura) -->
      <div class="input-pill col-half">
        <span class="label-text">Peso:</span>
        <input v-model="form.peso" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Data de Nascimento (largura total) -->
      <div class="input-pill col-full">
        <span class="label-text">Data de nascimento:</span>
        <input v-model="form.dataNascimento" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Telefone e E-mail -->
      <div class="input-pill col-half">
        <span class="label-text">Telefone:</span>
        <input v-model="form.telefone" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <div class="input-pill col-half">
        <span class="label-text">E-mail:</span>
        <input v-model="form.email" />
        <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
      </div>

      <!-- Cards de Preferências e Alergias (Editáveis) -->
      <div class="card-light card-edit col-half">
        <div class="card-header">
          <h3 class="card-title">Preferencias</h3>
          <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
        </div>
        <hr class="card-divider" />
        
        <p class="section-subtitle">gosto:</p>
        <div v-for="(p, i) in form.preferencias?.gosto" :key="'gosto-'+i" class="editable-item-row">
          <input v-model="form.preferencias.gosto[i]" placeholder="Ex: Soja" />
          <button type="button" class="btn-remover" @click="removerItem(form.preferencias.gosto, i)">✕</button>
        </div>
        <button type="button" class="btn-adicionar" @click="adicionarItem(form.preferencias, 'gosto')">+ Adicionar gosto</button>

        <p class="section-subtitle mt-2">Não gosta</p>
        <div v-for="(np, i) in form.preferencias?.naoGosto" :key="'naoGosto-'+i" class="editable-item-row">
          <input v-model="form.preferencias.naoGosto[i]" placeholder="Ex: Cebola" />
          <button type="button" class="btn-remover" @click="removerItem(form.preferencias.naoGosto, i)">✕</button>
        </div>
        <button type="button" class="btn-adicionar" @click="adicionarItem(form.preferencias, 'naoGosto')">+ Adicionar não gosta</button>
      </div>

      <div class="card-light card-edit col-half">
        <div class="card-header">
          <h3 class="card-title">Alergias</h3>
          <div class="icon-circle"><i class="mdi mdi-pencil-outline"></i></div>
        </div>
        <hr class="card-divider" />
        
        <div v-for="(a, i) in form.alergias" :key="'alergia-'+i" class="editable-item-row">
          <input v-model="form.alergias[i]" placeholder="Ex: Frutos do Mar" />
          <button type="button" class="btn-remover" @click="removerItem(form.alergias, i)">✕</button>
        </div>
        <button type="button" class="btn-adicionar" @click="adicionarAlergia">+ Adicionar alergia</button>
      </div>

      <!-- Botões Inferiores -->
      <div class="footer-confirm">
        <button type="button" class="btn-pill btn-confirmar" @click="salvar">Confirmar</button>
        <button type="button" class="btn-pill btn-cancelar" @click="$emit('cancelar')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  usuario: { type: Object, required: true }
});

const emit = defineEmits(['salvar-edicao', 'cancelar']);

const form = reactive({ ...props.usuario });

watch(() => props.usuario, (novo) => {
  Object.assign(form, JSON.parse(JSON.stringify(novo)));
}, { deep: true, immediate: true });

// Funções auxiliares para gerenciar os arrays de preferências e alergias com segurança
const removerItem = (array, index) => {
  array.splice(index, 1);
};

const adicionarItem = (objPreferencias, chave) => {
  if (!objPreferencias[chave]) {
    objPreferencias[chave] = [];
  }
  objPreferencias[chave].push('');
};

const adicionarAlergia = () => {
  if (!form.alergias) {
    form.alergias = [];
  }
  form.alergias.push('');
};

const salvar = () => {
  emit('salvar-edicao', JSON.parse(JSON.stringify(form)));
};
</script>

<style scoped>
.editar-container {
  width: 100%;
  max-width: 820px;
  margin: 30px auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header com Avatar e Nome */
.profile-header {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 30px;
  width: 100%;
  justify-content: center;
}

.avatar-wrapper {
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
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.serif-title {
  font-weight: bold;
  margin: 0;
}

.page-title {
  font-size: 40px;
  color: #705335;
}

.user-name {
  font-size: 40px;
  color: #705335;
}

/* Grid do Formulário */
.edit-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  width: 100%;
}

.col-half {
  width: calc(50% - 12px);
}

.col-full {
  width: 100%;
}

/* Inputs em Formato de Pílula */
.input-pill {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 52px;
}

.label-text {
  color: #4a5435;
  font-size: 1.15rem;
  font-weight: bold;
  white-space: nowrap;
}

.input-pill input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 1.05rem;
  color: #705335;
  margin: 0 10px;
  font-family: inherit;
  font-weight: 600;
}

.icon-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #4a5435;
  flex-shrink: 0;
}

/* Cards de Preferências e Alergias */
.card-light {
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 16px;
  padding: 18px 22px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  min-height: 220px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.4rem;
  color: #705335;
  font-weight: bold;
  margin: 0;
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

.editable-item-row {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4);
  border: 1px solid #8c7355;
  border-radius: 8px;
  padding: 4px 8px;
  margin-bottom: 6px;
}

.editable-item-row input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #705335;
  font-weight: bold;
  font-family: inherit;
}

.btn-remover {
  background: transparent;
  border: none;
  color: #536236;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 4px;
}

.btn-adicionar {
  background: transparent;
  border: none;
  color: #536236;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 0;
  margin-bottom: 6px;
  display: inline-block;
}

.btn-adicionar:hover {
  text-decoration: underline;
}

.mt-2 {
  margin-top: 10px;
}

/* Botões do Rodapé */
.footer-confirm {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 25px;
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
    gap: 15px;
  }
}
</style>