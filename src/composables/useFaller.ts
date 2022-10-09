import {
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  reactive,
  Ref,
  ref,
} from 'vue'

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

  const bounds = reactive({
    x: 40,
    y: 40,
    z: 40,
  })

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
    step: 10,
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
    const delta = time - prevTime
    prevTime = time

    objects.value.forEach((object) => {
      object.position.y -= 0.16 * object.speed * speed * (delta / (1000 / 60))

      // snap to bounds
      if (object.position.y < -bounds.y / 2) {
        const item = createItem(page.index)
        item.position.y = bounds.y / 2
        Object.assign(object, item)
        page.index = (page.index + 1) % page.items.length
      }
      const absY = Math.abs(object.position.y) / (bounds.y / 2)
      object.opacity = 1 - map(absY, 0.8, 1, 0, 1, true)
    })
  }

  const start = () => {
    store.rendererComponent?.onBeforeRender(moveObjects)
  }

  const stop = () => {
    store.rendererComponent?.offBeforeRender(moveObjects)
  }

  onMounted(() => {
    start()
  })

  onBeforeUnmount(() => {
    stop()
  })

  return {
    generateObjects,
    objects: objects as Ref<Item[]>,
    start,
    stop,
  }
}
