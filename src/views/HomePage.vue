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

const items: GalleryItem[] = new Array(100).fill(null).map((_, i) => {
  const width = ~~(random() * 300 + 100)
  const height = ~~(random() * 200 + 100)
  const aspect = height / width

  return {
    id: i.toString(),
    rotation: new Vector3(0, 0, 0),
    position: new Vector3(0, 0, 0),
    src: `https://picsum.photos/id/${i.toString()}/${width}/${height}`,
    aspect,
    scale: 10,
  }
})

const gallery = reactive({
  bounds: new Vector3(100, 100, 100),
  items,
  seed: undefined,
})
</script>
