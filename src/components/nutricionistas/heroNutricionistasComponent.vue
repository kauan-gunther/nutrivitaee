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
    linear-gradient(rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)),
    url('/img/nutricionista/banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 72px 20px 60px;
  box-sizing: border-box;
  margin: 0;
}

.hero-nutricionistas h1 {
  color: #f5f0dc;
  font-size: clamp(2rem, 3vw, 3.1rem);
  font-weight: 400;
  line-height: 1.2;
  max-width: 880px;
  margin: 0 0 18px;
  letter-spacing: 0.02em;
}

.subtitulo {
  color: #f5f0dc;
  font-size: clamp(0.95rem, 1.5vw, 1.2rem);
  max-width: 700px;
  margin: 0 0 28px;
  line-height: 1.6;
}

.btn-diferencial {
  background-color: #536236;
  color: #f1edd2;
  border: none;
  padding: 14px 30px;
  border-radius: 999px;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.4vw, 1rem);
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.btn-diferencial:hover {
  background-color: #333f34;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .hero-nutricionistas {
    min-height: 58vh;
    padding: 56px 18px 46px;
  }

  .hero-nutricionistas h1 {
    max-width: 600px;
    margin-bottom: 14px;
  }

  .subtitulo {
    margin-bottom: 22px;
  }
}

@media (max-width: 480px) {
  .hero-nutricionistas {
    min-height: 52vh;
    padding: 48px 16px 36px;
  }

  .hero-nutricionistas h1 {
    font-size: clamp(1.7rem, 8vw, 2.3rem);
  }

  .subtitulo {
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .btn-diferencial {
    width: 100%;
    max-width: 280px;
    padding: 13px 18px;
  }
}
</style>