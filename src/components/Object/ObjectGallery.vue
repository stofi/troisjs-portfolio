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
    @click="onClick(object)"
  >
    <PhysicalMaterial
      color="#ffffff"
      :props="{
        roughness: 0.9,
        clearcoat: 0.02,
        clearcoatRoughness: 0.2,
        transparent: true,
        opacity: object.opacity,
      }"
    >
      <Texture :src="object.src" />
    </PhysicalMaterial>
  </Plane>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, onBeforeUnmount, onMounted, ref } from 'vue'

import { Vector3 } from 'three'
import { PhysicalMaterial, Plane, Texture } from 'troisjs'

import useFaller from '@/composables/useFaller'

export interface GalleryItem {
  position: Vector3
  id: string
  rotation: Vector3
  aspect: number
  src: string
  scale: number
  speed: number
  opacity: number
}

const props = defineProps<{
  bounds: Vector3
  seed: number
  speed: number
  scale: number
  images: string[]
}>()

const { generateObjects, startInterval, stopInterval, objects } =
  useFaller<GalleryItem>(props)

const mapImagesFromGallery = (images: string[]) => {
  return images.map(async (image) => {
    const imageObject = new Image()
    imageObject.src = image

    await new Promise((resolve) => {
      imageObject.onload = resolve
    })

    const { width, height } = imageObject
    const aspect = height / width

    return {
      id: image,
      rotation: new Vector3(0, 0, 0),
      position: new Vector3(0, 0, 0),
      src: image,
      aspect,
      scale: 10 * props.scale,
      speed: 0.5,
      opacity: 0.1,
    }
  })
}

const items = await Promise.all(mapImagesFromGallery(props.images))

const emits = defineEmits<{
  (event: 'click', object: GalleryItem): void
}>()

const onClick = (object: GalleryItem) => {
  emits('click', object)
}

generateObjects(items)

onMounted(() => {
  startInterval()
})

onBeforeUnmount(() => {
  stopInterval()
})
</script>
