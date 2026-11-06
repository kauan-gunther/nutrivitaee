<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { usuarioLogado, isPaciente, isProfissional, carregarUsuario } = useAuth()

const route = useRoute()
const menuToggle = ref(null)

// Nas páginas onde tiver o link do caminho abaixo o menu fica transparente por cima da foto; nas outras páginas ele é verde
const ehTransparente = computed(() => {
  return route.path === '/' || route.path.startsWith('/nutricionistas') || route.path.startsWith('/profissional') || route.path.startsWith('/receitas-recomendadas') || route.path.startsWith('/sobreNos') || route.path.startsWith('/meus-agendamentos')
})

// Fecha o menu lateral (celular) quando a página muda
watch(
  () => route.fullPath,
  () => {
    if (menuToggle.value) menuToggle.value.checked = false
  }
)

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
 <header :class="{ 'sobre-foto': ehTransparente }">
    <div class="menu-hamburguer">
      <input type="checkbox" id="menu-toggle" ref="menuToggle" />
      <label for="menu-toggle" class="menu-icon">
        <span class="sr-only">Abrir menu</span>
        <div class="linha"></div>
        <div class="linha"></div>
        <div class="linha"></div>
      </label>

      <label for="menu-toggle" class="backdrop"></label>

      <nav class="overlay">
        <ul class="menu-list">
          <li>
            <RouterLink to="/">
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
            <RouterLink to="/pratos/receitas">
              <i class="mdi mdi-tag-heart"></i>
              Receitas
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
          <li>
            <RouterLink to="/sobreNos">
              <i class="mdi mdi-account-group"></i>
              Sobre nós
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
              <RouterLink to="/login" class="login">
                <i class="mdi mdi-login-variant"></i>
                Login
              </RouterLink>
            </li>
          </div>
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
        <!-- Versão branca da logo: aparece bem sobre a foto escura do banner -->
        <img src="/logo-branca.png" alt="Nutrivitae" />
      </RouterLink>
    </h1>
  </header>
</template>

<style scoped>
/*====================================
      HEADER (DESKTOP - PADRÃO)
=====================================*/
header {
  --espaco: clamp(16px, 2vw, 36px);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  gap: var(--espaco);
  padding: 0 clamp(24px, 4vw, 64px);
  background: #536236;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  box-sizing: border-box;
}

header.sobre-foto {
  position: absolute;
  background: transparent;
}

@media (max-width: 1280px) {
  header.sobre-foto {
    box-shadow: none;
  }
}

header h1 {
  margin: 0;
  order: 1;
  line-height: 0;
}

header h1 img {
  display: block;
  height: 92px;
  width: auto;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.35));
}

header a {
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bolder;
  letter-spacing: 0.03em;
  color: #ffff;
  display: flex;
  align-items: center;
  gap: 8px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

header a:focus-visible {
  outline: 2px solid #f1edd2;
  outline-offset: 4px;
  border-radius: 4px;
}

.menu-hamburguer {
  order: 2;
  flex: 1;
  min-width: 0;
  display: flex;
}

.overlay {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--espaco);
  background: transparent;
}

.overlay .logo {
  display: none;
}

.menu-list {
  flex: 1;
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: var(--espaco);
}

.menu-list li,
.user li {
  margin: 0;
}

.menu-list > li:first-child {
  margin-left: auto;
}

.user {
  display: flex;
  align-items: center;
  gap: var(--espaco);
  margin-left: auto;
}

.menu-list i {
  display: none;
}

.menu-list a,
header .div a:first-child {
  position: relative;
  padding: 8px 0;
}

.menu-list a::after,
header .div a:first-child::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #f1edd2;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

.menu-list a:hover::after,
.menu-list a.router-link-exact-active::after,
header .div a:first-child:hover::after {
  transform: scaleX(1);
}

/* Login: único botão da barra */
.menu-list .user a.login {
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 10px 24px;
  border: 1.5px solid rgba(241, 237, 210, 0.8);
  border-radius: 10px;
}

.menu-list .user a.login::after {
  display: none;
}

.menu-list .user a.login:hover,
.menu-list .user a.login.router-link-exact-active {
  background: #f1edd2;
  color: #333f34;
}

header .div {
  display: flex;
  align-items: center;
  gap: 12px;
}


header .div a:last-child {
  display: none;
}


@media (min-width: 1281px) {
  header {
    box-shadow:
      0 6px 24px rgba(0, 0, 0, 0.2),
      inset 0 -1px 0 rgba(241, 237, 210, 0.18);
  }

  .overlay {
    align-self: center;
    height: 44px;
    padding-left: var(--espaco);
    border-left: 1px solid rgba(241, 237, 210, 0.25);
  }
}

/*============ Mobile / telas médias ===========*/
#menu-toggle,
.menu-icon,
.backdrop {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

div.linha {
  width: 25px;
  height: 3px;
  margin: 4px 0;
  background: #f1edd2;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.menu-icon:hover .linha {
  background: #9a9e70;
}

/*====================================
  MENU LATERAL (até 1280px)
  Em telas menores o menu não cabe numa linha só.
=====================================*/
@media (max-width: 1280px) {
  header {
    justify-content: space-between;
  }

  .menu-hamburguer {
    order: 1;
    flex: none;
  }

  header h1 {
    order: 2;
  }

  #menu-toggle {
    display: block;
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    margin: 0;
  }

  .menu-icon {
    display: block;
    cursor: pointer;
    padding: 10px 6px;
    border-radius: 8px;
  }

  #menu-toggle:focus-visible + .menu-icon {
    outline: 2px solid #f1edd2;
    outline-offset: 2px;
  }

  .overlay {

    --gaveta-fundo: #f7f3e1;
    --gaveta-texto: #333f34;
    --gaveta-icone: #536236;
    --gaveta-linha: rgba(51, 63, 52, 0.2);
    --gaveta-hover: rgba(83, 98, 54, 0.1);
    --gaveta-ativo: rgba(83, 98, 54, 0.18);
    --gaveta-botao-fundo: #536236;
    --gaveta-botao-texto: #f1edd2;
    --gaveta-botao-hover: #333f34;

    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    height: 100dvh;
    background-color: var(--gaveta-fundo);
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 14px;
    border-left: 0;
    transition: left 0.35s ease-in-out;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
    z-index: 1000;
    overflow-y: auto;
  }

  #menu-toggle:checked ~ .overlay {
    left: 0;
  }

  #menu-toggle:checked ~ .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(51, 63, 52, 0.28);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    z-index: 900;
  }

  .overlay a:focus-visible {
    outline-color: var(--gaveta-icone);
  }

  .menu-list {
    flex: 1 1 auto;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 2px;
  }

  .menu-list > li:first-child {
    margin-left: 0;
  }

  .menu-list a,
  header .div a:first-child {
    padding: 12px 14px;
    border-radius: 10px;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0;
    color: var(--gaveta-texto);
  }

  .menu-list a::after,
  header .div a:first-child::after {
    display: none;
  }

  .menu-list a:hover,
  header .div a:first-child:hover {
    background: var(--gaveta-hover);
  }

  .menu-list a.router-link-exact-active {
    background: var(--gaveta-ativo);
  }

  .menu-list i {
    display: inline-block;
    font-size: 1.25rem;
    color: var(--gaveta-icone);
  }


  .user {
    display: contents;
  }

  .user li:first-child:not(:last-child) {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--gaveta-linha);
  }

  .user li:last-child {
    margin-top: auto;
    padding-top: 12px;
  }

  .menu-list .user a.login {
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0;
    color: var(--gaveta-botao-texto);
    background: var(--gaveta-botao-fundo);
    border-color: var(--gaveta-botao-fundo);
  }

  .menu-list .user a.login:hover,
  .menu-list .user a.login.router-link-exact-active {
    color: var(--gaveta-botao-texto);
    background: var(--gaveta-botao-hover);
    border-color: var(--gaveta-botao-hover);
  }

  header .div {
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid var(--gaveta-linha);
  }

  header .div a:last-child {
    display: flex;
  }

  .overlay .logo {
    display: block;
    height: 48px;
    width: auto;
  }
}

/*====================================
     CELULAR (até 768px)
=====================================*/
@media (max-width: 768px) {
  header {
    height: 70px;
    padding: 0 16px;
  }

  header h1 img {
    height: 56px;
  }
}
</style>
