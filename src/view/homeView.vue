<script setup>
import BannerHome from '@/components/home/bannerHomeComponent.vue'
import ExplicacaoHome from '@/components/home/explicacaoHomeComponent.vue'
import HeroHome from '@/components/home/heroHomeComponent.vue'
import ComecarHome from '@/components/home/comecarComponent.vue'
import FuncionabilidadeHome from '@/components/home/funcionabilidadeHomeComponent.vue'
</script>

<template>
  <main class="home">
    <BannerHome />
    <ExplicacaoHome />
    <HeroHome />
    <ComecarHome />
    <FuncionabilidadeHome />
  </main>
</template>

<style scoped>
.home {
  /* Paleta (as suas cores, agora com nome) */
  --verde: #536236;
  --verde-escuro: #333F34;
  --creme: #F1EDD2;
  --marrom: #73441B;
  --sage: #8E996C;
  --sage-claro: #A8B388;
  --tinta: #26301F;
  --linha: rgba(51, 63, 52, 0.22);

  /* Espaço entre os blocos e margem lateral dos blocos arredondados */
  --gutter: clamp(12px, 2vw, 24px);

  display: flex;
  flex-direction: column;
  gap: var(--gutter);
  width: 100%;
}
</style>
