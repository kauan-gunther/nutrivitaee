const profissionais = [
  {
    id: 1,
    nome: "Marcos Oliveira Santos",
    cpf: "234.567.890-11",
    email: "marcosoliveira@gmail.com",
    telefone: "(21) 97634-3210",
    dataNascimento: "1988-11-27",
    foto: "/profissionais/marcos.png",

    formacoes: [
      { tipo: "Graduação", nome: "Bacharelado em Nutrição" },
      { tipo: "Pós-Graduação", nome: "Comportamento Alimentar" },
      { tipo: "Graduação", nome: "Nutrição Clínica e Esportiva" }
    ],

    especializacoes: [
      { tipo: "Curso", nome: "Suplementação Esportiva" },
      { tipo: "Especialização", nome: "Nutrição Comportamental" },
      { tipo: "Curso", nome: "Gastronomia Funcional" }
    ]
  },

  {
    id: 2,
    nome: "Ana Beatriz Silva",
    cpf: "123.456.789-00",
    email: "anabeatriz@gmail.com",
    telefone: "(11) 98763-4321",
    dataNascimento: "1995-05-15",
    foto: "/profissionais/ana.png",

    formacoes: [
      { tipo: "Graduação", nome: "Bacharelado em Nutrição" },
      { tipo: "Pós-Graduação", nome: "Obesidade e Emagrecimento" },
      { tipo: "Pós-Graduação", nome: "Nutrição Esportiva e Obesidade" }
    ],

    especializacoes: [
      { tipo: "Curso", nome: "Academia da Obesidade" },
      { tipo: "Curso", nome: "Internacional da Obesidade" },
      { tipo: "Especialização", nome: "Nutrição Materno-Infantil" }
    ]
  },

  {
    id: 3,
    nome: "Juliana Rocha",
    cpf: "456.123.789-22",
    email: "julianarocha@gmail.com",
    telefone: "(31) 98845-7612",
    dataNascimento: "1992-03-18",
    foto: "/profissionais/juliana.png",

    formacoes: [
      { tipo: "Graduação", nome: "Bacharelado em Nutrição" },
      { tipo: "Pós-Graduação", nome: "Nutrição Clínica" },
      { tipo: "Especialização", nome: "Emagrecimento Saudável" }
    ],

    especializacoes: [
      { tipo: "Área", nome: "Saúde da Mulher" },
      { tipo: "Área", nome: "Nutrição Funcional" },
      { tipo: "Área", nome: "Educação Alimentar" }
    ]
  },

  {
    id: 4,
    nome: "Carlos Henrique Souza",
    cpf: "321.654.987-44",
    email: "carloshenrique@gmail.com",
    telefone: "(41) 99781-4532",
    dataNascimento: "1986-09-08",
    foto: "/profissionais/carlos.png",

    formacoes: [
      { tipo: "Graduação", nome: "Bacharelado em Nutrição" },
      { tipo: "Pós-Graduação", nome: "Nutrição Esportiva" },
      { tipo: "Especialização", nome: "Performance" }
    ],

    especializacoes: [
      { tipo: "Área", nome: "Hipertrofia" },
      { tipo: "Área", nome: "Nutrição para Atletas" },
      { tipo: "Curso", nome: "Suplementação Esportiva" }
    ]
  },

  {
    id: 5,
    nome: "Fernanda Lima",
    cpf: "987.654.321-55",
    email: "fernandalima@gmail.com",
    telefone: "(51) 99123-6754",
    dataNascimento: "1993-12-04",
    foto: "/profissionais/fernanda.png",

    formacoes: [
      { tipo: "Graduação", nome: "Bacharelado em Nutrição" },
      { tipo: "Pós-Graduação", nome: "Nutrição Materno-Infantil" },
      { tipo: "Especialização", nome: "Alimentação Infantil" }
    ],

    especializacoes: [
      { tipo: "Área", nome: "Gestantes" },
      { tipo: "Área", nome: "Primeira Infância" },
      { tipo: "Área", nome: "Introdução Alimentar" }
    ]
  },

  {
    id: 6,
    nome: "Gabriel Mendes",
    cpf: "654.321.987-66",
    email: "gabrielmendes@gmail.com",
    telefone: "(61) 99887-3344",
    dataNascimento: "1990-07-29",
    foto: "/profissionais/gabriel.png",

    formacoes: [
      { tipo: "Graduação", nome: "Bacharelado em Nutrição" },
      { tipo: "Pós-Graduação", nome: "Nutrição Clínica" },
      { tipo: "Especialização", nome: "Nutrição Hospitalar" }
    ],

    especializacoes: [
      { tipo: "Área", nome: "Doenças Crônicas" },
      { tipo: "Área", nome: "Nutrição Enteral" },
      { tipo: "Área", nome: "Recuperação Nutricional" }
    ]
  }
]

export { profissionais }
