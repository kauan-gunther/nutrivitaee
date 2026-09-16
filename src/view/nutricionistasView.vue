<script setup>
import HeroNutricionistas from '@/components/nutricionistas/heroNutricionistasComponent.vue'
import DiferencialNutricionistas from '@/components/nutricionistas/diferencialNutricionistasComponent.vue'
import DestaqueProfissionais from '@/components/nutricionistas/destaqueProfissionaisComponent.vue'
</script>

<template>
  <main class="nutricionistas">
    <HeroNutricionistas />
    <DiferencialNutricionistas />
    <TecnologiaNutricionistas />
    <DestaqueProfissionais />
  </main>
</template>

<style scoped>
.nutricionistas {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>