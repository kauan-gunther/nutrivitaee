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
  box-sizing: border-box;
  padding: 0 15px;

  & h1 {
    font-size: 3.5rem;
    color: #73441B;
    margin-bottom: 10px;
    text-align: center;
  }

  & .pesquisa {
    display: flex;
    align-items: center;
    width: 85%;
    max-width: 900px;
    padding: 10px 20px;
    border-radius: 40px;
    background: #536236;
    margin: 20px 0 40px 0;
    box-sizing: border-box;

    & .pesquisa-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 20px;
      color: #F1EDD2;
    }

    & i {
      font-size: 26px;
      cursor: pointer;
      color: #F1EDD2;
    }

    & ::placeholder {
      color: #F1EDD2;
      opacity: 0.8;
    }
  }
}

/* ====================================
   ESTILOS PARA CELULAR (Responsividade)
===================================== */
@media (max-width: 768px) {
  .topo {
    padding: 0 10px;

    & h1 {
      font-size: 50px;
      margin-top: 50px;
      margin-bottom: 5px;
    }

    & .pesquisa {
      width: 95%;
      padding: 8px 16px;
      margin: 15px 0 25px 0;

      & .pesquisa-input {
        font-size: 16px;
      }

      & i {
        font-size: 22px;
      }
    }
  }
}
</style>