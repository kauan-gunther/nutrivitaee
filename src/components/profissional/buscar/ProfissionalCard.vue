<script setup>
defineProps({
  profissional: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="profissional-card">
    <div class="perfil">
      <RouterLink :to="`/profissional/${profissional.id}`">
        <img :src="profissional.foto" :alt="profissional.nome" class="profissional-image" />
        <button class="perfil-button">Ver Perfil</button>
      </RouterLink>
    </div>
    <div class="dados">
      <div class="texto">
        <p class="profissional-name">Nome: <span>{{ profissional.nome }}</span></p>
        <p class="profissional-telefone">Telefone: <span>{{ profissional.telefone }}</span></p>
        <p class="profissional-email">Email: <span>{{ profissional.email }}</span></p>
      </div>
      <div class="listas">
        <div class="formacao">
          <h4>Formação Acadêmica</h4>
          <ul>
            <li v-for="(formacao, index) in profissional.formacoes" :key="index">
              <span class="tipo">{{ formacao.tipo }}:</span>
              <span class="nome">{{ formacao.nome }}</span>
            </li>
          </ul>
        </div>
        <div class="especializacao">
          <h4>Especializações</h4>
          <ul>
            <li v-for="(especializacao, index) in profissional.especializacoes" :key="index">
              <span class="tipo">{{ especializacao.tipo }}:</span>
              <span class="nome">{{ especializacao.nome }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.profissional-card {
  width: 90%;
  max-width: 1200px;
  margin: 30px auto;
  box-shadow: none; 
  padding: 30px;
  border-radius: 20px;
  border: 2px solid #BF945A;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;

  & .perfil {
    width: 25%;
    display: flex;
    justify-content: center;

    & a {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;

      & img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        margin-bottom: 15px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: none; 
        border: 1px solid #BF945A;
      }

      & .perfil-button {
        background: #F1EDD2;
        color: #536236;
        border: #BF945A 1.5px solid;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: none; 
      }
    }
  }

  & .dados {
    width: 75%;
    padding-left: 30px;
    display: flex;
    flex-direction: column;

    & .texto {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;

      & p {
        color: #536236;
        font-weight: bold;
        margin: 0;
        font-size: 1.2rem;

        & span {
          color: #BF945A;
          font-weight: bold;
          -webkit-text-stroke: 0px;
        }
      }
    }

    & .listas {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 20px;

      & .formacao,
      & .especializacao {
        width: 48%;

        & h4 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #333F34;
          font-weight: bold;
        }

        & ul {
          list-style-type: none;
          padding-left: 0;
          margin: 0;

          & li {
            margin: 6px 0;
            color: #BF945A;
            font-size: 1rem;
            -webkit-text-stroke: 0px;

            & .tipo {
              color: #536236;
              font-weight: bold;
              margin-right: 5px;
              -webkit-text-stroke: 0px;
            }

            & .nome {
              color: #BF945A;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

/* ====================================
   ESTILOS PARA CELULAR (Responsividade)
===================================== */
@media (max-width: 768px) {
  .profissional-card {
    flex-direction: column;
    padding: 20px 15px;
    width: 95%;
    margin: 15px auto;

    & .perfil {
      width: 100%;
      margin-bottom: 20px;
    }

    & .dados {
      width: 100%;
      padding-left: 0;

      & .texto {
        flex-direction: column;
        gap: 10px;
        text-align: center;
        margin-bottom: 15px;

        & p {
          font-size: 1.05rem;
        }
      }

      & .listas {
        flex-direction: column;
        gap: 15px;

        & .formacao,
        & .especializacao {
          width: 100%;
          text-align: center;

          & h4 {
            font-size: 1.25rem;
            margin-bottom: 6px;
          }

          & ul {
            & li {
              font-size: 0.95rem;
            }
          }
        }
      }
    }
  }
}
</style>