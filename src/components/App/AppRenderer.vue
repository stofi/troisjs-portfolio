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
    <Camera
      ref="cameraRef"
      :far="200"
      :near="10"
      :position="{ x: 0, y: 0, z: 50 }"
    />

    <Scene ref="sceneRef">
      <DirectionalLight :position="{ x: 20, y: 20, z: 60 }" :intensity="1" />
      <Group :rotation="sceneTilt">
        <slot></slot>
      </Group>
    </Scene>
    <EffectComposer>
      <RenderPass />
      <UnrealBloomPass :strength="0.1" />
      <FilmPass :noise-intensity="0.01" />
    </EffectComposer>
  </Renderer>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { Vector2, Vector3 } from 'three'
import {
  Camera,
  DirectionalLight,
  EffectComposer,
  FilmPass,
  Group,
  Renderer,
  RenderPass,
  Scene,
  UnrealBloomPass,
} from 'troisjs'

import useRenderer from '@/composables/useRenderer'
import useStore from '@/composables/useStore'

const store = useStore()
const tiltStrength = 0.02
const { rendererRef, sceneRef, enableEffect } = useRenderer()
const sceneTilt = ref<Vector3>(new Vector3(0, 0, 0))

const onBeforeRender = () => {
  const renderer = rendererRef.value
  if (!renderer) return
  const normalizedPointer = renderer.three.pointer.positionN as Vector2
  sceneTilt.value.x = normalizedPointer.y * -tiltStrength
  sceneTilt.value.y = normalizedPointer.x * tiltStrength
}

onMounted(() => {
  rendererRef.value?.onBeforeRender(onBeforeRender)
})

onBeforeUnmount(() => {
  rendererRef.value?.offBeforeRender(onBeforeRender)
})
</script>
