<template>
  <ObjectGallery
    v-bind="gallery"
    enable-detail
    :active="active"
    @click="onClick"
  >
  </ObjectGallery>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
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

const concatGalleryFiles: GenericItem[] = galleryFiles.map((file, i) => ({
  src: file.attributes.thumbnail,
  name: file.attributes.title,
  path: `/gallery/${i}`,
}))

const onClick = async (object: GalleryItem) => {
  const { src } = object

  if (object.detail) {
    alert('detail')
  }
}
const active = computed(() => store.pages.home.active)

const gallery = reactive({
  seed: 15,
  scale: 1.2,
  speed: 0.5,
  images: concatGalleryFiles,
})
</script>
