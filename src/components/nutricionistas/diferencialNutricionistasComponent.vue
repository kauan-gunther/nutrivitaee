<script setup>
function rolarParaDiferencial() {
  const el = document.getElementById('secao-diferencial')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="secao-diferencial" class="diferencial-wrapper">
    <div class="diferencial-card">
      <h2>Comida de Verdade, do Seu Jeito</h2>
      <p class="intro">Chega de dietas de gaveta. Nossos planos alimentares levam em conta:</p>

      <div class="diferencial-conteudo">
        <div class="grid-pratos">
          <img src="/img/nutricionista/pratos/prato1.png" alt="Prato 1" />
          <img src="/img/nutricionista/pratos/prato2.png" alt="Prato 2" />
          <img src="/img/nutricionista/pratos/prato3.png" alt="Prato 3" />
          <img src="/img/nutricionista/pratos/prato4.png" alt="Prato 4" />
          <img src="/img/nutricionista/pratos/prato5.png" alt="Prato 5" />
          <img src="/img/nutricionista/pratos/prato6.png" alt="Prato 6" />
        </div>

        <ul class="lista-diferenciais">
          <li>Suas preferências de sabor</li>
          <li>Alergias e intolerâncias alimentares</li>
          <li>Sua rotina financeira e de tempo</li>
          <li>A alegria de comer o que você gosta</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.diferencial-wrapper {
  max-width: 1250px;
  margin: 0 auto;
  padding: 60px 20px 20px 20px;
}

.diferencial-card {
  border: 1.5px solid #73441B;
  border-radius: 30px;
  padding: 30px 100px;
  background-color: transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.diferencial-card h2 {
  color: #333F34;
  font-size: 55px;
  font-weight: bold;
  margin-bottom: 12px;
}

.intro {
  color: #536236;
  font-size: 22px;
  margin-bottom: 35px;
}

.diferencial-conteudo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 90px;
}

.grid-pratos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.grid-pratos img {
  width: 100px;
  height: 100px;
  border-radius: 10%;
  object-fit: cover;
}

.lista-diferenciais {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align: left;
}

.lista-diferenciais li {
  display: flex;
  align-items: center;
  color: #333F34;
  font-weight: 500;
  font-size: 20px;
}

.lista-diferenciais li::before {
  content: "•";
  color: #536236;
  font-size: 2rem;
  margin-right: 12px;
  line-height: 0;
}

@media (max-width: 768px) {
  .diferencial-card {
    padding: 30px 20px;
  }

  .diferencial-conteudo {
    flex-direction: column;
  }
  
  .grid-pratos {
    grid-template-columns: repeat(2, 1fr);
    margin: 0 auto;
  }
}
</style>