<script setup>
</script>

<template>
  <section class="funcionabilidade">
    <div class="container">
      <h2>Bem-estar que faz sentido</h2>

      <ul class="itens">
        <li>
          <span class="icone"><i class="mdi mdi-tune-variant"></i></span>
          <p>Preferências e objetivos organizados de forma simples.</p>
        </li>
        <li>
          <span class="icone"><i class="mdi mdi-account-search-outline"></i></span>
          <p>Encontre nutricionistas alinhados às suas necessidades.</p>
        </li>
        <li>
          <span class="icone"><i class="mdi mdi-calendar-clock-outline"></i></span>
          <p>Online ou presencial, no horário ideal para você.</p>
        </li>
        <li>
          <span class="icone"><i class="mdi mdi-food-apple-outline"></i></span>
          <p>Receitas e recomendações adaptadas ao seu paladar e evolução.</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.funcionabilidade {
  --fundo-bloco: transparent;
  --texto-bloco: #1B2418;

  margin: 0;
  border-radius: 0;

  padding: clamp(48px, 8vw, 112px) clamp(24px, 6vw, 96px);
  background: var(--fundo-bloco);
  color: var(--texto-bloco);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.funcionabilidade h2 {
  font-size: clamp(2.4rem, 5.5vw, 4.5rem);
  line-height: 1.05;
  color: var(--texto-bloco);
  margin: 0 0 clamp(32px, 5vw, 64px);
}

.itens {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 clamp(20px, 3vw, 40px);
}

.itens li {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0 8px;
  border-top: 1px solid rgba(27, 36, 24, 0.35);
}

.icone {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--creme);
  color: var(--verde);
}

.icone i {
  font-size: 1.5rem;
}

.itens p {
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1000px) {
  .itens {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px clamp(20px, 3vw, 40px);
  }
}

@media (max-width: 560px) {
  .itens {
    grid-template-columns: 1fr;
  }
}
</style>
