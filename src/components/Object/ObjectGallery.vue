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
import { defineProps, onBeforeUnmount, onMounted, ref } from 'vue'

import { Vector3 } from 'three'
import { PhysicalMaterial, Plane, Texture } from 'troisjs'

import useFaller from '@/composables/useFaller'
import { map, random, seedRandom } from '@/utils'

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

const props = defineProps<{
  bounds: Vector3
  seed: number
  speed: number
  galleryFiles: Gallery
}>()

const { generateObjects, startInterval, stopInterval, objects } =
  useFaller<GalleryItem>(props)

const mapImagesFromGallery = (gallery: Gallery) => {
  return gallery.attributes.images.map(async (image) => {
    const imageObject = new Image()
    imageObject.src = image.image

    await new Promise((resolve) => {
      imageObject.onload = resolve
    })

    const { width, height } = imageObject
    const aspect = height / width

    return {
      id: image.image,
      rotation: new Vector3(0, 0, 0),
      position: new Vector3(0, 0, 0),
      src: image.image,
      aspect,
      scale: 10,
      speed: 0.5,
      opacity: 0.1,
    }
  })
}

const items = await Promise.all(mapImagesFromGallery(props.galleryFiles))

generateObjects(items)

onMounted(() => {
  startInterval()
})

onBeforeUnmount(() => {
  stopInterval()
})
</script>
