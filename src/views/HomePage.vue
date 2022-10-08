<template>
  <ObjectGallery v-bind="gallery" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

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

const concatGalleryFiles = galleryFiles.map((file) => file.attributes.thumbnail)

const gallery = reactive({
  bounds: new Vector3(40, 80, 40),
  seed: 3,
  scale: 2,
  speed: 0.5,
  images: concatGalleryFiles,
})
</script>
