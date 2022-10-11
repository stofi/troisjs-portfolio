<template>
  <ObjectGallery
    :active="store.pages.home.active"
    v-bind="gallery"
    @click="onClick"
  >
  </ObjectGallery>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

import type {
  GalleryItem,
  GenericItem,
} from '@/components/Object/ObjectGallery.vue'
import ObjectGallery from '@/components/Object/ObjectGallery.vue'
import useStore from '@/composables/useStore'

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

const store = useStore()
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

const onClick = async (object: GalleryItem) => {
  const { src } = object

  if (object.detail) {
    const index = concatGalleryFiles.findIndex((item) => item.src === src)
    await store.deactivatePage()
    await store.setPageActive('gallery')

    router.push(`/gallery/${index}`)
    object.detail = false
  }
}

const gallery = reactive({
  seed: 15,
  scale: 1.2,
  speed: 0.5,
  images: concatGalleryFiles,
  enableDetail: true,
})
</script>
