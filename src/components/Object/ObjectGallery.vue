<template>
  <Group :position="galleryPosition">
    <Group
      v-for="object in objects"
      :key="object.id"
      :position="object.position"
    >
      <Plane
        :width="object.scale"
        :height="object.scale * object.aspect"
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
            opacity: object.opacity,
          }"
        >
          <Texture :src="object.src" />
        </PhysicalMaterial>
      </Plane>
      <Group
        :position="{
          x: -object.scale / 2 + 0.5,
          y: -(object.scale * object.aspect) / 2 - 0.5,
          z: 0.01,
        }"
      >
        <slot name="itemSlot" :object="object"></slot>
      </Group>
    </Group>
  </Group>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, ref } from 'vue'

import gsap from 'gsap'
import { CanvasTexture, Vector3 } from 'three'
import { BasicMaterial, Group, PhysicalMaterial, Plane, Texture } from 'troisjs'

import useFaller from '@/composables/useFaller'
import useStore from '@/composables/useStore'

export interface GalleryItem {
  position: Vector3
  id: string
  rotation: Vector3
  aspect: number
  src: string
  scale: number
  speed: number
  opacity: number
  color: string
  name: string
  texture: CanvasTexture
  detail: boolean
}

export interface GenericItem {
  src: string
  name: string
}

const props = defineProps<{
  seed: number
  speed: number
  scale: number
  images: string[] | GenericItem[]
  enableDetail: boolean
}>()

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
  ctx.font = 'bold 32px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 28)

  return new CanvasTexture(canvas)
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
      scale: 16 * props.scale,
      speed: 0.5,
      opacity: 0.1,
      color: randomHexColor(),
      texture: paintTexture(gi.name),
      detail: false,
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

const onClick = (object: GalleryItem, event: ClickEvent) => {
  // emits('click', object)
  clickQueue.value.push({ object, event })
}

store.rendererComponent?.onBeforeRender(() => {
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

    emits('click', object)
    if (!props.enableDetail) return

    if (started.value) {
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
      object.detail = true

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
    } else {
      gsap.to(galleryPosition.value, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power4.out',
      })
    }

    toggle()
  }
})

onMounted(() => {
  generateObjects(items)
})
</script>
