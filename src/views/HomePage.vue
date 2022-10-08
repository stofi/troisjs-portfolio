<template>
  <ObjectGallery v-bind="gallery" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import { Vector3 } from 'three'

import ObjectGallery from '@/components/Object/ObjectGallery.vue'

const gallery = reactive({
  bounds: new Vector3(40, 80, 20),
  seed: 1,
  speed: 1,
})
</script>
