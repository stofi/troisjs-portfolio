<template>
  <ObjectGallery v-bind="gallery" @click="onClick" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { Vector3 } from 'three'

import type { GalleryItem } from '@/components/Object/ObjectGallery.vue'
import ObjectGallery from '@/components/Object/ObjectGallery.vue'

export interface Gallery {
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

const router = useRouter()

const galleryModules = await import.meta.glob(
  '@/../content/_posts/gallery/*.md'
)

const galleryFiles = await Promise.all(
  Object.keys(galleryModules).map(
    (key) => galleryModules[key]() as Promise<Gallery>
  )
)

const concatGalleryFiles = galleryFiles.map((file) => file.attributes.thumbnail)

const onClick = (object: GalleryItem) => {
  const { src } = object

  const index = concatGalleryFiles.indexOf(src)
  router.push(`/gallery/${index}`)
}

const gallery = reactive({
  seed: 3,
  scale: 2,
  speed: 0.5,
  images: concatGalleryFiles,
})
</script>
