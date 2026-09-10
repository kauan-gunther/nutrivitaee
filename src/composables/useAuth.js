import { ref, computed } from 'vue'

const usuarioLogado = ref(null)

export function useAuth() {
  function carregarUsuario() {
    const salvo = localStorage.getItem('usuarioLogado')
    if (salvo) {
      usuarioLogado.value = JSON.parse(salvo)
    }
  }

  function login(dadosUsuario) {
    usuarioLogado.value = dadosUsuario
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario))
  }

  function logout() {
    usuarioLogado.value = null
    localStorage.removeItem('usuarioLogado')
  }

  const isPaciente = computed(() => usuarioLogado.value?.tipo === 'paciente')
  const isProfissional = computed(() => usuarioLogado.value?.tipo === 'profissional')
  const isAdmin = computed(() => usuarioLogado.value?.tag === 'admin')

  return {
    usuarioLogado,
    isPaciente,
    isProfissional,
    isAdmin,
    carregarUsuario,
    login,
    logout
  }
}