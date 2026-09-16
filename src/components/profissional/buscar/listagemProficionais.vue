<script setup>
import ProfissionalCard from "./ProfissionalCard.vue"

defineProps({
  profissionais: Array
})
</script>

<template>
  <div class="profissionais-grid">
    <ProfissionalCard
      v-for="profissional in profissionais"
      :key="profissional.id"
      :profissional="profissional"
    />
  </div>
</template>

<style scoped>
.profissionais-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
</style>
