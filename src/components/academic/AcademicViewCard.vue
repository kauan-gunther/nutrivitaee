<script setup>
defineProps({
  dados: Object
})

const emit = defineEmits(['editar', 'excluir'])
</script>

<template>
  <div class="card-box">
    <div class="academic-card">
      <div class="card-header">{{ 'NUTRIÇÃO CLÍNICA' }}</div>
      
      <div class="card-body">
        <div class="diploma-frame">
          <img v-if="dados.diplomaFoto" :src="dados.diplomaFoto" alt="Diploma" class="diploma-img" />
          <div v-else class="diploma-placeholder">
            <span class="diploma-tag">Diploma de Graduação</span>
            <span class="diploma-name">{{ dados.nome }}</span>
          </div>
        </div>

        <div class="details-column">
          <div class="user-header">
            <div class="perfil-avatar">
              <img v-if="dados.fotoPerfil" :src="dados.fotoPerfil" alt="Foto Perfil" class="avatar-img" />
              <div v-else class="avatar-fallback">👤</div>
            </div>
            <div class="pill flex-grow">
              <span class="label-fixo">Nome:</span> 
              <span class="dado-dinamico">{{ dados.nome }}</span>
            </div>
          </div>

          <div class="pill">
            <span class="label-fixo">Curso:</span> 
            <span class="dado-dinamico">{{ dados.curso }}</span>
          </div>
          <div class="pill">
            <span class="label-fixo">Instituição:</span> 
            <span class="dado-dinamico">{{ dados.instituicao }}</span>
          </div>
          <div class="pill">
            <span class="label-fixo">Número do Diploma/Registro:</span> 
            <span class="dado-dinamico">{{ dados.registro }}</span>
          </div>
          <div class="pill">
            <span class="label-fixo">Grau Académico:</span> 
            <span class="dado-dinamico">{{ dados.grau }}</span>
          </div>
          
          <div class="card-actions">
            <button @click="emit('editar')" class="btn-sm">editar</button>
            <button @click="emit('excluir')" class="btn-sm">excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  text-shadow: none !important;
}

.card-box { 
  width: 100%; 
  max-width: 850px; 
  margin: 0 auto; 
}

.academic-card { 
  background: #74835a; 
  border-radius: 12px; 
  padding: 20px; 
  box-shadow: 0 6px 15px rgba(0,0,0,0.15); 
}

.card-header { 
  text-align: center; 
  font-weight: bold; 
  font-size: 1.2rem; 
  color: #333F34; 
  margin-bottom: 15px; 
  letter-spacing: 1px; 
  text-transform: uppercase; 
}

.card-body { 
  display: grid; 
  grid-template-columns: 260px 1fr; 
  gap: 20px; 
  align-items: center; 
}

.diploma-frame { 
  width: 260px; 
  height: 180px; 
  background: #fff; 
  border: 4px solid #c8b896; 
  border-radius: 6px; 
  overflow: hidden; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}

.diploma-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.diploma-placeholder { 
  text-align: center; 
  padding: 10px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
}

.diploma-tag { 
  font-size: 10px; 
  color: #333F34; 
}

.diploma-name { 
  font-family: 'Georgia', serif; 
  font-size: 14px; 
  font-weight: bold; 
  color: #73441B; 
}

.details-column { 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
}

.user-header { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.perfil-avatar { 
  width: 45px; 
  height: 45px; 
  border-radius: 50%; 
  overflow: hidden; 
  background: #dcd0bc; 
  flex-shrink: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border: 2px solid #dcd0bc; 
}

.avatar-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.avatar-fallback { 
  font-size: 1.2rem; 
}

.flex-grow { 
  flex: 1; 
}

.pill { 
  background: #dcd0bc; 
  padding: 10px 15px; 
  border-radius: 12px; 
  font-size: 0.9rem; 
  display: flex;
  gap: 6px;
  align-items: center;
}

.label-fixo {
  color: #333F34;
  font-weight: bold;
}

.dado-dinamico {
  color: #73441B;
  font-weight: 600;
}

.card-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 12px; 
  margin-top: 5px; 
}

.btn-sm { 
  background: #8c9c6d; 
  color: #333F34; 
  border: none; 
  padding: 6px 20px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: 600; 
}

.btn-sm:hover {
  color: #73441B;
}
</style>
