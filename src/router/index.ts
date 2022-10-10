import { createRouter, createWebHistory } from 'vue-router'

import useStore from '@/composables/useStore'

import Home from '../views/HomePage.vue'

const store = useStore()

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
        path: '/gallery/:gallery',
        name: 'Gallery',
        component: () => import('../views/GalleryPage.vue'),
      },
    ],
  })

  router.beforeEach(async (to, from) => {
    console.log('router.beforeEach', to, from)
    await store.deactivatePage()
  })

  router.afterEach(async (to, from) => {
    console.log('router.afterEach', to, from)

    if (to.name === 'Home') {
      store.setPageActive('home')
    } else if (to.name === 'Gallery') {
      store.setPageActive('gallery')
    }
  })

  return router
}

export default configureRouter
