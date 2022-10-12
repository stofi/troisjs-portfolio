<template>
  <Group :position="{ z: 40 }" :rotation="{ y: options.globalYRotation }">
    <Group :position="{ z: -40 }">
      <Group :position="galleryPosition">
        <Group
          v-for="object in objects"
          :key="object.id"
          :position="object.position"
        >
          <Plane
            :width="fitImage(object.aspect)"
            :height="object.aspect * fitImage(object.aspect)"
            :width-segments="1"
            :height-segments="1"
            @click="onClick(object, $event)"
          >
            <PhysicalMaterial
              color="#ffffff"
              :props="{
                roughness: 0.9,
                clearcoat: 0.02,
                clearcoatRoughness: 0.2,
                transparent: true,
                opacity: object.opacity * options.opacity,
              }"
            >
              <Texture :src="object.src" />
            </PhysicalMaterial>
          </Plane>
          <Group
            :position="{
              x: -fitImage(object.aspect) / 2 + 0.5,
              y: -(object.aspect * fitImage(object.aspect)) / 2 - 0.5,
              z: 0.01,
            }"
          >
            <Plane
              :width="8"
              :height="8"
              :position="{
                x: 4,
                y: -4,
              }"
            >
              <BasicMaterial
                :props="{
                  transparent: true,
                  opacity: object.opacity * options.opacity,
                }"
              >
                <CanvasTexture :canvas-texture="object.texture"></CanvasTexture>
              </BasicMaterial>
            </Plane>
          </Group>
        </Group>
      </Group>
    </Group>
  </Group>
</template>

<script lang="ts" setup>
import {
  computed,
  defineEmits,
  defineProps,
  onActivated,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'

import { useWindowSize } from '@vueuse/core'
import gsap from 'gsap'
import { CanvasTexture as CT, Vector3 } from 'three'
import { BasicMaterial, Group, PhysicalMaterial, Plane, Texture } from 'troisjs'

import CanvasTexture from '@/components/CanvasTexture'
import useFaller from '@/composables/useFaller'
import useStore from '@/composables/useStore'

export interface GalleryItem {
  position: Vector3
  id: string
  rotation: Vector3
  aspect: number
  src: string
  speed: number
  opacity: number
  color: string
  name: string
  texture: CT
  detail: boolean
  path: string
}

export interface GenericItem {
  src: string
  name: string
  path?: string
}

const props = defineProps<{
  seed: number
  speed: number
  scale: number
  images: string[] | GenericItem[]
  enableDetail: boolean
  active: boolean
}>()

const options = reactive({
  opacity: 1,
  globalYRotation: 0,
})
const router = useRouter()

watch(
  () => props.active,
  (active, wasActive) => {
    if (active && !wasActive) {
      options.globalYRotation = -Math.PI / 2

      gsap.to(options, {
        // globalYRotation: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.in',
      })
    } else if (!active && wasActive) {
      gsap.to(options, {
        // globalYRotation: Math.PI / 2,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        onComplete: () => {
          options.globalYRotation = 0
        },
      })
    }
  }
  // { immediate: true }
)

const { generateObjects, started, toggle, objects } =
  useFaller<GalleryItem>(props)

const randomHexColor = () =>
  '#' + Math.floor(Math.random() * 16777215).toString(16)

const paintTexture = (text: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  // write text from top left, white on transparent
  ctx.fillStyle = 'white'
  ctx.font = `bold 32px "Fira Code VF"`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 28)

  return new CT(canvas)
}
const windowSize = useWindowSize()

const screenAspect = computed(() => {
  return windowSize.height.value / windowSize.width.value
})

const fitImage = (aspect: number, scale = 20) => {
  const s = screenAspect.value > 1 ? scale / screenAspect.value : scale

  return aspect > 1
    ? // landscape
      s / aspect
    : // portrait
      s
}

const mapImagesFromGallery = (images: string[] | GenericItem[]) => {
  return images.map(async (image) => {
    const gi = typeof image === 'string' ? { src: image, name: image } : image
    const imageObject = new Image()
    imageObject.src = gi.src

    await new Promise((resolve) => {
      imageObject.onload = resolve
    })

    const { width, height } = imageObject
    const aspect = height / width

    return {
      id: gi.src,
      name: gi.name,
      rotation: new Vector3(0, 0, 0),
      position: new Vector3(0, 0, 0),
      src: gi.src,
      aspect,
      speed: 0.5,
      opacity: 0.1,
      color: randomHexColor(),
      texture: paintTexture(gi.name),
      detail: false,
      path: gi.path || '',
    }
  })
}

const items = await Promise.all(mapImagesFromGallery(props.images))

const emits = defineEmits<{
  (event: 'click', object: GalleryItem): void
}>()

const galleryPosition = ref<Vector3>(new Vector3(0, 0, 0))

interface ClickEvent {
  intersect: { distance: number }
}

interface ClickQueueEntry {
  object: GalleryItem
  event: ClickEvent
}

const clickQueue = ref<ClickQueueEntry[]>([])
const store = useStore()

store.onResetDetails = () => {
  if (started.value) return

  gsap.to(galleryPosition.value, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1,
    ease: 'power4.out',
  })
  toggle()
}

const onClick = (object: GalleryItem, event: ClickEvent) => {
  // if (!props.active) return

  clickQueue.value.push({ object, event })
}

const enterDetail = (object: GalleryItem) => {
  currentObject.value = object
  object.detail = true
  store.showArrowLeft = true
  store.showArrowRight = true

  if (object.path) {
    store.showLink = true

    store.onClickLink = () => {
      router.push(object.path)

      store.showLink = false

      store.onClickLink = () => {
        // router.push(object.path)
      }
    }
  }
  const screenAspect = window.innerWidth / window.innerHeight

  let zOffset = 30

  // change offset based on screen and object aspect
  if (screenAspect > 1) {
    // screen landscape
    if (object.aspect < 1) {
      // object landscape
      zOffset = 30
    } else {
      // object portrait
      zOffset = 20
    }
  } else {
    // screen portrait
    if (object.aspect < 1) {
      // object landscape
      zOffset = 20
    } else {
      // object portrait
      zOffset = 20
    }
  }

  gsap.to(galleryPosition.value, {
    x: -object.position.x,
    y: -object.position.y,
    z: -object.position.z + zOffset,
    duration: 1,
    ease: 'power4.out',
  })
  const z = object.position.z

  objects.value.forEach((o) => {
    o.detail = false

    gsap.to(o, {
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    })
  })

  gsap.to(object, {
    opacity: 1,
    duration: 1,
    ease: 'power4.out',
  })

  gsap.to(object.position, {
    z,
    duration: 1,
    ease: 'power4.out',
  })
}

const exitDetail = () => {
  if (currentObject.value) {
    currentObject.value = null
  }
  store.showLink = false
  store.showArrowLeft = false
  store.showArrowRight = false

  store.onClickLink = () => {
    //
  }

  gsap.to(galleryPosition.value, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1,
    ease: 'power4.out',
  })
}

const getRelativeIndex = (object: GalleryItem, relativeIndex: number) => {
  const index = objects.value.findIndex((o) => o.id === object.id)
  const newIndex = (index + relativeIndex) % objects.value.length

  return objects.value[newIndex]
}

const currentObject = ref<GalleryItem | null>(null)

const move = (relativeIndex: number) => {
  const object = currentObject.value

  if (!object) return

  const nextObject = getRelativeIndex(object, relativeIndex)
  enterDetail(nextObject)
}

const handleObjectClick = (object: GalleryItem) => {
  emits('click', object)
  if (!props.enableDetail) return

  if (started.value) {
    enterDetail(object)
  } else {
    exitDetail()
  }

  toggle()
}

store.rendererComponent?.onBeforeRender(() => {
  // if (!props.active) return

  if (clickQueue.value.length > 0) {
    // find object with smallest distance
    const { object, event } = clickQueue.value.reduce(
      (prev, curr) => {
        if (prev.event.intersect.distance < curr.event.intersect.distance) {
          return prev
        }

        return curr
      },
      { object: clickQueue.value[0].object, event: clickQueue.value[0].event }
    )
    clickQueue.value = []
    handleObjectClick(object)
  }
})

onMounted(() => {
  generateObjects(items)

  store.onClickLeft = () => {
    move(-1)
  }

  store.onClickRight = () => {
    move(1)
  }
})

onBeforeUnmount(() => {
  store.onClickLeft = () => {
    //
  }

  store.onClickRight = () => {
    //
  }
  store.showArrowLeft = false
  store.showArrowRight = false
})
</script>
