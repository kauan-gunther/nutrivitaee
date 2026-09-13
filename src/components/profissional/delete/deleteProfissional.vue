<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profissionais } from '@/data/profissionais'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario, logout } = useAuth()

const targetId = route.params.id
const profissional = ref(null)

const confirmar = ref(false)
const senhaConfirmacao = ref('')
const erroSenha = ref('')

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
  }
})

function abrirConfirmacao() {
  confirmar.value = true
}

function fecharConfirmacao() {
  confirmar.value = false
  senhaConfirmacao.value = ''
  erroSenha.value = ''
}

function cancelar() {
  router.push(`/profissional/${profissional.value.id}`)
}

function excluir() {
  if (senhaConfirmacao.value !== profissional.value.senha) {
    erroSenha.value = 'Senha incorreta.'
    return
  }

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const cadastrosAtualizados = cadastros.filter(
    (c) => String(c.id) !== String(profissional.value.id),
  )
  localStorage.setItem('cadastros', JSON.stringify(cadastrosAtualizados))

  logout()
  router.push('/')
}
</script>

<template>
  <main v-if="profissional" class="excluir-container">
    <div class="conteudo-principal">
      <h1>Deletar Perfil do Profissional</h1>

      <div class="perfil-campos">
        <!-- Linha da Foto + Nome -->
        <div class="linha-foto-nome">
          <div class="foto-wrapper">
            <img :src="profissional.foto" :alt="profissional.nome" />
            <span class="icon-lixeira-foto"><i class="mdi mdi-delete-outline"></i></span>
          </div>
          <div class="campo campo-flex">
            <span class="label">Nome:</span>
            <span class="valor">{{ profissional.nome }}</span>
            <i class="mdi mdi-delete-outline icon-lixeira"></i>
          </div>
        </div>

        <!-- Campo Email -->
        <div class="campo">
          <span class="label">Email:</span>
          <span class="valor">{{ profissional.email }}</span>
          <i class="mdi mdi-delete-outline icon-lixeira"></i>
        </div>

        <!-- Campo Telefone -->
        <div class="campo">
          <span class="label">Telefone:</span>
          <span class="valor">{{ profissional.telefone }}</span>
          <i class="mdi mdi-delete-outline icon-lixeira"></i>
        </div>

        <!-- Cards de Formações e Especializações -->
        <div class="grid-listas">
          <div class="card-lista">
            <div class="card-header">
              <h2>Formação Acadêmica</h2>
              <i class="mdi mdi-delete-outline icon-lixeira"></i>
            </div>
            <ul>
              <li v-for="formacao in profissional.formacoes" :key="formacao.nome">
                <span class="bullet">•</span>
                <strong>{{ formacao.tipo }}:</strong>
                <span class="texto-item">{{ formacao.nome }}</span>
              </li>
            </ul>
          </div>

          <div class="card-lista">
            <div class="card-header">
              <h2>Formação Acadêmica</h2>
              <i class="mdi mdi-delete-outline icon-lixeira"></i>
            </div>
            <ul>
              <li v-for="especializacao in profissional.especializacoes" :key="especializacao.nome">
                <span class="bullet">•</span>
                <strong>{{ especializacao.tipo }}:</strong>
                <span class="texto-item">{{ especializacao.nome }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Botões Principais -->
        <div class="acoes-principais">
          <button type="button" class="btn-excluir" @click="abrirConfirmacao">
            Excluir Perfil
          </button>
          <button type="button" class="btn-cancelar" @click="cancelar">Cancelar a Exclusão</button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação com Senha -->
    <div v-if="confirmar" class="modal-overlay" @click.self="fecharConfirmacao">
      <div class="modal-card">
        <i class="mdi mdi-delete-outline modal-icon"></i>
        <h2>Excluir Perfil</h2>

        <div class="input-senha-wrapper">
          <input
            v-model="senhaConfirmacao"
            type="password"
            placeholder="Digite sua senha para confirmar exclusão:"
          />
          <p v-if="erroSenha" class="erro-senha">{{ erroSenha }}</p>
        </div>

        <div class="modal-acoes">
          <button type="button" class="btn-modal-cancelar" @click="fecharConfirmacao">
            Cancelar
          </button>
          <button
            type="button"
            class="btn-modal-confirmar"
            :disabled="!senhaConfirmacao.trim()"
            @click="excluir"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </main>

  <main v-else class="naoEncontrado">
    <h2>Profissional não encontrado.</h2>
    <button type="button" class="btn-voltar" @click="router.push('/profissionais')">
      <i class="mdi mdi-account-group"></i> Voltar para profissionais
    </button>
  </main>
</template>

<style scoped>
.excluir-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f1ebd9;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: inherit;
}

.erro-senha {
  color: #a13d3d;
  font-size: 0.85rem;
  margin-top: 8px;
}

.conteudo-principal {
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-family: 'Italiana', serif, sans-serif;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #705335;
  font-weight: 400;
  margin-bottom: 35px;
  text-align: center;
}

.perfil-campos {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Linha da Foto + Campo Nome */
.linha-foto-nome {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.foto-wrapper {
  position: relative;
  flex-shrink: 0;
}

.foto-wrapper img {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.icon-lixeira-foto {
  position: absolute;
  bottom: -2px;
  left: -2px;
  background: #2b2b2b;
  color: #ffffff;
  border-radius: 6px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

/* Estilo padrão dos inputs simulados */
.campo {
  width: 100%;
  padding: 12px 18px;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  background-color: rgba(235, 226, 204, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.campo-flex {
  flex: 1;
}

.label {
  font-size: 1.1rem;
  color: #4a5435;
  font-weight: 500;
}

.valor {
  flex: 1;
  font-size: 1.1rem;
  color: #555555;
  margin-left: 10px;
}

.icon-lixeira {
  font-size: 1.2rem;
  color: #2b2b2b;
  cursor: pointer;
}

/* Grid de Formações / Especializações */
.grid-listas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 6px;
}

.card-lista {
  border: 1.5px solid #8c7355;
  border-radius: 16px;
  padding: 18px 20px;
  background-color: rgba(235, 226, 204, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-header h2 {
  font-size: 1.35rem;
  color: #4a5435;
  font-weight: 500;
  margin: 0;
}

.card-lista ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-lista li {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 0.95rem;
  color: #333333;
}

.bullet {
  font-size: 1.1rem;
  color: #333333;
}

.texto-item {
  color: #555555;
}

/* Botões da Tela Principal */
.acoes-principais {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 25px;
}

.btn-excluir,
.btn-cancelar {
  min-width: 220px;
  padding: 12px 28px;
  border: none;
  border-radius: 50px;
  background-color: #536236;
  color: #f1ebd9;
  font-size: 1.15rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.btn-excluir:hover,
.btn-cancelar:hover {
  background-color: #43502a;
  transform: translateY(-2px);
}

/* Estilização do Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background: #f1ebd9;
  border: 1.5px solid #8c7355;
  border-radius: 24px;
  padding: 30px 35px;
  width: 90%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.modal-icon {
  font-size: 2.8rem;
  color: #2b2b2b;
  margin-bottom: -5px;
}

.modal-card h2 {
  font-family: 'Italiana', serif, sans-serif;
  font-size: 2.4rem;
  color: #111111;
  font-weight: 400;
  margin: 10px 0 20px 0;
}

.input-senha-wrapper {
  width: 100%;
  margin-bottom: 25px;
}

.input-senha-wrapper input {
  width: 100%;
  padding: 14px 18px;
  border: 1.5px solid #536236;
  border-radius: 30px;
  background-color: transparent;
  color: #4a5435;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.input-senha-wrapper input::placeholder {
  color: #536236;
  font-weight: 600;
  opacity: 0.85;
}

.modal-acoes {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.btn-modal-cancelar,
.btn-modal-confirmar {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  background-color: #536236;
  color: #f1ebd9;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.btn-modal-cancelar:hover,
.btn-modal-confirmar:hover:not(:disabled) {
  background-color: #43502a;
}

.btn-modal-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsividade */
@media (max-width: 768px) {
  .linha-foto-nome {
    flex-direction: column;
  }

  .grid-listas {
    grid-template-columns: 1fr;
  }

  .acoes-principais {
    flex-direction: column;
    gap: 12px;
  }

  .btn-excluir,
  .btn-cancelar {
    width: 100%;
  }
}

/* Não Encontrado */
.naoEncontrado {
  min-height: 100vh;
  background-color: #f1ebd9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.naoEncontrado h2 {
  font-size: 1.8rem;
  color: #705335;
}

.btn-voltar {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #536236;
  color: #f1ebd9;
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
</style>
