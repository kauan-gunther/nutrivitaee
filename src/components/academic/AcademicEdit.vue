<script setup>
import { ref } from 'vue'

const props = defineProps({
    dadosIniciais: Object
})

const emit = defineEmits(['salvar', 'cancelar'])

const form = ref({ ...props.dadosIniciais })

function escolherFotoPerfil(event) {
    const arquivo = event.target.files[0]
    if (arquivo) {
        const leitor = new FileReader()
        leitor.onload = (e) => { form.value.fotoPerfil = e.target.result }
        leitor.readAsDataURL(arquivo)
    }
}

function escolherFotoDiploma(event) {
    const arquivo = event.target.files[0]
    if (arquivo) {
        const leitor = new FileReader()
        leitor.onload = (e) => { form.value.diplomaFoto = e.target.result }
        leitor.readAsDataURL(arquivo)
    }
}

function enviarEdicao() {
    emit('salvar', form.value)
}
</script>

<template>
    <div class="card-box">
        <h1 class="page-title">Edição de formação académica</h1>

        <form @submit.prevent="enviarEdicao">
            <div class="perfil-upload-container" @click="$refs.inputPerfilEdit.click()">
                <input type="file" ref="inputPerfilEdit" accept="image/*" hidden @change="escolherFotoPerfil" />
                <img v-if="form.fotoPerfil" :src="form.fotoPerfil" class="perfil-preview" alt="Foto Perfil" />
                <div v-else class="perfil-placeholder">
                    <span>Foto Perfil</span>
                </div>
            </div>

            <div class="form-grid">
                <input v-model="form.nome" type="text" placeholder="Nome:" class="input-field full" required />
                <input v-model="form.curso" type="text" placeholder="Curso:" class="input-field full" required />
                <input v-model="form.instituicao" type="text" placeholder="Nome da Instituição:"
                    class="input-field full" required />
                <input v-model="form.registro" type="text" placeholder="Número do Diploma/Registro:" class="input-field"
                    required />
                <input v-model="form.grau" type="text" placeholder="Grau Académico:" class="input-field" required />
            </div>

            <div class="diploma-preview-container" @click="$refs.inputDiplomaEdit.click()">
                <input type="file" ref="inputDiplomaEdit" accept="image/*" hidden @change="escolherFotoDiploma" />
                <div class="diploma-frame">
                    <img v-if="form.diplomaFoto" :src="form.diplomaFoto" alt="Diploma" class="diploma-img" />
                    <div v-else class="diploma-placeholder">
                        <span class="diploma-tag">Clique para alterar foto do diploma</span>
                    </div>
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
    color: #3a2b1f;
    margin-bottom: 20px;
    font-weight: normal;
}

.perfil-upload-container {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #dcd0bc;
    margin: 0 auto 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    border: 3px solid #8c9c6d;
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
    color: #6b5c4f;
    font-size: 0.8rem;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
}

.input-field {
    background: #dcd0bc;
    border: none;
    padding: 14px 20px;
    border-radius: 15px;
    font-size: 1rem;
    color: #3a2b1f;
    outline: none;
}

.input-field.full {
    grid-column: span 2;
}

.diploma-preview-container {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
    cursor: pointer;
}

.diploma-frame {
    width: 260px;
    height: 180px;
    background: #fff;
    border: 4px solid #c8b896;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.diploma-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.diploma-placeholder {
    text-align: center;
    padding: 10px;
    color: #bca88b;
    font-size: 12px;
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
}

.btn-save {
    background: #8c9c6d;
    color: #3a2b1f;
}

.btn-cancel {
    background: #8c9c6d;
    color: #3a2b1f;
}
</style>