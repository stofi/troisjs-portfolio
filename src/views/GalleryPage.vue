<template>
  <ObjectGallery v-bind="gallery" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

import { Vector3 } from 'three'

import type { Gallery } from '@/components/Object/ObjectGallery.vue'
import ObjectGallery from '@/components/Object/ObjectGallery.vue'

const galleryModules = await import.meta.glob(
  '@/../content/_posts/gallery/*.md'
)

const galleryFiles = await Promise.all(
  Object.keys(galleryModules).map(
    (key) => galleryModules[key]() as Promise<Gallery>
  )
)
const route = useRoute()

const galleryId: number = parseInt(
  Array.isArray(route.params.gallery)
    ? route.params.gallery[0]
    : route.params.gallery
)

if (isNaN(galleryId)) {
  throw new Error('Invalid gallery id')
}

if (galleryId >= galleryFiles.length) {
  throw new Error('Gallery id out of range')
}

const gallery = reactive({
  bounds: new Vector3(40, 80, 40),
  seed: 1,
  speed: 0.5,
  galleryFiles: galleryFiles[galleryId] ? galleryFiles[galleryId] : [],
})
</script>
