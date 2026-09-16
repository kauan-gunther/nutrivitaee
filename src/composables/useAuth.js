import { ref, computed } from 'vue'

const usuarioLogado = ref(null)

export function useAuth() {
  function carregarUsuario() {
    try {
      const salvo = localStorage.getItem('usuarioLogado')

      if (!salvo || salvo === 'null' || salvo === 'undefined') {
        usuarioLogado.value = null
        return
      }

      const dados = JSON.parse(salvo)
      const valido = !!dados && typeof dados === 'object' && (
        dados.email ||
        dados.id ||
        dados.nome ||
        dados.tipo ||
        dados._id
      )

      usuarioLogado.value = valido ? dados : null

      if (!valido) {
        localStorage.removeItem('usuarioLogado')
      }
    } catch {
      usuarioLogado.value = null
      localStorage.removeItem('usuarioLogado')
    }
  }

  function login(dadosUsuario) {
    if (!dadosUsuario || typeof dadosUsuario !== 'object') {
      usuarioLogado.value = null
      return
    }

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