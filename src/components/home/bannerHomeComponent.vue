<script setup>
function rolarParaEscolha() {
  const el = document.getElementById('secao-escolha')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="banner">
    <div class="texto">
      <h1>Acompanhamento nutricional</h1>
      <h2>Mais saúde, organização e qualidade de vida</h2>

      <div class="acoes">
        <button class="btn-comecar" type="button" @click="rolarParaEscolha">
          Começar agora
        </button>
        <RouterLink to="/login" class="btn-login">Já tenho conta</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  /* Parte da foto que não pode ser cortada. Exemplos: center, 50% 20%, left center */
  --foco: center;

  /* Colado nas margens: a foto vai do topo da tela (o menu fica transparente por cima dela)
     até o fim da tela (100svh = altura inteira da janela), sem faixa de fundo aparecendo.
     O margin-bottom negativo desfaz o espaço (gap) que a home deixa entre os blocos. */
  margin: 0 0 calc(var(--gutter) * -1);
  border-radius: 0;
  min-height: max(520px, 100svh);

  display: flex;
  align-items: flex-end;
  padding: clamp(28px, 5vw, 72px);
  /* Dois degradês escuros: um em cima (para o menu e a logo aparecerem bem)
     e um embaixo (atrás do texto). O resto da foto aparece limpo. */
  background:
    linear-gradient(180deg, rgba(38, 48, 31, 0.7) 0%, rgba(38, 48, 31, 0.4) 100px, rgba(38, 48, 31, 0) 240px),
    linear-gradient(0deg, rgba(38, 48, 31, 0.82) 0%, rgba(38, 48, 31, 0.45) 38%, rgba(38, 48, 31, 0) 70%),
    url("/banner-home.png") no-repeat var(--foco) / cover;
}

.texto {
  max-width: 760px;
}

.banner h1 {
  font-size: clamp(2.6rem, 7vw, 5.5rem);
  line-height: 1.02;
  color: var(--creme);
  margin: 0 0 16px;
}

.banner h2 {
  font-family: "Roboto", sans-serif;
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(241, 237, 210, 0.92);
  max-width: 34rem;
  margin: 0 0 28px;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.btn-comecar,
.btn-login {
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-comecar {
  font-weight: 500;
  color: var(--tinta);
  background: var(--creme);
  border: 1.5px solid var(--creme);
}

.btn-comecar:hover {
  background: #fff;
  border-color: #fff;
}

.btn-login {
  font-weight: 400;
  color: var(--creme);
  background: transparent;
  border: 1.5px solid rgba(241, 237, 210, 0.7);
}

.btn-login:hover {
  background: rgba(241, 237, 210, 0.16);
}

.btn-comecar:focus-visible,
.btn-login:focus-visible {
  outline: 3px solid var(--creme);
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .banner {
    min-height: max(480px, 100svh);
  }
}
</style>
