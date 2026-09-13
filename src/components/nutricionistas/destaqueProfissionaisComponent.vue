<script setup>
import { RouterLink } from 'vue-router'

const destaques = [
  {
    id: 'destaque-1',
    titulo: 'Especialista em Emagrecimento Saudável',
    nome: 'Dra. Fabiana Roberta de Jesus',
    crm: '45.892/SP',
    telefone: '(11) 98765-4321',
    email: 'dra.fabiana.jesus@gmail.com',
    dataNascimento: '15/05/1990',
    foto: '/img/nutricionista/profissional/foto-fabiana.png',
    formacoes: [
      { tipo: 'Curso', nome: 'Nutrição de Precisão' },
      { tipo: 'Pós-Graduação', nome: 'Nutrição Aplicada à Perda de Peso' },
      { tipo: 'Especialização', nome: 'Bioquímica Funcional e Emagrecimento' }
    ],
    formacoesDireita: [
      { tipo: 'Graduação', nome: 'Bacharelado em Nutrição' },
      { tipo: 'Pós-Graduação', nome: 'Obesidade e Emagrecimento' },
      { tipo: 'Pós-Graduação', nome: 'Nutrição Clínica Avançada' }
    ]
  },
  {
    id: 'destaque-2',
    titulo: 'Transformando Sua Autoimagem de Dentro para Fora',
    nome: 'Dr. Filipe Nogueira Soares',
    crm: '28.765/RJ',
    telefone: '(21) 91234-5678',
    email: 'drfilipe.nutri@gmail.com',
    dataNascimento: '02/09/1987',
    foto: '/img/nutricionista/profissional/foto-felipe.png',
    formacoes: [
      { tipo: 'Curso', nome: 'Mindfulness Comer Consciente' },
      { tipo: 'Curso', nome: 'Psicologia do Emagrecimento' },
      { tipo: 'Especialização', nome: 'Estética Saudável' }
    ],
    formacoesDireita: [
      { tipo: 'Graduação', nome: 'Bacharelado em Nutrição e Psicologia' },
      { tipo: 'Pós-Graduação', nome: 'Neurobiologia Alimentar' },
      { tipo: 'Pós-Graduação', nome: 'Nutrição Comportamental' }
    ]
  },
  {
    id: 'destaque-3',
    titulo: 'Transformando a sua Rotina com Sabor e Saúde',
    nome: 'Dra. Beatriz Mendes Rochas',
    crm: '78.945/SP',
    telefone: '(31) 99876-5432',
    email: 'dra.beatriz.nutri@gmail.com',
    dataNascimento: '23/01/1993',
    foto: '/img/nutricionista/profissional/foto-beatriz.png',
    formacoes: [
      { tipo: 'Curso', nome: 'Planejamento Alimentar e Meal Prep' },
      { tipo: 'Curso', nome: 'Substituição Inteligente e Limpa de Açúcar' },
      { tipo: 'Especialização', nome: 'Nutrição Comportamental e Comfort Food' }
    ],
    formacoesDireita: [
      { tipo: 'Graduação', nome: 'Nutrição Clínica e Personalizada' },
      { tipo: 'Pós-Graduação', nome: 'Nutrição em Ajustes' },
      { tipo: 'Pós-Graduação', nome: 'Gastronomia Funcional e Alta Gastronomia' }
    ]
  },
  {
    id: 'destaque-4',
    titulo: 'Especialista em Ganho de Massa Muscular',
    nome: 'Dr. Rafael da Rocha Araújo',
    crm: '61.439/SC',
    telefone: '(41) 98888-7777',
    email: 'drrafael.nutri@gmail.com',
    dataNascimento: '10/11/1985',
    foto: '/img/nutricionista/profissional/foto-rafael.png',
    formacoes: [
      { tipo: 'Curso', nome: 'Fisiologia do Exercício Aplicada à Hipertrofia' },
      { tipo: 'Curso', nome: 'Bioquímica Anabólica e Metabolismo Muscular' },
      { tipo: 'Especialização', nome: 'Nutrição e Ganho de Força' }
    ],
    formacoesDireita: [
      { tipo: 'Pós-Graduação', nome: 'Nutrição Esportiva e Alta Performance' },
      { tipo: 'Pós-Graduação', nome: 'Nutrição de Precisão Aplicada à Hipertrofia' },
      { tipo: 'Graduação', nome: 'Bacharelado em Nutrição' }
    ]
  }
]
</script>

<template>
  <section class="destaque-profissionais">
    <div class="lista-destaques">
      <div v-for="(prof, index) in destaques" :key="prof.id" class="card-destaque" :class="{ 'invertido': index % 2 !== 0 }">
        <h3>{{ prof.titulo }}</h3>

        <div class="conteudo">
          <div class="foto-wrapper">
            <img :src="prof.foto" :alt="prof.nome" class="foto" />
          </div>

          <div class="dados-container">
            <div class="dados-principais">
              <p><strong>Nome:</strong> {{ prof.nome }}</p>
              <p><strong>CRM:</strong> {{ prof.crm }}</p>
              <p><strong>Telefone:</strong> {{ prof.telefone }}</p>
              <p><strong>Email:</strong> {{ prof.email }}</p>
              <p><strong>Data de Nascimento:</strong> {{ prof.dataNascimento }}</p>
            </div>

            <div class="formacoes-grid">
              <div class="col-formacao">
                <h4>Formação Acadêmica</h4>
                <ul>
                  <li v-for="(f, idx) in prof.formacoes" :key="idx">
                    <strong>{{ f.tipo }}:</strong> {{ f.nome }}
                  </li>
                </ul>
              </div>
              <div class="col-formacao">
                <h4>Formação Acadêmica</h4>
                <ul>
                  <li v-for="(f, idx) in prof.formacoesDireita" :key="idx">
                    <strong>{{ f.tipo }}:</strong> {{ f.nome }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RouterLink to="/profissionais" class="btn-ver-mais">Ver mais Perfis</RouterLink>
  </section>
</template>

<style scoped>
.destaque-profissionais {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 20px 70px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lista-destaques {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
}

.card-destaque {
  border: 2px solid #73441B;
  border-radius: 24px;
  padding: 24px 28px;
}

.card-destaque h3 {
  color: #333F34;
  font-size: 1.4rem;
  font-weight: normal;
  text-align: center;
  margin: 0 0 20px 0;
}

.conteudo {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.card-destaque.invertido .conteudo {
  flex-direction: row-reverse;
}

.foto-wrapper {
  flex-shrink: 0;
  width: 140px;
  height: 170px;
}

.foto {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.dados-container {
  flex: 1;
  color: #333F34;
}

.dados-principais {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
  font-size: 0.85rem;
  margin-bottom: 14px;
  border-bottom: 1px solid #73441B;
  padding-bottom: 10px;
}

.dados-principais p {
  margin: 2px 0;
}

.formacoes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.col-formacao h4 {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  font-weight: bold;
}

.col-formacao ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col-formacao li {
  font-size: 0.78rem;
  margin-bottom: 4px;
  line-height: 1.3;
}

.btn-ver-mais {
  background-color: transparent;
  border: 1.5px solid #73441B;
  color: #73441B;
  padding: 15px 60px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.25rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .conteudo, .card-destaque.invertido .conteudo {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .dados-principais {
    grid-template-columns: 1fr;
  }
  .formacoes-grid {
    grid-template-columns: 1fr;
    text-align: left;
  }
}
</style>