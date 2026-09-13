<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { profissionais } from "@/data/profissionais"
import { useAuth } from "@/composables/useAuth"

const route = useRoute()
const router = useRouter()
const { usuarioLogado, isProfissional, carregarUsuario, login } = useAuth()

const targetId = route.params.id
const profissional = ref(null)

const nome = ref("")
const email = ref("")
const telefone = ref("")
const dataNascimento = ref("")
const formacoes = ref([])
const especializacoes = ref([])

const modalAberto = ref(null)
const novoTipo = ref("")
const novoNome = ref("")

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
    return
  }

  nome.value = profissional.value.nome || ""
  email.value = profissional.value.email || ""
  telefone.value = profissional.value.telefone || ""
  dataNascimento.value = profissional.value.dataNascimento || ""
  formacoes.value = profissional.value.formacoes
    ? JSON.parse(JSON.stringify(profissional.value.formacoes))
    : []
  especializacoes.value = profissional.value.especializacoes
    ? JSON.parse(JSON.stringify(profissional.value.especializacoes))
    : []
})

function abrirModal(tipo) {
  modalAberto.value = tipo
  novoTipo.value = ""
  novoNome.value = ""
}

function fecharModal() {
  modalAberto.value = null
}

function adicionarItem() {
  if (!novoTipo.value.trim() || !novoNome.value.trim()) return

  if (modalAberto.value === 'formacoes') {
    formacoes.value.push({ tipo: novoTipo.value, nome: novoNome.value })
  } else if (modalAberto.value === 'especializacoes') {
    especializacoes.value.push({ tipo: novoTipo.value, nome: novoNome.value })
  }

  novoTipo.value = ""
  novoNome.value = ""
}

function removerItem(lista, index) {
  if (lista === 'formacoes') {
    formacoes.value.splice(index, 1)
  } else if (lista === 'especializacoes') {
    especializacoes.value.splice(index, 1)
  }
}

function salvar() {
  if (!profissional.value) return

  const dadosAtualizados = {
    ...profissional.value,
    nome: nome.value,
    email: email.value,
    telefone: telefone.value,
    dataNascimento: dataNascimento.value,
    formacoes: formacoes.value,
    especializacoes: especializacoes.value,
  }

  const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]')
  const idx = cadastros.findIndex((c) => String(c.id) === String(dadosAtualizados.id))
  if (idx !== -1) {
    cadastros[idx] = dadosAtualizados
    localStorage.setItem('cadastros', JSON.stringify(cadastros))
  }

  login(dadosAtualizados)

  router.push(`/profissional/${dadosAtualizados.id}`)
}

function cancelar() {
  router.push(profissional.value ? `/profissional/${profissional.value.id}` : '/profissionais')
}

function alterarFoto(event) {
  const arquivo = event.target.files[0]
  if (arquivo && profissional.value) {
    const reader = new FileReader()
    reader.onloadend = () => {
      profissional.value.foto = reader.result
    }
    reader.readAsDataURL(arquivo)
  }
}
</script>