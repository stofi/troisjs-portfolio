import { ComponentPublicInstance, reactive } from 'vue'

import gsap from 'gsap'
import { Vector3, WebGLRenderer } from 'three'
import { Renderer } from 'troisjs'

const startDate = new Date('1999-12-22T08:01').getTime()

interface Page {
  active: boolean
  position: Vector3
  rotation: Vector3
}

type PageName = 'home' | 'gallery'

type Pages = Record<PageName, Page>

interface Store {
  texts: string[]
  renderer?: WebGLRenderer
  rendererComponent?: ComponentPublicInstance<typeof Renderer>
  pages: Pages
  deactivatePage: () => Promise<void>
  setPageActive: (name: PageName) => Promise<void>
}

// { x: Math.PI / 2 + (23.4 / 180) * Math.PI }
const store = reactive<Store>({
  texts: [],
  pages: {
    home: {
      active: true,
      position: new Vector3(0, 0, 0),
      rotation: new Vector3(0, 0, 0),
    },
    gallery: {
      active: false,
      position: new Vector3(0, 0, 0),
      rotation: new Vector3(0, 0, 0),
    },
  },
  async deactivatePage() {
    // find current active page
    const activePage = Object.values(store.pages).find((page) => page.active)
    if (!activePage) return
    // deactivate current page
    activePage.active = false
  },
  async setPageActive(name) {
    console.log('setPageActive', name)

    // find new page
    const newPage = store.pages[name]
    // activate new page
    newPage.active = true
  },
})

export default function () {
  return store
}
