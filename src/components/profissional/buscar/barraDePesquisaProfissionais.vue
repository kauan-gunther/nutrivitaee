<script setup>
defineProps({
  modelValue: String
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
  <div class="topo">
    <h1>Buscar Perfil do Profissional</h1>

    <div class="pesquisa">
      <input type="text" placeholder="Nutricionista..." :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)" class="pesquisa-input" />
      <i class="mdi mdi-magnify"></i>
    </div>
  </div>
</template>

<style scoped>
.topo {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & h1 {
    font-size: 3.5rem;
    color: #73441B;
    margin-bottom: 10px;
  }

  & .pesquisa {
    display: flex;
    align-items: center;
    width: 85%;
    padding: 10px 20px;
    border-radius: 40px;
    background: #536236;
    margin: 20px 0 40px 0;

    & .pesquisa-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 20px;
    }

    & i {
      font-size: 26px;
      cursor: pointer;
    }

    & ::placeholder {
      color: #F1EDD2;
    }
  }
}
</style>
