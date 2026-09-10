<script setup>
import { useRoute } from 'vue-router'
import { profissionais } from '@/data/profissionais'

const route = useRoute()

const profissionaisCadastrados = JSON.parse(localStorage.getItem('cadastros') || '[]').filter(
  (cadastro) => cadastro.tag === 'nutricionista',
)

const profissional = [...profissionais, ...profissionaisCadastrados].find(
  (item) => String(item.id) === String(route.params.id),
)
</script>

<template>
  <main v-if="profissional" class="perfil-container">
    <RouterLink
      :to="`/profissional/${profissional.id}/delete`"
      class="btn-icone btn-deletar"
      title="Excluir"
    >
      <i class="mdi mdi-delete-outline"></i>
    </RouterLink>

    <h1>Perfil do Profissional</h1>

    <div class="perfil-conteudo">
      <div class="dados-pessoais">
        <div class="linha-nome">
          <img :src="profissional.foto" :alt="profissional.nome" class="foto-perfil" />
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
        <div class="card-info">
          <h2>Formação Acadêmica</h2>
          <ul>
            <li v-for="(formacao, index) in profissional.formacoes" :key="index">
              <span class="bullet">•</span>
              <span class="tipo">{{ formacao.tipo }}:</span>
              <span class="nome">{{ formacao.nome }}</span>
            </li>
          </ul>
        </div>

        <div class="card-info">
          <h2>Especializações</h2>
          <ul>
            <li v-for="(especializacao, index) in profissional.especializacoes" :key="index">
              <span class="bullet">•</span>
              <span class="tipo">{{ especializacao.tipo }}:</span>
              <span class="nome">{{ especializacao.nome }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <RouterLink
      :to="`/profissional/${profissional.id}/edit`"
      class="btn-icone btn-editar"
      title="Editar"
    >
      <i class="mdi mdi-pencil-outline"></i>
    </RouterLink>
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
}

h1 {
  font-size: clamp(2.8rem, 4.5vw, 4rem);
  color: #536236;
  font-weight: 400;
  margin-bottom: 40px;
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
}

.flex-grow {
  flex: 1;
}

.campo-dado .label {
  font-size: 1.25rem;
  color: #536236;
  min-width: 80px;
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

.card-info h2 {
  font-size: 1.8rem;
  color: #536236;
  font-weight: 400;
  margin-bottom: 20px;
}

.card-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-info li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 1.1rem;
  color: #333f34;
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

.btn-icone {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #efe8d3;
  border: 1px solid rgba(140, 115, 85, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  font-size: 1.5rem;
  color: #333f34;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-icone:hover {
  transform: scale(1.08);
  background-color: #e6dfc9;
}

.btn-deletar {
  top: 30px;
  right: 40px;
}

.btn-editar {
  bottom: 30px;
  left: 40px;
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
  color: #f1edd2;
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
    padding: 30px 20px;
  }

  .cards-informacoes {
    grid-template-columns: 1fr;
  }

  .linha-nome {
    flex-direction: column;
  }

  .btn-deletar {
    top: 15px;
    right: 15px;
  }

  .btn-editar {
    bottom: 15px;
    left: 15px;
  }
}
</style>
