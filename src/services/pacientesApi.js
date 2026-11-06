// Tudo que "conversa" com a API de pacientes (json-server) fica neste arquivo.
// As telas só chamam estas funções, assim a URL e o jeito de fazer o fetch
// ficam num lugar só, e a próxima entidade (profissional) pode copiar o modelo.

const API_URL = 'http://localhost:3000'
const API_CEP = 'https://viacep.com.br/ws'

// Faz o fetch, confere se deu certo (resposta.ok) e devolve o JSON.
// Se algo der errado, "joga" um Error com uma mensagem amigável.
// Quem chamar usa try/catch e mostra a mensagem na tela.
async function requisicao(url, opcoes) {
  let resposta

  try {
    resposta = await fetch(url, opcoes)
  } catch {
    // O fetch só cai aqui quando nem chegou a falar com o servidor
    // (API desligada, sem internet...).
    throw new Error(
      'Não foi possível conectar à API. Verifique se ela está rodando (npm run api).',
    )
  }

  if (!resposta.ok) {
    if (resposta.status === 404) throw new Error('Registro não encontrado.')
    throw new Error(`Erro ${resposta.status} ao falar com a API.`)
  }

  return resposta.json()
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

// GET /pacientes  -> lista todos os pacientes
export function listarPacientes() {
  return requisicao(`${API_URL}/pacientes`)
}

// GET /pacientes?email=x&cpf=y  -> lista só os que combinam com o filtro
export function buscarPacientes(filtros = {}) {
  const parametros = new URLSearchParams(filtros).toString()
  return requisicao(`${API_URL}/pacientes?${parametros}`)
}

// GET /pacientes/5  -> um paciente pelo id
export function buscarPacientePorId(id) {
  return requisicao(`${API_URL}/pacientes/${id}`)
}

// POST /pacientes  -> cadastra (a API cria o id sozinha e devolve o paciente salvo)
export function criarPaciente(dados) {
  return requisicao(`${API_URL}/pacientes`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(dados),
  })
}

// PATCH /pacientes/5  -> atualiza só os campos enviados (os outros continuam iguais)
export function atualizarPaciente(id, dados) {
  return requisicao(`${API_URL}/pacientes/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(dados),
  })
}

// DELETE /pacientes/5  -> exclui
export function excluirPaciente(id) {
  return requisicao(`${API_URL}/pacientes/${id}`, { method: 'DELETE' })
}

// ViaCEP: recebe o CEP e devolve rua, bairro, cidade e estado
export async function buscarCep(cep) {
  const numeros = String(cep).replace(/\D/g, '')
  if (numeros.length !== 8) throw new Error('O CEP precisa ter 8 números.')

  let resposta
  try {
    resposta = await fetch(`${API_CEP}/${numeros}/json/`)
  } catch {
    throw new Error('Não foi possível consultar o CEP. Verifique sua conexão.')
  }

  const dados = await resposta.json()
  if (dados.erro) throw new Error('CEP não encontrado.')

  return {
    rua: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    estado: dados.uf,
  }
}
