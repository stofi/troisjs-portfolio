import {
  computed,
  defineProps,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
  Ref,
  ref,
} from 'vue'

import gsap from 'gsap'
import { Vector3 } from 'three'
import { PhysicalMaterial, Plane, Texture } from 'troisjs'

import useStore from '@/composables/useStore'
import { map, random, seedRandom } from '@/utils'

interface FallerItem {
  position: Vector3
  opacity: number
  speed: number
}

export default function <Item extends FallerItem>(props: {
  seed: number
  speed: number
}) {
  const store = useStore()
  const objects = ref<FallerItem[]>([])
  const localspeed = ref(0.08)

  const bounds = reactive({
    x: 40,
    y: 40,
    z: 40,
  })

  store.onShuffle = () => {
    if (!started.value) return

    objects.value.forEach((object) => {
      const x = random() * bounds.x - bounds.x / 2
      // const y = random() * bounds.y - bounds.y / 2
      // const z = random() * bounds.z - bounds.z / 2

      gsap.to(object.position, {
        x,
        // y,
        // z,
        duration: 2,
        ease: 'power2.inOut',
      })
    })
  }

  const handleResize = () => {
    const aspect = window.innerWidth / window.innerHeight
    bounds.x = 40 * aspect
    bounds.y = 60
  }
  handleResize()

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  const page = reactive({
    items: [] as FallerItem[],
    step: 7,
    index: 0,
  })

  const createItem = (index: number) => {
    // wrap around
    const i = index % page.items.length
    const item = page.items[i]
    const x = random() * bounds.x - bounds.x / 2
    const y = random() * bounds.y - bounds.y / 2
    const z = random() * bounds.z - bounds.z / 2

    return {
      ...item,
      position: new Vector3(x, y, z),
    }
  }

  function generateObjects(items: Item[]) {
    page.items = items
    const { seed } = props
    seedRandom(seed)

    items.forEach((item, index) => {
      if (index >= page.step) return

      objects.value.push(createItem(index))
    })
    page.index = page.step
  }
  let prevTime = 0

  const moveObjects = (event: {
    type: 'beforerender'
    renderer: THREE.WebGLRenderer
    time: number
  }) => {
    const { speed } = props
    const { time } = event
    let delta = time - prevTime
    prevTime = time

    if (!started.value) {
      delta = 0
    }
    started.value = true

    objects.value.forEach((object) => {
      object.position.y -=
        localspeed.value * object.speed * speed * (delta / (1000 / 60))

      // snap to bounds
      if (object.position.y < -bounds.y / 2) {
        const item = createItem(page.index)
        item.position.y = bounds.y / 2
        Object.assign(object, item)
        page.index = (page.index + 1) % page.items.length
      }
      const absY = Math.abs(object.position.y) / (bounds.y / 2)

      // object.opacity = 1 - map(absY, 0.8, 1, 0, 1, true)
      gsap.to(object, {
        opacity: 1 - map(absY, 0.8, 1, 0, 1, true),
        duration: 0.5,
      })
    })
  }

  const started = ref(false)

  const start = () => {
    store.rendererComponent?.onBeforeRender(moveObjects)
  }

  const stop = () => {
    store.rendererComponent?.offBeforeRender(moveObjects)
    started.value = false
  }

  onMounted(() => {
    start()
  })

  onBeforeUnmount(() => {
    stop()
  })

  const toggle = () => {
    if (started.value) {
      stop()
    } else {
      start()
    }
  }

  return {
    generateObjects,
    objects: objects as Ref<Item[]>,
    start,
    stop,
    toggle,
    started,
  }
}
