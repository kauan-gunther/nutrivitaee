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
          <li>Suas preferêncisc\dc\dvcd\vdfas de sabor</li>
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
  /* Aumentado de 1050px para 1250px para esticar bem o bloco deitado na tela */
  max-width: 1250px;
  margin: 0 auto;
  padding: 60px 20px 20px 20px;
}

.diferencial-card {
  border: 1.5px solid #73441B;
  border-radius: 30px;
  /* Aumentado o padding lateral interno para espalhar os itens com harmonia */
  padding: 45px 60px;
  background-color: transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.diferencial-card h2 {
  color: #333F34;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.intro {
  color: #536236;
  font-size: 1.05rem;
  margin-bottom: 35px;
}

.diferencial-conteudo {
  display: flex;
  align-items: center;
  /* Usa espaço uniforme entre os pratos e a lista para ocupar bem o comprimento */
  justify-content: space-around;
  gap: 50px;
}

.grid-pratos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  flex-shrink: 0;
}

.grid-pratos img {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.lista-diferenciais {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.lista-diferenciais li {
  display: flex;
  align-items: center;
  color: #333F34;
  font-weight: 500;
  font-size: 1.05rem;
}

.lista-diferenciais li::before {
  content: "•";
  color: #705335;
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