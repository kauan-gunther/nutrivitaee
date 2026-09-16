<script setup>
import { ref, computed } from 'vue'
import { profissionais } from '@/data/profissionais'
import ListaProfissionais from './listagemProficionais.vue'
import FiltroProfissionais from './barraDePesquisaProfissionais.vue'

const pesquisa = ref('')

const profissionaisCadastrados = JSON.parse(localStorage.getItem('cadastros') || '[]').filter(
  (cadastro) => cadastro.tag === 'nutricionista',
)

const todosProfissionais = [...profissionais, ...profissionaisCadastrados]

const profissionaisFiltrados = computed(() => {
  const termo = pesquisa.value.toLowerCase().trim()

  return todosProfissionais.filter((profissional) => {
    return (
      profissional.nome.toLowerCase().includes(termo) ||
      profissional.id.toString().includes(termo) ||
      profissional.formacoes?.some((formacao) => formacao.nome.toLowerCase().includes(termo)) ||
      profissional.especializacoes?.some((especializacao) =>
        especializacao.nome.toLowerCase().includes(termo),
      )
    )
  })
})
</script>

<template>
  <div class="container-busca">
    <FiltroProfissionais v-model="pesquisa" />
    <ListaProfissionais :profissionais="profissionaisFiltrados" />
  </div>
</template>

<style scoped>
.container-busca {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* ====================================
   ESTILOS PARA CELULAR (Responsividade)
===================================== */
@media (max-width: 768px) {
  .container-busca {
    padding: 10px;
    width: 100%;
  }
}
</style>