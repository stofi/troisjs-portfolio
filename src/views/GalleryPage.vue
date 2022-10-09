<template>
  <ObjectGallery enable-detail v-bind="gallery" @click="router.push('/')">
    <template #itemSlot="{ object }">
      <Plane
        :width="10"
        :height="10"
        :position="{
          x: 5,
          y: -5,
        }"
      >
        <BasicMaterial
          :props="{
            transparent: true,
            opacity: object.opacity,
          }"
        >
          <CanvasTexture :canvas-texture="object.texture"></CanvasTexture>
        </BasicMaterial>
      </Plane> </template
  ></ObjectGallery>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Vector3 } from 'three'
import { BasicMaterial, Plane, Texture } from 'troisjs'

import CanvasTexture from '@/components/CanvasTexture'
import type { GenericItem } from '@/components/Object/ObjectGallery.vue'
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
      title?: string
    }[]
  }
  html: string
}
const magicSeed = 420

const router = useRouter()

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
  // throw new Error('Invalid gallery id')
  router.push('/')
}

if (galleryId >= galleryFiles.length || galleryFiles[galleryId] === undefined) {
  // throw new Error('Gallery id out of range')
  router.push('/')
}

const gallery = reactive({
  seed: galleryId + magicSeed,
  speed: 0.5,
  scale: 1,
  images: galleryFiles[galleryId]
    ? galleryFiles[galleryId].attributes.images.map((image) => ({
        src: image.image,
        name: image.title ?? '',
      }))
    : [],
})
</script>
