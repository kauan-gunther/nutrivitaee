<template>
  <section id="secao-diferencial" class="diferencial">
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
  </section>
</template>

<style scoped>
.diferencial {
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 20px;
  text-align: center;
  border: #73441B 1.5px solid;
}

.diferencial h2 {
  color: #333F34;
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 8px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex-shrink: 0;
  max-width: 320px;
}

.grid-pratos img {
  width: 95px;
  height: 95px;
  border-radius: 16px;
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

/* Bolinha indicativa simulando o ícone do figma */
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