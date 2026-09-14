<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { usuarioLogado, isPaciente, isProfissional, carregarUsuario } = useAuth()

onMounted(() => {
  carregarUsuario()
  window.addEventListener('storage', carregarUsuario)
})

onUnmounted(() => {
  window.removeEventListener('storage', carregarUsuario)
})

const destinoNutricionistas = computed(() => {
  if (isProfissional.value && usuarioLogado.value?.id) {
    return `/profissional/${usuarioLogado.value.id}`
  }
  return '/nutricionistas'
})

const rotaPerfilProfissional = computed(() => {
  if (usuarioLogado.value?.id) {
    return `/profissional/${usuarioLogado.value.id}`
  }
  return '/perfil'
})
</script>

<template>
  <header>
    <div class="menu-hamburguer">
      <input type="checkbox" id="menu-toggle" />
      <label for="menu-toggle" class="menu-icon">
        <div class="linha"></div>
        <div class="linha"></div>
        <div class="linha"></div>
      </label>

      <label for="menu-toggle" class="backdrop"></label>

      <nav class="overlay">
        <ul class="menu-list">
          <li>
            <RouterLink to="/bannerHomeComponent">
              <i class="mdi mdi-home-circle"></i> Home
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="destinoNutricionistas">
              <i class="mdi mdi-food-apple-outline"></i>
              Nutricionistas
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/meus-agendamentos">
              <i class="mdi mdi-calendar-multiselect-outline"></i>
              Agendamentos
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/mensagens">
              <i class="mdi mdi-forum-outline"></i>
              Conversas
            </RouterLink>
          </li>

          <div class="user">
            <li v-if="isPaciente">
              <RouterLink to="/perfil">
                <i class="mdi mdi-account-circle"></i>
                Perfil Paciente
              </RouterLink>
            </li>
            <li v-if="isProfissional">
              <RouterLink :to="rotaPerfilProfissional">
                <i class="mdi mdi-account-circle"></i>
                Perfil Profissional
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/pratos/receitas">
                <i class="mdi mdi-tag-heart"></i>
                Receitas
              </RouterLink>
            </li>

            <li>
              <RouterLink to="/login">
                <i class="mdi mdi-login-variant"></i>
                Login
              </RouterLink>
            </li>
          </div>
          <li>
            <RouterLink to="/sobreNos">
              <i class="mdi mdi-account-group"></i>
              Sobre nós
            </RouterLink>
          </li>
        </ul>
        <div class="div">
          <RouterLink to="/CadastroSuporte"> Suporte </RouterLink>
          <RouterLink to="/">
            <img src="/logo.png" alt="logo" class="logo" />
          </RouterLink>
        </div>
      </nav>
    </div>

    <h1 class="logo">
      <RouterLink to="/">
        <img src="/logo.png" alt="logo" />
      </RouterLink>
    </h1>
  </header>
</template>

<style scoped>
/*====================================
     HEADER (DESKTOP - PADRÃO)
=====================================*/
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #536236;
  padding: 8px 30px; 
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

header h1 {
  margin: 0;
  order: 2; 
}

header h1 img {
  width: 100px;
  height: auto;
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 1));
}

header a {
  text-decoration: none;
  font-size: 17px;
  color: #f1edd2;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

header .div {
  display: flex;
  align-items: center;
  gap: 15px;
}

/*============ Mobile ===========*/
#menu-toggle,
.menu-icon,
.backdrop {
  display: none;
}

div.linha {
  width: 25px;
  height: 3px;
  margin: 4px 0;
  background: #f1edd2;
  border-radius: 2px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.menu-icon:hover .linha {
  background: #9a9e70;
}

.overlay {
  position: static;
  background-color: transparent;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  order: 1;
}

.overlay .logo {
  display: none;
}

.menu-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li,
.user li {
  margin: 0;
}

.user {
  display: flex;
  gap: 1.2rem;
}

.menu-list a:hover {
  color: #9a9e70;
  transform: scale(1.05);
}

/*====================================
     ESTILO MOBILE (Até 768px)
=====================================*/
@media (max-width: 768px) {
  header {
    padding: 10px 20px;
  }

  .menu-hamburguer {
    order: 1; 
  }

  h1.logo {
    order: 2; 
  }

  .menu-icon {
    display: block;
    cursor: pointer;
  }

  .overlay .logo {
    display: block;
    margin: 14px auto;
    height: 48px;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: -100%;
    right: auto;
    width: 220px;
    height: 100vh;
    background-color: #536236;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 16px;
    transition: left 0.4s ease-in-out;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  #menu-toggle:checked ~ .overlay {
    left: 0;
  }

  #menu-toggle:checked ~ .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 900;
  }

  .menu-list {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 1rem;
  }

  .user {
    flex-direction: column;
    gap: 1rem;
  }

  header a {
    font-size: 16px;
  }
}
</style>