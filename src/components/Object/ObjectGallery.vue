<template>
  <Plane
    v-for="object in objects"
    :key="object.id"
    receive-shadow
    cast-shadow
    :position="object.position"
    :width="object.scale"
    :height="object.scale * object.aspect"
    :width-segments="1"
    :height-segments="1"
    :rotation="object.rotation"
  >
    <PhysicalMaterial
      color="#ffffff"
      :props="{
        roughness: 0.9,
        clearcoat: 0.02,
        clearcoatRoughness: 0.2,
      }"
    >
      <Texture :src="object.src" />
    </PhysicalMaterial>
  </Plane>
</template>

<script lang="ts" setup>
import { computed, defineProps, onBeforeUnmount, onMounted, ref } from 'vue'

import { Vector3 } from 'three'
import { PhysicalMaterial, Plane, Texture } from 'troisjs'

import { random, seedRandom } from '@/utils'

export interface GalleryItem {
  position: Vector3
  id: string
  rotation: Vector3
  aspect: number
  src: string
  scale: number
  speed: number
}

const props = defineProps<{
  bounds: Vector3
  seed: number
  speed: number
}>()

const objects = ref<GalleryItem[]>([])

// const bounds = ref(new Vector3(1, 1, 1))
// const radius = ref(1)
const galleryModules = await import.meta.glob(
  '@/../content/_posts/gallery/*.md'
)

interface Gallery {
  attributes: {
    layout: string
    title: string
    date: string
    thumbnail: string
    rating: number
    images: {
      image: string
    }[]
  }
  html: string
}

const galleryFiles = await Promise.all(
  Object.keys(galleryModules).map(
    (key) => galleryModules[key]() as Promise<Gallery>
  )
)

const mapImagesFromGallery = (gallery: Gallery) => {
  return gallery.attributes.images.map(async (image) => {
    const imageObject = new Image()
    imageObject.src = image.image

    await new Promise((resolve) => {
      imageObject.onload = resolve
    })

    const { width, height } = imageObject
    const aspect = height / width

    return {
      id: image.image,
      rotation: new Vector3(0, 0, 0),
      position: new Vector3(0, 0, 0),
      src: image.image,
      aspect,
      scale: 10,
      speed: 0.5,
    }
  })
}

const items = galleryFiles.length
  ? await Promise.all(mapImagesFromGallery(galleryFiles[0]))
  : []

const generateObjects = () => {
  const { bounds, seed } = props
  const objects: GalleryItem[] = []
  seedRandom(seed)

  items.forEach((item) => {
    const x = random() * bounds.x - bounds.x / 2
    const y = random() * bounds.y - bounds.y / 2
    const z = random() * bounds.z - bounds.z / 2

    objects.push({
      ...item,
      position: new Vector3(x, y, z),
    })
  })

  return objects
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

objects.value = generateObjects()

onMounted(() => {
  startInterval()
})

onBeforeUnmount(() => {
  stopInterval()
})
</script>
