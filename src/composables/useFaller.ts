import {
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  Ref,
  ref,
} from 'vue'

import { Vector3 } from 'three'
import { PhysicalMaterial, Plane, Texture } from 'troisjs'

import { map, random, seedRandom } from '@/utils'

interface FallerItem {
  position: Vector3
  opacity: number
  speed: number
}

export default function <Item extends FallerItem>(props: {
  bounds: Vector3
  seed: number
  speed: number
}) {
  const objects = ref<FallerItem[]>([])

  function generateObjects(items: Item[]) {
    const { bounds, seed } = props
    seedRandom(seed)

    items.forEach((item) => {
      const x = random() * bounds.x - bounds.x / 2
      const y = random() * bounds.y - bounds.y / 2
      const z = random() * bounds.z - bounds.z / 2

      objects.value.push({
        ...item,
        position: new Vector3(x, y, z),
      })
    })
  }

  const tick = () => {
    const { bounds, speed } = props

    objects.value.forEach((object) => {
      object.position.y -= 0.08 * object.speed * speed

      // snap to bounds
      if (object.position.y < -bounds.y / 2) {
        object.position.y = bounds.y / 2
        object.position.x = random() * bounds.x - bounds.x / 2
        object.position.z = random() * bounds.z - bounds.z / 2
      }
      const absY = Math.abs(object.position.y) / (bounds.y / 2)
      object.opacity = 1 - map(absY, 0.8, 1, 0, 1, true)
    })
  }

  const interval = ref(0)

  const startInterval = () => {
    interval.value = window.setInterval(() => {
      tick()
    }, 1000 / 60)
  }

  const stopInterval = () => {
    window.clearInterval(interval.value)
  }

  return {
    generateObjects,
    objects: objects as Ref<Item[]>,
    startInterval,
    stopInterval,
  }
}
