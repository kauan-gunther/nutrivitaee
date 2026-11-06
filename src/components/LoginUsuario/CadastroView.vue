<template>
  <div class="cadastro-container">
    <div class="header">
      <h1 class="serif-title">Cadastro de usuário</h1>
    </div>

    <form @submit.prevent="submitCadastro" class="form-grid">
      <!-- Coluna da Esquerda -->
      <div class="form-col">
        <div class="input-pill">
          <span class="label-text">Nome:</span>
          <input type="text" v-model="form.nome" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Cpf:</span>
          <input
            type="text"
            inputmode="numeric"
            placeholder="000.000.000-00"
            :value="form.cpf"
            @input="form.cpf = mascaraCpf($event.target.value)"
            required
          />
        </div>

        <div class="input-pill">
          <span class="label-text">peso:</span>
          <input type="text" v-model="form.peso" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Criar senha:</span>
          <input type="password" v-model="form.senha" required />
        </div>
      </div>

      <!-- Coluna da Direita -->
      <div class="form-col">
        <div class="input-pill">
          <span class="label-text">E-mail:</span>
          <input type="text" v-model="form.email" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Telefone:</span>
          <input
            type="text"
            inputmode="tel"
            placeholder="(00) 00000-0000"
            :value="form.telefone"
            @input="form.telefone = mascaraTelefone($event.target.value)"
            required
          />
        </div>

        <div class="input-pill date-field">
          <span class="label-text">Data de nascimento:</span>
          <input type="date" v-model="form.dataNascimento" placeholder="DD/MM/AAAA" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Confirmar senha:</span>
          <input type="password" v-model="form.confirmarSenha" required />
        </div>
      </div>

      <!-- NOVO: endereço (o CEP preenche rua, bairro, cidade e estado sozinho) -->
      <div class="secao-titulo">Endereço</div>

      <div class="form-col">
        <div class="input-pill">
          <span class="label-text">CEP:</span>
          <input
            type="text"
            inputmode="numeric"
            placeholder="00000-000"
            :value="form.cep"
            @input="aoDigitarCep($event.target.value)"
            required
          />
        </div>

        <div class="input-pill">
          <span class="label-text">Rua:</span>
          <input type="text" v-model="form.rua" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Bairro:</span>
          <input type="text" v-model="form.bairro" required />
        </div>
      </div>

      <div class="form-col">
        <div class="input-pill">
          <span class="label-text">Número:</span>
          <input type="text" v-model="form.numero" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Cidade:</span>
          <input type="text" v-model="form.cidade" required />
        </div>

        <div class="input-pill">
          <span class="label-text">Estado:</span>
          <input type="text" maxlength="2" placeholder="UF" v-model="form.estado" required />
        </div>
      </div>

      <p v-if="avisoCep.texto" class="aviso-cep" :class="avisoCep.tipo">{{ avisoCep.texto }}</p>

      <!-- NOVO: mensagens de carregamento, sucesso e erro -->
      <p v-if="mensagem.texto" class="feedback" :class="mensagem.tipo" role="status">
        {{ mensagem.texto }}
      </p>

      <!-- Botões inferiores -->
      <div class="action-bar">
        <button type="submit" class="btn-pill btn-confirmar" :disabled="enviando">
          {{ enviando ? 'Salvando...' : 'Confirmar' }}
        </button>
        <button
          type="button"
          class="btn-pill btn-cancelar"
          :disabled="enviando"
          @click="cancelarCadastro"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { buscarCep, buscarPacientes, criarPaciente } from '@/services/pacientesApi.js'
import {
  cpfValido,
  dataNascimentoValida,
  emailValido,
  mascaraCep,
  mascaraCpf,
  mascaraTelefone,
  somenteNumeros,
} from '@/utils/mascaras.js'

const router = useRouter()
const { login } = useAuth()

const form = reactive({
  nome: '',
  cpf: '',
  peso: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  senha: '',
  confirmarSenha: '',
  // endereço
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
})

// mensagem principal do formulário: tipo = 'carregando' | 'sucesso' | 'erro'
const mensagem = ref({ tipo: '', texto: '' })
// aviso da busca de CEP
const avisoCep = ref({ tipo: '', texto: '' })
const enviando = ref(false)

// Digitou o CEP: aplica a máscara e, quando completa os 8 números, consulta o ViaCEP
async function aoDigitarCep(valor) {
  form.cep = mascaraCep(valor)
  avisoCep.value = { tipo: '', texto: '' }

  if (somenteNumeros(form.cep).length !== 8) return

  avisoCep.value = { tipo: 'carregando', texto: 'Buscando endereço...' }
  try {
    const endereco = await buscarCep(form.cep)
    form.rua = endereco.rua
    form.bairro = endereco.bairro
    form.cidade = endereco.cidade
    form.estado = endereco.estado
    avisoCep.value = { tipo: '', texto: '' }
  } catch (erro) {
    avisoCep.value = { tipo: 'erro', texto: `${erro.message} Preencha o endereço manualmente.` }
  }
}

const submitCadastro = async () => {
  mensagem.value = { tipo: '', texto: '' }

  const cpf = somenteNumeros(form.cpf)
  const telefone = somenteNumeros(form.telefone)
  const email = form.email.trim().toLowerCase()

  // ---- validações (antes de falar com a API) ----
  const erroValidacao = (texto) => {
    mensagem.value = { tipo: 'erro', texto }
  }

  if (!emailValido(email)) return erroValidacao('Digite um e-mail válido.')
  if (!cpfValido(cpf)) return erroValidacao('Digite um CPF válido.')
  if (telefone.length < 10) return erroValidacao('Digite um telefone com DDD.')
  if (!dataNascimentoValida(form.dataNascimento)) {
    return erroValidacao('Digite uma data de nascimento válida.')
  }
  if (form.senha.length < 6) return erroValidacao('A senha deve ter pelo menos 6 caracteres.')
  if (form.senha !== form.confirmarSenha) return erroValidacao('As senhas não coincidem!')

  enviando.value = true
  mensagem.value = { tipo: 'carregando', texto: 'Salvando seu cadastro...' }

  try {
    // 1) pergunta à API se já existe paciente com esse CPF ou e-mail
    const [comMesmoCpf, comMesmoEmail] = await Promise.all([
      buscarPacientes({ cpf }),
      buscarPacientes({ email }),
    ])

    if (comMesmoCpf.length > 0 || comMesmoEmail.length > 0) {
      return erroValidacao('Já existe um paciente com este CPF ou e-mail.')
    }

    // 2) monta o paciente. Não mandamos id: quem cria é a própria API
    const novoPaciente = {
      tipo: 'paciente',
      tag: 'paciente',
      nome: form.nome.trim(),
      cpf,
      peso: form.peso.includes('kg') ? form.peso : `${form.peso}kg`,
      dataNascimento: form.dataNascimento,
      email,
      telefone,
      senha: form.senha,
      foto: '',
      endereco: {
        cep: somenteNumeros(form.cep),
        rua: form.rua.trim(),
        numero: form.numero.trim(),
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim().toUpperCase(),
      },
      preferencias: { gosto: [], naoGosto: [] },
      alergias: [],
    }

    // 3) POST /pacientes: a API devolve o paciente salvo, já com o id
    const salvo = await criarPaciente(novoPaciente)

    // 4) já deixa a pessoa logada (sem guardar a senha na sessão)
    const semSenha = { ...salvo }
    delete semSenha.senha
    login(semSenha)

    mensagem.value = { tipo: 'sucesso', texto: 'Cadastro realizado com sucesso! Redirecionando...' }
    setTimeout(() => router.push('/perfil'), 1200)
  } catch (erro) {
    erroValidacao(erro.message)
  } finally {
    enviando.value = false
  }
}

const cancelarCadastro = () => {
  router.push('/login')
}
</script>

<style scoped>
.cadastro-container {
  width: 100%;
  max-width: 820px;
  margin: 40px auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 35px;
  text-align: center;
}

.serif-title {
  font-family: 'Italiana', serif, sans-serif;
  font-size: 3.2rem;
  color: #705335;
  font-weight: 400;
  margin: 0;
}

.form-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}

.form-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-pill {
  position: relative;
  background-color: #ebe2cc;
  border: 1.5px solid #8c7355;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  height: 52px;
}

.label-text {
  color: #4a5435;
  font-size: 1.15rem;
  font-weight: 500;
  white-space: nowrap;
}

.input-pill input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 1.05rem;
  color: #4a5435;
  margin-left: 8px;
  font-family: inherit;
}

.input-pill input[type='date'] {
  color: #705335;
}

.input-pill input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: brightness(0) saturate(100%) invert(28%) sepia(14%) saturate(17%) hue-rotate(34deg)
    brightness(90%) contrast(90%);
}

/* Ações/Botões */
.action-bar {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 35px;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  text-align: center;
}

.btn-pill:hover {
  background-color: #43502a;
  transform: translateY(-2px);
}

/* ===== Novidades da versão com API ===== */
.secao-titulo {
  grid-column: span 2;
  font-family: 'Italiana', serif;
  font-size: 1.8rem;
  color: #705335;
  margin-top: 10px;
}

.aviso-cep {
  grid-column: span 2;
  margin: -6px 0 0;
  font-size: 0.95rem;
  color: #4a5435;
}

.aviso-cep.erro {
  color: #a13d3d;
}

.feedback {
  grid-column: span 2;
  margin: 10px 0 0;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  text-align: center;
}

.feedback.carregando {
  background: #ebe2cc;
  color: #4a5435;
}

.feedback.sucesso {
  background: #dfe8cf;
  color: #3b4a22;
}

.feedback.erro {
  background: #f3dcd6;
  color: #8a2f2f;
}

.btn-pill:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .secao-titulo,
  .aviso-cep,
  .feedback {
    grid-column: span 1;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .action-bar {
    grid-column: span 1;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
