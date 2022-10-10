<template>
  <ObjectGallery v-bind="gallery" @click="onClick">
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
      </Plane>
    </template>
  </ObjectGallery>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { Vector3 } from 'three'
import { BasicMaterial, Plane, Texture } from 'troisjs'

import CanvasTexture from '@/components/CanvasTexture'
import type {
  GalleryItem,
  GenericItem,
} from '@/components/Object/ObjectGallery.vue'
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

const concatGalleryFiles: GenericItem[] = galleryFiles.map((file) => ({
  src: file.attributes.thumbnail,
  name: file.attributes.title,
}))

const onClick = (object: GalleryItem) => {
  const { src } = object

  if (object.detail) {
    const index = concatGalleryFiles.findIndex((item) => item.src === src)
    router.push(`/gallery/${index}`)
  }
}

const gallery = reactive({
  seed: 3,
  scale: 1.2,
  speed: 0.5,
  images: concatGalleryFiles,
  enableDetail: true,
})
</script>
