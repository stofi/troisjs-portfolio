<template>
  <ObjectGallery v-bind="gallery" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import { Vector3 } from 'three'

import type { GalleryItem } from '@/components/Object/ObjectGallery.vue'
import ObjectGallery from '@/components/Object/ObjectGallery.vue'
import { random, seedRandom } from '@/utils'

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
    const aspect = width / height

    return {
      id: image.image,
      rotation: new Vector3(0, 0, 0),
      position: new Vector3(0, 0, 0),
      src: image.image,
      aspect,
      scale: 10,
    }
  })
}

const items = galleryFiles.length
  ? await Promise.all(mapImagesFromGallery(galleryFiles[0]))
  : []

const gallery = reactive({
  bounds: new Vector3(100, 100, 100),
  items,
  seed: undefined,
})
</script>
