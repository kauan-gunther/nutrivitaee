// Funções de máscara e validação usadas nos formulários de paciente.
// Ficam num arquivo separado para o cadastro e a edição usarem o mesmo código.

// Remove tudo que não for número: "123.456-78" vira "12345678"
export const somenteNumeros = (valor) => String(valor ?? '').replace(/\D/g, '')

// 12345678901 -> 123.456.789-01 (vai formatando enquanto a pessoa digita)
export function mascaraCpf(valor) {
  const n = somenteNumeros(valor).slice(0, 11)
  if (n.length <= 3) return n
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`
}

// 47991234567 -> (47) 99123-4567   |   4733334444 -> (47) 3333-4444
export function mascaraTelefone(valor) {
  const n = somenteNumeros(valor).slice(0, 11)
  if (n.length <= 2) return n
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
}

// 89201001 -> 89201-001
export function mascaraCep(valor) {
  const n = somenteNumeros(valor).slice(0, 8)
  return n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n
}

// Confere os dois dígitos verificadores do CPF (não basta ter 11 números)
export function cpfValido(valor) {
  const cpf = somenteNumeros(valor)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const digito = (quantidade) => {
    let soma = 0
    for (let i = 0; i < quantidade; i++) {
      soma += Number(cpf[i]) * (quantidade + 1 - i)
    }
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10])
}

export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? '').trim())

// A data não pode estar vazia nem ser no futuro
export const dataNascimentoValida = (data) =>
  Boolean(data) && new Date(`${data}T00:00:00`) <= new Date()

