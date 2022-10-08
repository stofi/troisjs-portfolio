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

const concatGalleryFiles = galleryFiles.reduce(
  (acc, val) => ({
    ...acc,
    ...val,
    attributes: {
      ...acc.attributes,
      ...val.attributes,
      images: [...acc.attributes.images, ...val.attributes.images],
    },
  }),
  {
    attributes: {
      images: [],
    },
  } as unknown as Gallery
)

// filter out duplicates
concatGalleryFiles.attributes.images =
  concatGalleryFiles.attributes.images.filter(
    (image, index, self) =>
      index === self.findIndex((t) => t.image === image.image)
  )

const gallery = reactive({
  bounds: new Vector3(40, 80, 40),
  seed: 1,
  speed: 0.5,
  galleryFiles: concatGalleryFiles,
})
</script>
