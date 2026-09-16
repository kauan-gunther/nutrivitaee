<script setup>
import { ref } from 'vue'
import router from '@/router'

const cadastro = ref({
  usuario: {
    nome: '',
    email: '',
    assunto: '',
    categoria: '', //'Mobilidade no site', 'Erro no upload de documento', 'Perfil do profissional não aparece nos resultados', 'Filtro não funciona', 'Resultados exibindo médicos inativos ou suspensos',  'Choque de horário',  'Falha no envio do link da teleconsulta'.
    descrever: '',
    anexar: '',
    foto: null,
  },
})
const alerta = ref('')

function converterParaBase64(arquivo, callback) {
  const reader = new FileReader()
  reader.onloadend = () => callback(reader.result)
  reader.readAsDataURL(arquivo)
}

function aoSelecionarFotoProblema(event) {
  const arquivo = event.target.files[0]
  if (arquivo) {
    converterParaBase64(arquivo, (base64) => {
      cadastro.value.usuario.foto = base64
    })
  }
}

function prioridadePorCategoria(categoria) {
  const prioridades = {
    documentoErro: 'dificil',
    resultadoErro: 'dificil',
    linkErro: 'dificil',
    perfilErro: 'media',
    horarioErro: 'media',
    choqueHorario: 'media',
    mobilidadeErro: 'baixa',
    filtroErro: 'baixa',
  }

  return prioridades[categoria] || 'baixa'
}

function gerarIdSuporte(suportes) {
  let id

  do {
    const quantidadeDigitos = (crypto.getRandomValues(new Uint32Array(1))[0] % 8) + 2
    const menorValor = 10 ** (quantidadeDigitos - 1)
    const intervalo = 10 ** quantidadeDigitos - menorValor
    const valorAleatorio = crypto.getRandomValues(new Uint32Array(1))[0] % intervalo

    id = String(menorValor + valorAleatorio)
  } while (suportes.some((suporte) => String(suporte.id) === id))

  return id
}

function validarFormulario() {
  const { usuario } = cadastro.value

  if (
    !usuario.nome.trim() ||
    !usuario.email.trim() ||
    !usuario.assunto.trim() ||
    !usuario.categoria.trim()
  ) {
    alerta.value = 'Preencha nome, email, assunto e categoria.'
    return false
  }

  const emailValido = /^[^\s@]+@[^\s@]+$/.test(usuario.email.trim())

  if (!emailValido) {
    alerta.value = 'Informe um email válido.'
    return false
  }

  const suportes = JSON.parse(localStorage.getItem('suportes') || '[]')
  const idSuporte = gerarIdSuporte(suportes)
  suportes.push({
    id: idSuporte,
    usuario: { ...usuario },
    data: new Date().toISOString().slice(0, 10),
    status: 'em-andamento',
    prioridade: prioridadePorCategoria(usuario.categoria),
  })
  localStorage.setItem('suportes', JSON.stringify(suportes))
  router.push(`/perfilSuporte/${idSuporte}`)
  return true
}

function cancelar() {
  router.push('/')
}

function fecharAlerta() {
  alerta.value = ''
}
</script>

<template>
  <div class="principal container-formulario grade-formulario">
    <h1>Cadastro de suporte</h1>

    <div class="nome cartao-entrada">
      <label for="nome">Nome:</label>
      <input type="text" id="nome" v-model="cadastro.usuario.nome" />
    </div>

    <div class="email cartao-entrada">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="cadastro.usuario.email"
        placeholder="exemplo@email.com"
      />
    </div>

    <div class="assunto cartao-entrada">
      <label for="assunto">Assunto:</label>
      <input type="text" id="assunto" v-model="cadastro.usuario.assunto" />
    </div>

    <div class="categoria cartao-entrada">
      <label for="categoria">Categoria:</label>

      <select id="categoria" v-model="cadastro.usuario.categoria">
        <option value="" disabled>Categoria do problema</option>
        <option value="documentoErro">Erro upload do documento</option>
        <option value="resultadoErro">Resultado do Médico inativo</option>
        <option value="horarioErro">Choque de horário</option>
        <option value="mobilidadeErro">Mobilidade no site</option>
        <option value="filtroErro">Filtro não funciona</option>
        <option value="choqueHorario">Choque de horário</option>
        <option value="linkErro">Falha teleconsulta</option>
      </select>
    </div>

    <div class="anexar-imagem painel-quadrado cartao-entrada">
      <label for="foto">Anexar imagem:</label>
      <input id="foto" type="file" accept="image/*" @change="aoSelecionarFotoProblema" />
    </div>

    <div class="descrever-problema painel-quadrado cartao-entrada">
      <label for="descrever">Descrever problema:</label>
      <textarea id="descrever" v-model="cadastro.usuario.descrever"></textarea>
    </div>

    <button type="button" @click="validarFormulario" class="bnt-confirmar">Confirmar</button>
    <button @click="cancelar" class="bnt-cancelar">Cancelar</button>
  </div>

  <div
    v-if="alerta"
    class="alerta-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="titulo-alerta"
    @click.self="fecharAlerta"
  >
    <div class="alerta-caixa">
      <h2 id="titulo-alerta">Atenção</h2>
      <p>{{ alerta }}</p>
      <button type="button" class="botao-alerta" @click="fecharAlerta">Entendi</button>
    </div>
  </div>
</template>


<style scoped>
.container-formulario {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

h1 {
  grid-column: span 2;
  color: #705335;
  text-align: center;
  font-size: 3.2rem;
  margin-bottom: 24px;
  font-weight: 400;
}

.grade-formulario {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}

.cartao-entrada {
  display: flex;
  align-items: center;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 12px 18px;
  background-color: #ebe2cc;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.cartao-entrada label {
  color: #4a5435;
  font-weight: 700;
  font-size: 1.15rem;
  margin-right: 8px;
  white-space: nowrap;
}

.cartao-entrada input[type='text'],
.cartao-entrada input[type='email'],
.cartao-entrada select {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #4a5435;
  font-size: 1.1rem;
  font-weight: 600;
}

.cartao-entrada select {
  cursor: pointer;
}

/* Painéis de Anexo e Descrição */
.painel-quadrado {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 220px;
  padding: 16px;
  box-sizing: border-box;
}

.painel-quadrado label {
  margin: 0 0 16px 0;
  text-align: center;
  font-size: 1.25rem;
}

.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  cursor: pointer;
}

.plus-box {
  border: 1.5px solid #8c7355;
  width: 120px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.plus-icon {
  font-size: 3rem;
  color: #b3b3b3;
  font-weight: 300;
  line-height: 1;
}

.input-file-hidden {
  display: none;
}

.painel-quadrado textarea {
  width: 100%;
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #4a5435;
  font-size: 1.1rem;
  font-weight: 600;
  resize: none;
}

/* Área e Estilo dos Botões */
.acoes-container {
  grid-column: span 2;
  display: flex;
  gap: 24px;
  margin-top: 10px;
}

.btn-pill {
  flex: 1;
  background-color: #536236;
  color: #f1ebd9;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease, transform 0.2s ease;
  text-align: center;
}

.btn-pill:hover {
  background-color: #43502a;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .grade-formulario {
    grid-template-columns: 1fr;
  }

  h1, .acoes-container {
    grid-column: auto;
  }

  .acoes-container {
    flex-direction: column;
    gap: 16px;
  }
}
</style>