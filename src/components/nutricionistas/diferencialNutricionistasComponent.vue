<template>
  <section id="secao-diferencial" class="diferencial">
    <h2>Comida de Verdade, do Seu Jeito</h2>

    <div class="diferencial-box">
      <p class="intro">Chega de dietas de gaveta. Nossos planos alimentares levam em conta:</p>

      <div class="diferencial-conteudo">
        <div class="grid-pratos">
          <img src="/img/nutricionista/pratos/prato1.png" alt="Prato 1" />
          <img src="/img/nutricionista/pratos/prato2.png" alt="Prato 2" />
          <img src="/img/nutricionista/pratos/prato3.png" alt="Prato 3" />
          <img src="/img/nutricionista/pratos/prato4.png" alt="Prato 4" />
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
.diferencial {
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 20px 0 20px;
  text-align: center;
}

.diferencial h2 {
  color: #333F34;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 24px;
}

.diferencial-box {
  border: #73441B 1.5px solid;
  border-radius: 24px;
  padding: 30px;
}

.intro {
  color: #536236;
  font-size: 1.05rem;
  margin-bottom: 40px;
}

.diferencial-conteudo {
  display: flex;
  align-items: center;
  gap: 40px;
}

.grid-pratos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  flex-shrink: 0;
  max-width: 220px;
}

.grid-pratos img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.lista-diferenciais {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  text-align: left;
}

.lista-diferenciais li {
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding: 16px 20px;
  color: #333F34;
  font-weight: 500;
  font-size: 0.95rem;
}

.lista-diferenciais li::before {
  content: "•";
  color: #705335;
  font-size: 1.8rem;
  margin-right: 12px;
  line-height: 0;
}

@media (max-width: 768px) {
  .diferencial-conteudo {
    flex-direction: column;
  }
  .grid-pratos {
    margin: 0 auto;
  }
}
</style>