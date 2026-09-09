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
        </div>
        <h1 class="user-name">{{ usuario.nome }}</h1>
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
          <h3 class="card-title">Preferencias</h3>
          <hr class="card-divider" />

          <p class="section-subtitle">gosto:</p>
          <ul>
            <li v-if="!usuario.preferencias?.gosto?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.preferencias?.gosto" :key="i">• {{ item }}</li>
          </ul>

          <p class="section-subtitle mt-2">Não gosta</p>
          <ul>
            <li v-if="!usuario.preferencias?.naoGosto?.length">• Não registrado</li>
            <li v-for="(item, i) in usuario.preferencias?.naoGosto" :key="i">• {{ item }}</li>
          </ul>
        </div>

        <div class="card-box light-card">
          <h3 class="card-title">Alergias</h3>
          <hr class="card-divider" />
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
  preferencias: { gosto: [], naoGosto: [] },
  alergias: [],
})

onMounted(() => {
  const dadosSalvos = localStorage.getItem('usuarioLogado')
  if (dadosSalvos) {
    Object.assign(usuario, JSON.parse(dadosSalvos))
  }
})

const salvarAlteracoes = (novosDados) => {
  Object.assign(usuario, novosDados)
  localStorage.setItem('usuarioLogado', JSON.stringify(novosDados))
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

.user-name {
  font-family: 'Italiana', serif, sans-serif;
  font-size: 3rem;
  font-weight: 400;
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
  font-family: 'Italiana', serif, sans-serif;
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
