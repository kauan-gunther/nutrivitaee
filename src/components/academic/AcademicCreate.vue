<script setup>
import { ref } from 'vue'

const emit = defineEmits(['salvar', 'cancelar'])

const nome = ref('')
const curso = ref('')
const instituicao = ref('')
const registro = ref('')
const grau = ref('')

const fotoPerfil = ref(null)
const diplomaFoto = ref(null)

const inputPerfil = ref(null)
const inputDiploma = ref(null)

function escolherFotoPerfil(event) {
  const arquivo = event.target.files[0]
  if (arquivo) {
    const leitor = new FileReader()
    leitor.onload = (e) => {
      fotoPerfil.value = e.target.result
    }
    leitor.readAsDataURL(arquivo)
  }
}

function escolherFotoDiploma(event) {
  const arquivo = event.target.files[0]
  if (arquivo) {
    const leitor = new FileReader()
    leitor.onload = (e) => {
      diplomaFoto.value = e.target.result
    }
    leitor.readAsDataURL(arquivo)
  }
}

function enviarFormulario() {
  const novoRegistro = {
    nome: nome.value,
    curso: curso.value,
    instituicao: instituicao.value,
    registro: registro.value,
    grau: grau.value,
    fotoPerfil: fotoPerfil.value,
    diplomaFoto: diplomaFoto.value,
  }
  emit('salvar', novoRegistro)
}
</script>

<template>
  <div class="card-box">
    <h1 class="page-title">Cadastro de Formação Acadêmica</h1>

    <form @submit.prevent="enviarFormulario">
      <div class="perfil-upload-container" @click="inputPerfil.click()">
        <input type="file" ref="inputPerfil" accept="image/*" hidden @change="escolherFotoPerfil" />
        <img v-if="fotoPerfil" :src="fotoPerfil" class="perfil-preview" alt="Foto Perfil" />
        <div v-else class="perfil-placeholder">
          <span>Foto Perfil</span>
        </div>
      </div>

      <div class="form-grid">
        <input v-model="nome" type="text" placeholder="Nome Completo:" class="input-field full" required />
        <input v-model="curso" type="text" placeholder="Nome do Curso:" class="input-field full" required />
        <input v-model="instituicao" type="text" placeholder="Nome da Instituição:" class="input-field full" required />
        <input v-model="registro" type="text" placeholder="Número do Diploma/Registro:" class="input-field" required />
        <input v-model="grau" type="text" placeholder="Grau Académico:" class="input-field" required />
      </div>

      <div class="upload-area" @click="inputDiploma.click()">
        <input type="file" ref="inputDiploma" accept="image/*" hidden @change="escolherFotoDiploma" />
        <img v-if="diplomaFoto" :src="diplomaFoto" class="diploma-preview" alt="Diploma" />
        <div v-else class="diploma-placeholder">
          <span class="plus-icon">+</span>
          <p>Anexar Imagem do Diploma</p>
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-save">Salvar</button>
        <button type="button" @click="emit('cancelar')" class="btn btn-cancel">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.card-box {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
}

.page-title {
  font-family: 'Georgia', serif;
  font-size: 2.2rem;
  color: #553d2d;
  margin-bottom: 25px;
  font-weight: normal;
  text-align: center;
}

.perfil-upload-container {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: transparent;
  margin: 0 auto 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid #7c6c54;
}

.perfil-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.perfil-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #7c6c54;
  font-size: 0.85rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.input-field {
  background: transparent;
  border: 2px solid #7c6c54;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 1rem;
  color: #553d2d;
  outline: none;
}

.input-field::placeholder {
  color: #7c6c54;
  opacity: 1;
}

.input-field.full {
  grid-column: span 2;
}

.upload-area {
  height: 180px;
  border: 2px solid #7c6c54;
  background: transparent;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  cursor: pointer;
  overflow: hidden;
}

.diploma-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diploma-placeholder {
  text-align: center;
  color: #7c6c54;
}

.plus-icon {
  font-size: 45px;
  line-height: 1;
  color: #9c8c74;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.btn {
  border: none;
  padding: 12px 55px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-save,
.btn-cancel {
  background: #596b42;
  color: #f1edd2;
  transition: all 0.2s ease;
}

.btn-save:hover,
.btn-cancel:hover {
  background-color: #485635;
}
</style>