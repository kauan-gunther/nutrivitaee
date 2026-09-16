<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const ehAdministrador = route.query.admin === 'true'

const perfil = ref({
  buscar: {
    chamado: '',
    status: '',
    solicitante: '',
    prioridade: '',
    categoria: '',
    historico: [],
    descricao: '',
  },
})

function formatarDataHora(data) {
  const d = new Date(data)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  const id = route.params.id
  const suportes = JSON.parse(localStorage.getItem('suportes') || '[]')
  const suporteSelecionado = suportes.find((item) => item.id === id)

  if (suporteSelecionado) {
    const historico = []

    // Evento inicial: Chamado criado
    historico.push({
      evento: 'Chamado criado',
      timestamp: suporteSelecionado.data || new Date().toISOString(),
    })

    // Se estiver resolvido, adicionar os eventos
    if (suporteSelecionado.status === 'resolvido') {
      historico.push({
        evento: 'Técnico assumiu',
        timestamp: suporteSelecionado.dataResolucao || new Date().toISOString(),
      })

      historico.push({
        evento: 'Problema resolvido',
        timestamp: suporteSelecionado.dataResolucao || new Date().toISOString(),
      })

      historico.push({
        evento: 'Mensagem de retorno enviada ao usuário',
        timestamp: suporteSelecionado.dataResolucao || new Date().toISOString(),
      })
    }

    perfil.value.buscar = {
      chamado: suporteSelecionado.id || '',
      status: suporteSelecionado.status || 'em-andamento',
      solicitante: suporteSelecionado.usuario?.nome || '',
      prioridade: suporteSelecionado.prioridade || 'Média',
      categoria: suporteSelecionado.usuario?.categoria || '',
      historico: historico,
      descricao: suporteSelecionado.usuario?.descrever || suporteSelecionado.assunto || '',
    }
  }
})

function irParaCadastro() {
  router.push('/CadastroSuporte')
}

function voltar() {
  router.push(ehAdministrador ? { path: '/buscar-suporte', query: { admin: 'true' } } : '/')
}
</script>

<template>
  <div class="container-perfil">
    <div class="header-perfil">
      <h1>Perfil do suporte</h1>
    </div>

    <div class="conteudo-perfil">
      <!-- Primeira linha: ID e Status -->
      <div class="grid-campos">
        <div class="campo-caixa">
          <label>Id: </label>
          <div class="valor">{{ perfil.buscar.chamado }}</div>
        </div>
        <div class="campo-caixa">
          <label>Status: </label>
          <div class="valor" :class="{ resolvido: perfil.buscar.status === 'resolvido' }">
            {{ perfil.buscar.status === 'resolvido' ? 'Resolvido' : 'Em análise' }}
          </div>
        </div>
      </div>

      <!-- Segunda linha: Solicitante e Prioridade -->
      <div class="grid-campos">
        <div class="campo-caixa">
          <label>Solicitante: </label>
          <div class="valor">{{ perfil.buscar.solicitante }}</div>
        </div>
        <div class="campo-caixa">
          <label>Prioridade: </label>
          <div class="valor">{{ perfil.buscar.prioridade }}</div>
        </div>
      </div>

      <!-- Categoria completa -->
      <div class="campo-caixa full-width">
        <label>Categoria do suporte: </label>
        <div class="valor">{{ perfil.buscar.categoria }}</div>
      </div>

      <!-- Linha com Histórico e Descrição -->
      <div class="grid-campos-grande">
        <div class="campo-caixa">
          <label>Histórico:</label>
          <div class="valor-multiplo">
            <div
              v-for="(evento, index) in perfil.buscar.historico"
              :key="index"
              class="evento-historico"
            >
              <strong>{{ evento.evento }}</strong>
              <br />
              {{ formatarDataHora(evento.timestamp) }}
            </div>
          </div>
        </div>
        <div class="campo-caixa">
          <label>Descrição:</label>
          <div class="valor-multiplo">{{ perfil.buscar.descricao }}</div>
        </div>
      </div>

      <div class="botoes-acao" :class="{ 'apenas-voltar': ehAdministrador }">
        <button v-if="!ehAdministrador" class="btn-confirmar" @click="irParaCadastro">
          Novo suporte
        </button>
        <button class="btn-cancelar" @click="voltar">Voltar</button>
      </div>
    </div>
  </div>
</template>


<style scoped></style>
