<template>
  <section class="funcionabilidade">
    <div class="conteudo">
      <img src="/logo-branca.png" alt="logo" />

      <div class="texto">
        <h2>Nosso objetivo</h2>
        <p>
          A NutriVitae tem como objetivo facilitar o acesso à saúde e à alimentação de qualidade,
          conectando pacientes a nutricionistas de forma simples, rápida e segura. Nossa plataforma
          foi desenvolvida para ajudar cada paciente a encontrar um profissional adequado às suas
          necessidades, permitindo pesquisar e conhecer nutricionistas de maneira prática. Queremos
          tornar a busca por acompanhamento nutricional mais acessível e contribuir para que mais
          pessoas encontrem o suporte necessário para cuidar da sua saúde e melhorar sua qualidade
          de vida.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.funcionabilidade {
  margin: 30px 0;
  width: 100%;
  padding: 50px clamp(20px, 5vw, 60px);
  color: #f1edd2;
  background:
    linear-gradient(135deg, rgba(137, 162, 91, 0.2), transparent 45%),
    #536236;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.conteudo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(30px, 5vw, 60px);
  max-width: 1000px;
  margin: 0 auto;
}

.conteudo img {
  width: clamp(180px, 22vw, 280px);
  height: auto;
  border-radius: 0;
  background: transparent;
  padding: 0;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
}

.texto {
  display: flex;
  flex-direction: column;
  /* Alinha os itens do bloco de texto ao centro */
  align-items: center;
}

.texto h2 {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 400;
  margin: 0 0 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  /* Centraliza o título "Nosso objetivo" */
  text-align: center;
}

.texto p {
  margin: 0;
  font-size: clamp(0.95rem, 1.2vw, 1.15rem);
  line-height: 1.6;
  /* Alinha o parágrafo ao centro ou justificado (escolha o que preferir) */
  text-align: center; 
}

@media (max-width: 768px) {
  .funcionabilidade {
    margin: 15px 0;
  }

  .conteudo {
    flex-direction: column;
  }
}
</style>