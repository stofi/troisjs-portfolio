import { ComponentPublicInstance, computed, reactive } from 'vue'

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
  enableSceneTilt: boolean
  deactivatePage: () => Promise<void>
  setPageActive: (name: PageName) => Promise<void>
  resetDetails: () => void
  onResetDetails?: () => void
  shuffle: () => void
  onShuffle?: () => void
  showArrowLeft: boolean
  showArrowRight: boolean
  showLink: boolean
  onClickLeft: () => void
  onClickRight: () => void
  onClickLink: () => void
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
  enableSceneTilt: false,
  async deactivatePage() {
    // find current active page
    const activePage = Object.values(store.pages).find((page) => page.active)
    if (!activePage) return
    // deactivate current page
    activePage.active = false
    await delay(500)
  },
  async setPageActive(name) {
    // find new page
    const newPage = store.pages[name]
    // activate new page
    newPage.active = true
  },
  resetDetails() {
    store.onResetDetails && store.onResetDetails()
  },
  shuffle() {
    store.onShuffle && store.onShuffle()
  },
  showArrowLeft: false,
  showArrowRight: false,
  showLink: false,
  onClickLeft() {
    //
  },
  onClickRight() {
    //
  },
  onClickLink() {
    //
  },
})

export default function () {
  return store
}
