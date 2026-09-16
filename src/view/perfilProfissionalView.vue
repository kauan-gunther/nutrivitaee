<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profissionais } from '@/data/profissionais'
import { useAuth } from '@/composables/useAuth'
import AcademicCreate from '@/components/academic/AcademicCreate.vue'

const props = defineProps({
  idProp: {
    type: [String, Number],
    default: null,
  },
})

const route = useRoute()
const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario, login, logout } = useAuth()

onMounted(() => {
  carregarUsuario()
})

const exibirModalAcademic = ref(false)

const profissional = computed(() => {
  const targetId = props.idProp || route.params.id
  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')

  const listaCompleta = [...profissionais, ...cadastros]
  return listaCompleta.find((item) => String(item.id) === String(targetId))
})

const souDono = computed(
  () =>
    !!profissional.value &&
    isProfissional.value &&
    String(usuarioLogado.value?.id) === String(profissional.value.id),
)

function salvarFormacao(novaFormacao) {
  if (!profissional.value) return

  if (!profissional.value.formacoes) {
    profissional.value.formacoes = []
  }

  profissional.value.formacoes.push({
    tipo: novaFormacao.grau || 'Formação',
    nome: `${novaFormacao.curso} - ${novaFormacao.instituicao}`,
    diplomaFoto: novaFormacao.diplomaFoto,
  })

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const idx = cadastros.findIndex((c) => String(c.id) === String(profissional.value.id))
  if (idx !== -1) {
    cadastros[idx] = profissional.value
    localStorage.setItem('cadastros', JSON.stringify(cadastros))
  }

  if (souDono.value) {
    login(profissional.value)
  }

  exibirModalAcademic.value = false
}

function sair() {
  logout()
  router.push('/login')
}
</script>

<template>
  <main v-if="profissional" class="perfil-container">
    <!-- Topo unificado: Botões de controle de Ações + Título -->
    <div class="acoes-topo">
      <div class="acoes-esquerda">
        <RouterLink v-if="souDono" :to="`/profissional/${profissional.id}/edit`" class="btn-acao-topo" title="Editar Perfil">
          <i class="mdi mdi-pencil-outline"></i> Editar
        </RouterLink>
      </div>

      <div class="acoes-direita">
        <RouterLink v-if="souDono" :to="`/profissional/${profissional.id}/delete`" class="btn-acao-topo btn-deletar-topo" title="Excluir Perfil">
          <i class="mdi mdi-delete-outline"></i> Excluir
        </RouterLink>
        <button v-if="souDono" class="btn-sair" @click="sair">
          <i class="mdi mdi-logout"></i> Sair
        </button>
      </div>
    </div>

    <h1>Perfil do Profissional</h1>

    <div class="perfil-conteudo">
      <div class="dados-pessoais">
        <div class="linha-nome">
          <img
            :src="profissional.foto || 'https://via.placeholder.com/150'"
            :alt="profissional.nome"
            class="foto-perfil"
          />
          <div class="campo-dado flex-grow">
            <span class="label">Nome:</span>
            <span class="valor">{{ profissional.nome }}</span>
          </div>
        </div>

        <div class="campo-dado">
          <span class="label">Email:</span>
          <span class="valor">{{ profissional.email }}</span>
        </div>

        <div class="campo-dado">
          <span class="label">Telefone:</span>
          <span class="valor">{{ profissional.telefone }}</span>
        </div>
      </div>

      <div class="cards-informacoes">
        <!-- Box Formação Acadêmica -->
        <div class="card-info">
          <div class="card-header">
            <h2>Formação Acadêmica</h2>
            <button v-if="souDono" class="btn-definir" @click="exibirModalAcademic = true">Definir</button>
          </div>
          <ul>
            <li v-if="!profissional.formacoes?.length" class="sem-registro">• Não registrada</li>
            <li
              v-for="(formacao, index) in profissional.formacoes"
              :key="index"
              class="item-formacao"
            >
              <div class="texto-formacao">
                <span class="bullet">•</span>
                <span class="tipo">{{ formacao.tipo }}:</span>
                <span class="nome">{{ formacao.nome }}</span>
              </div>
              <img
                v-if="formacao.diplomaFoto"
                :src="formacao.diplomaFoto"
                alt="Diploma"
                class="foto-diploma-preview"
              />
            </li>
          </ul>
        </div>

        <!-- Box Especializações -->
        <div class="card-info">
          <h2>Especializações</h2>
          <ul>
            <li v-if="!profissional.especializacoes?.length" class="sem-registro">
              • Não registrada
            </li>
            <li v-for="(especializacao, index) in profissional.especializacoes" :key="index">
              <span class="bullet">•</span>
              <span class="tipo">{{ especializacao.tipo }}:</span>
              <span class="nome">{{ especializacao.nome }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal do Formulário AcademicCreate -->
    <div v-if="exibirModalAcademic" class="modal-overlay">
      <div class="modal-card">
        <AcademicCreate @salvar="salvarFormacao" @cancelar="exibirModalAcademic = false" />
      </div>
    </div>
  </main>

  <main v-else class="naoEncontrado">
    <h2>Profissional não encontrado.</h2>
    <RouterLink to="/" class="btn-voltar">
      <i class="mdi mdi-home-circle"></i> Voltar à Página Inicial
    </RouterLink>
  </main>
</template>

<style scoped>
.perfil-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #efe8d3;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.acoes-topo {
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.acoes-esquerda,
.acoes-direita {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-sair,
.btn-acao-topo {
  background-color: #536236;
  border: 1.5px solid #536236;
  color: #efe8d3;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-sair:hover,
.btn-acao-topo:hover {
  background-color: #414e2a;
  border-color: #414e2a;
  color: #f1edd2;
}

.btn-deletar-topo {
  background-color: transparent;
  color: #536236;
  border-color: #536236;
}

.btn-deletar-topo:hover {
  background-color: #536236;
  color: #efe8d3;
}

h1 {
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  color: #536236;
  font-weight: 400;
  margin-bottom: 30px;
  text-align: center;
}

.perfil-conteudo {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dados-pessoais {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.linha-nome {
  display: flex;
  align-items: center;
  gap: 24px;
}

.foto-perfil {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #8c7355;
}

.campo-dado {
  width: 100%;
  padding: 16px 24px;
  border: 1.5px solid #8c7355;
  border-radius: 18px;
  background-color: rgba(239, 232, 211, 0.6);
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

.flex-grow {
  flex: 1;
}

.campo-dado .label {
  font-size: 1.25rem;
  color: #536236;
  min-width: 80px;
  font-weight: bold;
}

.campo-dado .valor {
  font-size: 1.25rem;
  color: #333f34;
}

.cards-informacoes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 10px;
}

.card-info {
  border: 1.5px solid #8c7355;
  border-radius: 20px;
  padding: 28px;
  background-color: rgba(239, 232, 211, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-info h2 {
  font-size: 1.8rem;
  color: #536236;
  font-weight: 400;
  margin: 0;
}

.btn-definir {
  background-color: #536236;
  border: 2px solid #536236;
  color: #efe8d3;
  border-radius: 20px;
  padding: 6px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-definir:hover {
  background-color: #414e2a;
}

.card-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-formacao {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.texto-formacao {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 1.1rem;
  color: #333f34;
}

.foto-diploma-preview {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #8c7355;
  margin-top: 4px;
}

.sem-registro {
  font-style: italic;
  color: #8c7355;
}

.card-info .bullet {
  color: #333f34;
  font-size: 1.2rem;
}

.card-info .tipo {
  font-weight: 600;
  color: #333f34;
}

.card-info .nome {
  color: #536236;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  background-color: #efe8d3;
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 750px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.naoEncontrado {
  min-height: 100vh;
  background-color: #efe8d3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  text-align: center;
}

.naoEncontrado h2 {
  font-size: 2.2rem;
  color: #536236;
  font-weight: 400;
}

.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #536236;
  color: #efe8d3;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(83, 98, 54, 0.2);
}

.btn-voltar:hover {
  background-color: #414e2a;
  transform: translateY(-2px);
}

@media (max-width: 850px) {
  .perfil-container {
    padding: 20px 15px;
  }

  .cards-informacoes {
    grid-template-columns: 1fr;
  }

  .linha-nome {
    flex-direction: column;
    text-align: center;
  }

  .campo-dado {
    flex-direction: column;
    gap: 5px;
    text-align: center;
    padding: 12px 16px;
  }

  .campo-dado .label {
    min-width: auto;
  }

  .acoes-topo {
    flex-direction: column;
    align-items: stretch;
  }

  .acoes-esquerda,
  .acoes-direita {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>