<template>
  <!-- 3D -->
  <Renderer
    ref="rendererRef"
    alpha
    resize="window"
    antialias
    :orbit-ctrl="{
      enableDamping: true,
      dampingFactor: 0.05,
      enableRotate: false,
      enablePan: false,
      enableZoom: false,
    }"
  >
    <Camera ref="cameraRef" :position="{ x: 0, y: 0, z: 60 }" />

    <Scene ref="sceneRef">
      <slot></slot>
    </Scene>
    <EffectComposer>
      <RenderPass />
      <UnrealBloomPass :strength="0.1" />
      <FilmPass :noise-intensity="0.01" />
    </EffectComposer>
  </Renderer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import {
  Camera,
  EffectComposer,
  FilmPass,
  PointLight,
  Renderer,
  RenderPass,
  Scene,
  UnrealBloomPass,
} from 'troisjs'

import useRenderer from '@/composables/useRenderer'
import useStore from '@/composables/useStore'

const store = useStore()

const { rendererRef, sceneRef, enableEffect } = useRenderer()
</script>
