<template>
  <section class="tecnologia-wrapper">
    <div class="tecnologia-card-deslocado">
      <div class="tec-foto">
        <img src="/img/nutricionista/usuario.png" alt="Tecnologia a favor da saúde" />
      </div>
      <div class="tec-texto">
        <h2>Tecnologia a favor da Saúde</h2>
        <p>
          O acompanhamento online do Nutri Vitae remove as barreiras da distância. Além disso, você pode navegar pelos perfis dos nossos especialistas e agendar com quem você sentir maior empatia. Suas necessidades vêm sempre em primeiro lugar.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tecnologia-wrapper {
  max-width: 1050px;
  margin: 0 auto;
  padding: 20px;
}

.tecnologia-card-deslocado {
  border: 1.5px solid #73441B;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px 35px;
  border-radius: 30px;
  background-color: transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin-left: 120px;
  position: relative;
  z-index: 5;
}

.tec-foto {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.tec-foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tec-texto h2 {
  color: #333F34;
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 6px;
}

.tec-texto p {
  color: #536236;
  font-size: 0.92rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .tecnologia-card-deslocado {
    flex-direction: column;
    text-align: center;
    margin-left: 0;
    width: 100%;
  }
}
</style>