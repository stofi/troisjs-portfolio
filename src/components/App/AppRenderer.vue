<template>
  <!-- 3D -->
  <Renderer
    ref="rendererRef"
    alpha
    resize="window"
    antialias
    shadow
    :orbit-ctrl="{
      enableDamping: true,
      dampingFactor: 0.05,
      enableRotate: false,
    }"
  >
    <Camera ref="cameraRef" :position="{ x: 0, y: 0, z: 50 }" />

    <Scene ref="sceneRef">
      <DirectionalLight
        cast-shadow
        :position="{ x: 20, y: 20, z: 60 }"
        :intensity="1"
        :shadow-map-size="{ width: 1024, height: 1024 }"
      />
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
  DirectionalLight,
  EffectComposer,
  FilmPass,
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
