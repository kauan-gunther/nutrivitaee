import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/view/homeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/home',
      redirect: '/',
    },

    // --- AUTENTICAÇÃO E PERFIL DO USUÁRIO/PACIENTE ---
    {
      path: '/login',
      name: 'login-usuario',
      component: () => import('@/components/LoginUsuario/index.vue'),
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: () => import('@/components/LoginUsuario/CadastroView.vue'),
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/components/LoginUsuario/PerfilView.vue'),
    },
    {
      path: '/perfil/deletar',
      name: 'deletar-perfil',
      component: () => import('@/components/LoginUsuario/DeletarPerfilView.vue'),
    },

    // --- PROFISSIONAIS ---
    {
      path: '/cadastro-profissional',
      name: 'cadastro-profissional',
      component: () => import('@/components/profissional/cadastroProfissional.vue'),
    },
    {
      path: '/profissionais',
      name: 'profissionais',
      component: () => import('@/view/profissionaisView.vue'),
    },
    {
      path: '/profissional/:id',
      name: 'perfil-profissional',
      component: () => import('@/view/perfilProfissionalView.vue'),
    },
    {
      path: '/profissional/:id/edit',
      name: 'edit-perfil-profissional',
      component: () => import('@/components/profissional/edit/editProfissional.vue'),
    },
    {
      path: '/profissional/:id/delete',
      name: 'delete-perfil-profissional',
      component: () => import('@/components/profissional/delete/deleteProfissional.vue'),
    },

    // --- CONSULTAS E AGENDAMENTOS ---
    {
      path: '/meus-agendamentos',
      alias: '/agendamentos',
      name: 'meus-agendamentos',
      component: () => import('@/view/meusAgendamentosView.vue'), // 
    },
    {
      path: '/consultas',
      name: 'consultas',
      component: () => import('@/components/consultas/buscarComponent.vue'),
    },
    {
      path: '/consultas/:id/agendamento',
      alias: '/agendamento',
      name: 'agendamentoComponent',
      component: () => import('@/components/consultas/agendamentoComponent.vue'),
    },
    {
      path: '/consultas/:id/buscar',
      alias: '/buscar',
      name: 'buscarComponent',
      component: () => import('@/components/consultas/buscarComponent.vue'),
    },
    {
      path: '/consultas/:id/editar',
      alias: '/editar',
      name: 'editarComponent',
      component: () => import('@/components/consultas/editarComponent.vue'),
    },
    {
      path: '/consultas/:id/excluir',
      alias: '/excluir',
      name: 'excluirComponent',
      component: () => import('@/components/consultas/excluirComponent.vue'),
    },
    {
      path: '/consultas/:id/resumo',
      alias: '/resumo',
      name: 'resumoComponent',
      component: () => import('@/components/consultas/resumoComponent.vue'),
    },

    // --- PRATOS E RECEITAS ---
    {
      path: '/receitas-recomendadas',
      name: 'receitasRecomendadas',
      component: () => import('@/view/receitasRecomendadasView.vue'),
    },
    {
      path: '/pratos/:id/cadastro',
      name: 'cadastro-prato',
      component: () => import('@/components/pratos/cadastroComponents.vue'),
    },
    {
      path: '/pratos/receitas',
      name: 'receitas',
      component: () => import('@/components/pratos/cadastroComponents.vue'),
    },
    {
      path: '/pratos/buscar',
      name: 'buscar-pratos',
      redirect: '/receitas-recomendadas',
    },
    {
      path: '/pratos/:id/buscar',
      name: 'buscar-pratos-id',
      redirect: '/receitas-recomendadas',
    },
    {
      path: '/pratos/editar',
      name: 'editar-prato',
      component: () => import('@/components/pratos/editarComponents.vue'),
    },
    {
      path: '/pratos/excluir',
      name: 'excluir-prato',
      component: () => import('@/components/pratos/excluirComponents.vue'),
    },
    {
      path: '/pratos/ver-prato',
      name: 'ver-prato',
      component: () => import('@/components/pratos/visualizarComponents.vue'),
    },

    // --- SUporte ---

    {
      path: '/CadastroSuporte',
      name: 'CadastroSuporte',
      component: () => import("@/components/Suporte/cadastroSuporte.vue")
    },
    {
      path: '/buscar-suporte',
      name: 'BuscarSuporte',
      component: () => import("@/components/Suporte/buscarSuporte.vue")
    },
    {
      path: '/perfilSuporte',
      name: 'PerfilSuporte',
      component: () => import("@/components/Suporte/perfilSuporte.vue")
    },
    {
      path: '/CadastrarPreferencias',
      name: 'CadastrarPreferencias',
      component: () => import("@/components/preferencias/CadastrarPreferencias.vue"),
    },
    {
      path: '/PerfilPreferencias',
      name: 'PerfilPreferencias',
      component: () => import("@/components/preferencias/PerfilPreferencias.vue"),
    },
    {
      path: '/BuscarPreferencias',
      name: 'BuscarPreferencias',
      component: () => import("@/components/preferencias/BuscarPreferencias.vue"),
    },
    {
      path: '/AcademicCreate',
      name: 'AcademicCreate',
      component: () => import("@/components/academic/AcademicCreate.vue")
    },
    {
      path: '/AcademicEdit',
      name: 'AcademicEdit',
      component: () => import("@/components/academic/AcademicEdit.vue")
    },
    {
      path: '/AcademicViewCard',
      name: 'AcademicViewCard',
      component: () => import("@/components/academic/AcademicViewCard.vue")
    },
    {
      path: '/ConfirmDeleteModal',
      name: 'ConfirmDeleteModal',
      component: () => import("@/components/academic/ConfirmDeleteModal.vue")
    },

    // --- SOBRE NÓS ---
    {
      path: '/sobreNos',
      name: 'sobreNos',
      component: () => import('@/components/sobreNos/bannerHome.vue'),
    },

    // --- REDIRECIONAMENTO PADRÃO ---
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;