<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mostrarAcessoAdministrador = ref(false)
const senhaAdministrador = ref('')
const erroSenha = ref('')

function abrirAcessoAdministrador() {
  senhaAdministrador.value = ''
  erroSenha.value = ''
  mostrarAcessoAdministrador.value = true
}

function fecharAcessoAdministrador() {
  mostrarAcessoAdministrador.value = false
  senhaAdministrador.value = ''
  erroSenha.value = ''
}

function discarNumero(numero) {
  if (senhaAdministrador.value.length >= 10) {
    return
  }

  senhaAdministrador.value += numero
  erroSenha.value = ''
}

function apagarNumero() {
  senhaAdministrador.value = senhaAdministrador.value.slice(0, -1)
  erroSenha.value = ''
}

function entrarComoAdministrador() {
  if (senhaAdministrador.value !== '777') {
    erroSenha.value = 'Senha incorreta.'
    return
  }

  fecharAcessoAdministrador()
  router.push({ path: '/buscar-suporte', query: { admin: 'true' } })
}
</script>

<template>
  <footer>
    <div class="footer-container">
      <!-- Redes -->
      <section class="col redes">
        <h2>Redes</h2>

        <a href="https://www.instagram.com/nutri_.vitae/" target="_blank">
          <i class="mdi mdi-instagram"></i>
          <span>@nutri_.vitae</span>
        </a>

        <a href="#">
          <i class="mdi mdi-facebook"></i>
          <span>nutriVitae</span>
        </a>
      </section>

      <!-- Centro -->
      <section class="col centro">
        <RouterLink to="/" class="logo-footer">
          <img src="/logo.png" alt="Logo" />
          <h2>NutriVitae</h2>
        </RouterLink>

        <div class="direitos">
          <p>
            &copy; Alguns direitos reservados<br />
            NutriVitae
          </p>

          <p>Desenvolvido por</p>

          <div class="equipe">
            <ul>
              <li>Bianca Holanda</li>
              <li>Felipe Hodecker</li>
              <li>Kauan Gunther</li>
            </ul>

            <ul>
              <li>Mizael Estevam</li>
              <li>Ruty Liandra</li>
              <li>Sara Schulz</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Contato -->
      <section class="col contato">
        <h2>Contato</h2>

        <div class="item">
          <i class="mdi mdi-email"></i>
          <span>nutri.vitae.26@gmail.com</span>
        </div>

        <div class="item">
          <i class="mdi mdi-phone-classic"></i>
          <span>+55 (47) 9 9206-7618</span>
        </div>

        <button
          type="button"
          class="item botao-administrador"
          aria-label="Abrir acesso do administrador"
          title="Acesso do administrador"
          @click="abrirAcessoAdministrador"
        >
          <i class="mdi mdi-hat-fedora" aria-hidden="true"></i>
          <span>Administrador</span>
        </button>
      </section>
    </div>
  </footer>

  <div
    v-if="mostrarAcessoAdministrador"
    class="acesso-overlay"
    role="presentation"
    @click.self="fecharAcessoAdministrador"
  >
    <form
      class="acesso-caixa"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-acesso-administrador"
      @submit.prevent="entrarComoAdministrador"
    >
      <button
        type="button"
        class="botao-fechar-acesso"
        aria-label="Fechar acesso do administrador"
        @click="fecharAcessoAdministrador"
      >
        <i class="mdi mdi-close" aria-hidden="true"></i>
      </button>
      <i class="mdi mdi-hat-fedora icone-acesso" aria-hidden="true"></i>
      <h2 id="titulo-acesso-administrador">Acesso do administrador</h2>
      <p class="instrucao-discador">Digite a senha no telefone</p>
      <div class="visor-discador" aria-live="polite">
        {{ senhaAdministrador ? '*'.repeat(senhaAdministrador.length) : '•••' }}
      </div>
      <div class="teclado-discador">
        <button
          v-for="numero in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']"
          :key="numero"
          type="button"
          class="tecla-discador"
          @click="discarNumero(numero)"
        >
          {{ numero }}
        </button>
        <button type="button" class="tecla-discador tecla-apagar" @click="apagarNumero">
          <i class="mdi mdi-backspace-outline" aria-hidden="true"></i>
          <span class="sr-only">Apagar</span>
        </button>
      </div>
      <p v-if="erroSenha" class="erro-senha" role="alert">{{ erroSenha }}</p>
      <button type="submit" class="botao-entrar-acesso">Entrar</button>
    </form>
  </div>
</template>

<style scoped>
footer {
  background: #536236;
  padding: 55px 70px;
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.45);
}

.acesso-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(16, 16, 16, 0.72);
  z-index: 2000;
}

.acesso-caixa {
  position: relative;
  width: min(100%, 380px);
  padding: 32px;
  border: 2px solid #9a9e70;
  border-radius: 14px;
  background: #f1edd2;
  color: #333f34;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

.botao-fechar-acesso {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 0;
  background: transparent;
  color: #536236;
  cursor: pointer;
  font-size: 1.5rem;
}

.icone-acesso {
  display: block;
  color: #73441b;
  font-size: 2.4rem;
  text-align: center;
}

.acesso-caixa h2 {
  margin: 12px 0 24px;
  color: #73441b;
  font-size: 1.7rem;
  text-align: center;
}

.instrucao-discador {
  margin-bottom: 8px;
  color: #536236;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  text-align: center;
}

.visor-discador {
  min-height: 46px;
  margin-bottom: 16px;
  padding: 9px 12px;
  border: 1px solid #9c8a6f;
  border-radius: 8px;
  background: #fffdf0;
  color: #333f34;
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.25rem;
  text-align: center;
}

.teclado-discador {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.tecla-discador {
  min-height: 44px;
  border: 1px solid #536236;
  border-radius: 50%;
  background: #536236;
  color: #f1edd2;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
}

.tecla-discador:hover,
.tecla-discador:focus-visible {
  background: #73441b;
}

.tecla-apagar {
  background: #73441b;
  font-size: 1.1rem;
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

.acesso-caixa label {
  display: block;
  margin-bottom: 6px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
}

.botao-administrador {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  height: auto;
  margin-top: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #f1edd2;
  cursor: pointer;
  font-size: 1.35rem;
  line-height: inherit;
  text-align: left;
  transition:
    opacity 0.2s ease,
    color 0.2s ease;
}

.botao-administrador:hover,
.botao-administrador:focus-visible {
  color: #9a9e70;
  opacity: 0.85;
}

.contato .botao-administrador i {
  font-size: 2rem;
}

.acesso-caixa input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #9c8a6f;
  border-radius: 8px;
  background: #fffdf0;
  color: #333f34;
  font-size: 1rem;
}

.erro-senha {
  margin: 8px 0 0;
  color: #9d2c25;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
}

.botao-entrar-acesso {
  width: 100%;
  margin-top: 22px;
  padding: 11px;
  border: 0;
  border-radius: 8px;
  background: #536236;
  color: #f1edd2;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  max-width: 1400px;
  margin: auto;
}

/*========================*/

.col {
  display: flex;
  flex-direction: column;
}

.col h2 {
  font-size: 2rem;
  font-weight: 400;
  color: #f6f0da;
  margin-bottom: 35px;
}

/*========================*/
/* REDES */

.redes a {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 28px;

  color: #f6f0da;
  text-decoration: none;
  font-size: 1.5rem;

  transition: 0.3s;
}

.redes a:hover {
  opacity: 0.7;
}

.redes i {
  font-size: 2rem;
}

/*========================*/
/* CENTRO */

.centro {
  align-items: center;
}

.logo-footer {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-decoration: none;
  color: #f6f0da;
}

.logo-footer img {
  width: 90px;

  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.35));
}

.logo-footer h2 {
  margin-top: 8px;
  margin-bottom: 35px;

  font-size: 2rem;
  font-weight: 400;
}

.direitos {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.direitos p {
  color: #f6f0da;
  font-size: 0.75rem;

  margin-bottom: 12px;
}

.equipe {
  display: flex;
  gap: 45px;
}

.equipe ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.equipe li {
  color: #f6f0da;
  font-size: 0.72rem;
  line-height: 1.6;
}

/*========================*/
/* CONTATO */

.contato .item {
  display: flex;
  align-items: center;

  gap: 12px;
  margin-bottom: 28px;

  color: #f6f0da;
  font-size: 1.35rem;
}

.contato i {
  font-size: 2rem;
}

/*========================*/

@media (max-width: 900px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }

  .redes,
  .contato {
    align-items: center;
  }
}
</style>