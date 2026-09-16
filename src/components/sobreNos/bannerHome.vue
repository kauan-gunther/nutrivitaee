<script setup>
import SiteObjetivo from './siteObjetivo.vue'
import MembrosEquipe from './membrosEquipe.vue'
</script>

<template>
  <section class="banner">
    <h1>Equipe NutriVitae</h1>
  </section>

  <SiteObjetivo />
  <MembrosEquipe />
</template>

<style scoped>
.banner {
  min-height: calc(100vh - 80px); 
  width: 100%;
  background: url("/img/banner.jpeg") no-repeat center center/cover;
  position: relative;
  box-shadow: 0 0 75px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.banner h1 {
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  color: #f1edd2;
  margin: 0 20px;
  text-shadow: 10px 4px 10px rgba(0, 0, 0, 0.5);
  max-width: 900px;
  line-height: 1.15;
}

@media (max-width: 700px) {
  .banner {
    min-height: 78vh; 
    width: 100vw; 
    background-size: cover; 
    background-position: center;
    margin-left: calc(-50vw + 50%); 
  }

  .navBanner ul {
    display: none;
  }

  .banner h1 {
    margin: 0 16px;
    font-size: 40px;
  }
}
</style>