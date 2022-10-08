import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/HomePage.vue'

const configureRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
    ],
  })

  return router
}

export default configureRouter
