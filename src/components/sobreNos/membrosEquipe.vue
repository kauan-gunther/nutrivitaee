<script setup>
import { ref } from 'vue'

const membroSelecionado = ref(null)

const membros = [
  {
    nome: 'Bianca De Jesus',
    turma: '2info2',
    github: 'Bianca161',
    email: 'bianca@gmail.com',
    foto: '/membros/Bianca.jpeg',
  },
  {
    nome: 'Felipe Hodecker',
    turma: '2info2',
    github: 'feliperr12',
    email: 'fhs.felipe.123@gmail.com',
    foto: '/membros/Felipe.png',
  },
  {
    nome: 'Kauan Gunther',
    turma: '2info2',
    github: 'kauan-gunther',
    email: 'kauangunther11@gmail.com',
    foto: '/membros/Kauan.png',
  },
  {
    nome: 'Mizael Estevam',
    turma: '2info2',
    github: 'mizaelestevam',
    email: 'vambastter14@gmail.com',
    foto: '/membros/Mizael.png',
  },
  {
    nome: 'Ruty Liandra',
    turma: '2info2',
    github: 'ruty-ruby',
    email: 'rutyliandra83@gmail.com',
    foto: '/membros/Ruty.png',
  },
  {
    nome: 'Sara Schulz',
    turma: '2info2',
    github: 'saraSchulz',
    email: 'saraifc2024@gmail.com',
    foto: '/membros/sara.png',
  },
]

function selecionarMembro(membro) {
  membroSelecionado.value = membro
}

function voltar() {
  membroSelecionado.value = null
}
</script>

<template>
  <section class="nossoEquipe">
    <div class="wrap" :class="{ ativo: membroSelecionado }">
      <div class="cartao">
        <div class="lista">
          <h3>Membros:</h3>
          <ul>
            <li
              v-for="m in membros"
              :key="m.nome"
              @click="selecionarMembro(m)"
              :class="{ selecionado: membroSelecionado?.nome === m.nome }"
            >
              {{ m.nome }}
              <span v-if="membroSelecionado?.nome === m.nome" class="mdi mdi-menu-right"></span>
            </li>
          </ul>
        </div>

        <transition name="fade">
          <div class="detalhes" v-if="membroSelecionado">
            <img class="foto" :src="membroSelecionado.foto" :alt="membroSelecionado.nome" />
            <p class="linha">EMAIL: <span>{{ membroSelecionado.email }}</span></p>
            <p class="linha">SALA: <span>{{ membroSelecionado.turma }}</span></p>
            <p class="linha github">
              <i class="mdi mdi-github"></i>
              <span>{{ membroSelecionado.github }}</span>
            </p>
            <button @click="voltar"><i class="mdi mdi-menu-left"></i> Voltar</button>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<style scoped>

.nossoEquipe {
  margin: 30px 0 60px;
  width: 100%;
  padding: 60px clamp(20px, 6vw, 80px);
  color: #f1edd2;
  background: linear-gradient(135deg, #536236 0%, #7E9552 50%, #536236 78%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
}

.wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.cartao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  width: 100%;
  max-width: 480px;
  transition: all 0.3s ease;
}

.wrap.ativo .cartao {
  max-width: 850px;
  padding: 20px;
}

.lista {
  flex: 1;
  min-width: 0;
}

.lista h3 {
  margin: 0 0 20px;
  color: #f1edd2;
  font-size: 2rem; 
  font-weight: 400;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.05em;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
}

.wrap.ativo .lista h3 {
  text-align: left;
}

.lista ul {
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
}

.wrap.ativo .lista ul {
  text-align: left;
}

.lista li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 0;
  color: #f1edd2;
  font-size: 1.4rem; 
  cursor: pointer;
  transition: all 0.2s ease;
}

.wrap.ativo .lista li {
  justify-content: flex-start;
}

.lista li:hover {
  color: #ffffff;
  transform: translateX(3px);
}

.lista li.selecionado {
  color: #ffffff;
  font-size: 1.65rem;
  font-weight: 600;
}

.lista li span {
  font-size: 1.5rem;
}

.detalhes {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 260px;
}

.foto {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f1edd2;
  background: #7f8f66;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.linha {
  margin: 6px 0;
  font-size: 1rem;
  letter-spacing: 0.03em;
  color: #f1edd2;
}

.linha span {
  font-weight: 600;
}

.github {
  color: #7fc7f2;
  display: flex;
  align-items: center;
  justify-content: center; 
  gap: 6px;
}

.github span {
  text-decoration: underline;
  cursor: pointer;
}

.detalhes button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  padding: 8px 16px;
  border: 1px solid #f1edd2;
  color: #f1edd2;
  background: transparent;
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.detalhes button:hover {
  color: #536236;
  background: #f1edd2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .nossoEquipe {
    margin: 20px 0 40px;
  }

  .wrap.ativo .cartao {
    flex-direction: column;
    max-width: 100%;
  }

  .wrap.ativo .lista h3,
  .wrap.ativo .lista ul {
    text-align: center;
  }

  .wrap.ativo .lista li {
    justify-content: center;
  }
}
</style>