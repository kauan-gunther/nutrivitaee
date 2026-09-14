<script setup>
function rolarParaDiferencial() {
  const el = document.getElementById('secao-diferencial')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="hero-nutricionistas">
    <h1>"O que você acharia de uma consulta onde o medo não tem lugar?"</h1>
    <p class="subtitulo">
      Nós acreditamos que cuidar da saúde deve ser um ato de amor-próprio, e não uma obrigação baseada em números frios.
    </p>
    <button class="btn-diferencial" @click="rolarParaDiferencial">Descubra Nosso Diferencial</button>
  </section>
</template>

<style scoped>
.hero-nutricionistas {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/img/nutricionista/banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  box-sizing: border-box;
  margin: 0; 
}

.hero-nutricionistas h1 {
  color: #f5f0dc;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 400;
  max-width: 800px;
  margin: 0 0 20px 0;
}

.subtitulo {
  color: #f5f0dc;
  font-size: 1.1rem;
  max-width: 600px;
  margin-bottom: 35px;
  line-height: 1.6;
}

.btn-diferencial {
  background-color: #536236;
  color: #F1EDD2;
  border: none;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: background-color 0.2s ease;
}

.btn-diferencial:hover {
  background-color: #333F34;
}
</style>