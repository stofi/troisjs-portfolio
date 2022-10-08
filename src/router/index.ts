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
      {
        path: '/:gallery',
        name: 'Gallery',
        component: () => import('../views/GalleryPage.vue'),
      },
    ],
  })

  return router
}

export default configureRouter
