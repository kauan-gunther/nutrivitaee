<template>
  <section class="tecnologia-wrapper">
    <div class="tecnologia-card">
      <div class="tec-foto">
        <img src="/img/nutricionista/usuario.png" alt="Tecnologia a favor da saúde" />
      </div>
      <div class="tec-texto">
        <h2>Tecnologia a favor da Saúde</h2>
        <p>
          O acompanhamento online do Nutri Vitai remove as barreiras da distância. Além disso, você pode enxergar pelos olhos dos nossos especialistas e agendar com quem sentir maior empatia. Suas necessidades vêm sempre em primeiro lugar.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tecnologia-wrapper {
  max-width: 900px;
  margin: -40px auto 40px auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.tecnologia-card {
  border: 1.5px solid #73441B;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  border-radius: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.tec-foto {
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
}

.tec-foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tec-texto h2 {
  color: #333F34;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 6px;
}

.tec-texto p {
  color: #536236;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 600px) {
  .tecnologia-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>