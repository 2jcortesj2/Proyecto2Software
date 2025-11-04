import { createRouter, createWebHistory } from 'vue-router'
import PacientesView from '../views/PacientesView.vue'
import LaboratoristasView from '../views/LaboratoristasView.vue'
import ResultadosView from '../views/ResultadosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/pacientes'
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: PacientesView
    },
    {
      path: '/laboratoristas',
      name: 'laboratoristas',
      component: LaboratoristasView
    },
    {
      path: '/resultados',
      name: 'resultados',
      component: ResultadosView
    }
  ]
})

export default router