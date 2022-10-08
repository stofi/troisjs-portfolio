<template>
  <Plane
    v-for="object in objects"
    :key="object.id"
    :position="object.position"
    :width="object.scale"
    :height="object.scale * object.aspect"
    :width-segments="1"
    :height-segments="1"
    :rotation="object.rotation"
  >
    <BasicMaterial color="#ffffff">
      <Texture :src="object.src" />
    </BasicMaterial>
  </Plane>
</template>

<script lang="ts" setup>
import { computed, defineProps, onActivated, onMounted, ref } from 'vue'

import { Vector3 } from 'three'
import { BasicMaterial, Plane, Texture } from 'troisjs'

import { random, seedRandom } from '@/utils'

export interface GalleryItem {
  position: Vector3
  id: string
  rotation: Vector3
  aspect: number
  src: string
  scale: number
}

const props = defineProps<{
  items: GalleryItem[]
  bounds: Vector3
  seed: number | undefined
}>()

const objects = ref<GalleryItem[]>([])

const generateObjects = () => {
  const { bounds, seed, items } = props
  const objects: GalleryItem[] = []
  seedRandom(seed ?? 0)

  items.forEach((item) => {
    const x = random() * bounds.x - bounds.x / 2
    const y = random() * bounds.y - bounds.y / 2
    const z = random() * bounds.z - bounds.z / 2

    objects.push({
      ...item,
      position: new Vector3(x, y, z),
    })
  })

  console.log('generated objects', objects)

  return objects
}

onMounted(() => {
  objects.value = generateObjects()
})
</script>
