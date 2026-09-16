<script setup>
</script>

<template>
  <section class="funcionabilidade">
    <div class="card">
    <div class="left">
      <h2>Bem-estar que faz sentido</h2>
      <ul>
        <li>Preferências e objetivos organizados de forma simples.</li>
        <li>Encontre nutricionistas alinhados às suas necessidades.</li>
        <li>Online ou presencial, no horário ideal para você.</li>
        <li>Receitas e recomendações adaptadas ao seu paladar e evolução.</li>
      </ul>
    </div>
    <div class="right">
      <img src="/logo-branca.png" alt="logo">
    </div>
    </div>
  </section>
</template>

<style scoped>
.funcionabilidade {
  width: 100%;
  padding: 30px 10px; 
  display: flex;
  justify-content: center;
}

.card {
  border-radius: 20px;
  padding: 40px clamp(20px, 4vw, 50px);
  width: 98%; 
  max-width: 1400px; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
}

.left h2 {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #73441B;
  font-weight: 400;
  margin: 0;
}

.left ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.left li {
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  color: #333f34;
  line-height: 1.5;
}

.right {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.right img {
  width: clamp(220px, 25vw, 320px);
  height: auto;
  margin: 0;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

@media (max-width: 768px) {
  .funcionabilidade {
    padding: 20px 8px;
  }

  .card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .left {
    align-items: center;
  }

  .right img {
    width: 200px;
  }
}
</style>