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
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
