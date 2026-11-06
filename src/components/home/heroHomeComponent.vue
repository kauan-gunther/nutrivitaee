<script setup>
</script>

<template>
  <section class="hero">
    <h2>Alimentação saudável do seu jeito</h2>
    <p class="intro">
      Encontre nutricionistas, agende consultas e receba receitas personalizadas de acordo com seus gostos e objetivos.
    </p>

    <ul id="beneficios" class="beneficios">
      <li>
        <i class="mdi mdi-video-outline"></i>
        <h3>Atendimento online e presencial</h3>
        <p>Escolha o formato que cabe na sua rotina e agende no horário que preferir.</p>
      </li>
      <li>
        <i class="mdi mdi-silverware-fork-knife"></i>
        <h3>Receitas adaptadas ao seu perfil</h3>
        <p>Pratos e receitas pensados para o seu dia a dia, indicados pelo seu nutricionista.</p>
      </li>
      <li>
        <i class="mdi mdi-heart-outline"></i>
        <h3>Acompanhamento humanizado</h3>
        <p>Um profissional que acompanha sua evolução e ajusta o plano com você.</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* Mesma fonte do título da seção "Por que fazer acompanhamento nutricional?" */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&display=swap');

.hero {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(72px, 9vw, 128px) 24px clamp(40px, 5vw, 64px);
}

.hero h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.3rem, 4.8vw, 4rem);
  font-weight: 600;
  line-height: 1.08;
  color: #333f34;
  margin: 0 0 20px;
}

.intro {
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  line-height: 1.7;
  color: #536236;
  max-width: 640px;
  margin: 0 0 clamp(40px, 5vw, 64px);
}

/* Três colunas entre duas linhas finas, no mesmo estilo da seção de mensagens */
.beneficios {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(51, 63, 52, 0.25);
  border-bottom: 1px solid rgba(51, 63, 52, 0.25);
}

.beneficios li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: clamp(32px, 4vw, 48px) clamp(20px, 3vw, 48px);
}

.beneficios li + li {
  border-left: 1px solid rgba(51, 63, 52, 0.25);
}

.beneficios i {
  font-size: 2rem;
  color: #73441b;
}

.beneficios h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.4rem, 2vw, 1.7rem);
  font-weight: 600;
  line-height: 1.2;
  color: #333f34;
  margin: 6px 0 0;
}

.beneficios li p {
  font-size: 0.98rem;
  line-height: 1.6;
  color: #536236;
  max-width: 28ch;
  margin: 0;
}

@media (max-width: 900px) {
  .beneficios {
    grid-template-columns: 1fr;
  }

  .beneficios li + li {
    border-left: 0;
    border-top: 1px solid rgba(51, 63, 52, 0.25);
  }
}
</style>
