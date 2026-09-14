<script setup>
</script>

<template>
  <section class="hero-container">
    <div class="content">
      
      <h2>Alimentação saudável do seu jeito</h2>
      <p>
        Encontre nutricionistas, agende consultas e receba receitas personalizadas de acordo com seus gostos e objetivos.
      </p>

      <ul id="beneficios" class="beneficios">
        <li>
          <i class="mdi mdi-check-circle-outline"></i>
          Atendimento online e presencial
        </li>
        <li>
          <i class="mdi mdi-check-circle-outline"></i>
          Receitas adaptadas ao seu perfil
        </li>
        <li>
          <i class="mdi mdi-check-circle-outline"></i>
          Acompanhamento humanizado
        </li>
      </ul>
</div>
  </section>
</template>

<style scoped>
.hero-container {
  width: 100%;
  padding: 80px 40px; 
  display: flex;
  justify-content: center;
}

.content {
  width: 100%;
  max-width: 1200px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.content h2 {
  color: #333F34;
  font-size: clamp(2.4rem, 4.5vw, 3.6rem);
  font-weight: 400;
  margin: 0 0 16px 0;
  max-width: 1050px;
}

.content p {
  color: #536236;
  font-size: clamp(1.1rem, 1.6vw, 1.4rem);
  line-height: 1.6;
  max-width: 900px;
  margin: 0 0 32px 0;
}

.beneficios {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between; 
  gap: 20px;
  width: 100%;
  max-width: 1100px; 
}

.beneficios li {
  flex: 1; 
  background: rgba(83, 98, 54, 0.06);
  border: 1px solid #536236;
  color: #333F34;
  font-size: 1.05rem;
  padding: 14px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  white-space: nowrap;
}

.beneficios i {
  color: #536236;
  font-size: 1.25rem;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 32px;
  width: 100%;
  max-width: 850px; 
  margin-top: 50px; 
}

.btn-card {
  flex: 1;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.25s ease;
}

.user {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 18px 32px;
  border-radius: 50px;
}

.user i {
  font-size: 1.8rem;
}

.user span {
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .beneficios {
    flex-direction: column;
    align-items: center;
  }
  
  .beneficios li {
    width: 100%;
    max-width: 450px;
  }

  .cta-group {
    flex-direction: column;
    margin-top: 36px;
    gap: 16px;
  }

  .btn-card {
    width: 100%;
  }
}
</style>