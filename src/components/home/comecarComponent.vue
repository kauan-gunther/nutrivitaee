<script setup>
</script>

<template>
  <section id="secao-escolha" class="comecar">
    <div class="users">
      
      <RouterLink to="/cadastro" class="btn-card primary">
        <div class="user">
          <i class="mdi mdi-account-heart-outline"></i>
          <span>Cadastrar Paciente</span>
        </div>
      </RouterLink>
      
      <RouterLink to="/cadastro-profissional" class="btn-card secondary">
        <div class="user">
          <i class="mdi mdi-stethoscope"></i>
          <span>Cadastrar Nutricionista</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.comecar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 20px 60px;
  margin-top: 55px;
  scroll-margin-top: 100px; 
}

.users {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px; 
  width: 100%;
  max-width: 1050px; 
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
  padding: 12px 10px; 
  border-radius: 50px;
}

.user i {
  font-size: 1rem; 
}

.user span {
  font-size: 1.25rem;
  font-weight: 500;
  white-space: nowrap;
}

.btn-card.primary {
  background: #536236;
  border: 1.5px solid #536236;
  box-shadow: 0 4px 15px rgba(83, 98, 54, 0.2);
}

.btn-card.primary .user {
  color: #F1EDD2;
}

.btn-card.primary:hover {
  background: #F1EDD2;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(83, 98, 54, 0.3);
}

.btn-card.primary:hover .user {
  color: #536236;
}

.btn-card.secondary {
  background: transparent;
  border: 1.5px solid #536236;
}

.btn-card.secondary .user {
  color: #536236;
}

.btn-card.secondary:hover {
  background: #536236;
  transform: translateY(-3px);
}

.btn-card.secondary:hover .user {
  color: #F1EDD2;
}

@media (max-width: 768px) {
  .comecar {
    margin-top: 35px;
  }

  .users {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }

  .btn-card {
    width: 100%;
  }

  .user span {
    font-size: 1rem;
  }
}
</style>