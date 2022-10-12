<template>
  <!-- 3D -->
  <Renderer ref="rendererRef" alpha resize="window" antialias>
    <Scene ref="sceneRef">
      <Group>
        <Camera ref="cameraRef" :far="200" :near="10" />
      </Group>

      <Group :position="{ x: 0, y: 0, z: 0 }" :rotation="sceneTilt">
        <DirectionalLight :position="{ x: 20, y: 20, z: 60 }" :intensity="1" />
        <Group :position="{ x: 0, y: 0, z: -50 }">
          <slot></slot>
        </Group>
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
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

import { useDeviceOrientation } from '@vueuse/core'
import { Euler, Quaternion, Vector2, Vector3 } from 'three'
import {
  BasicMaterial,
  Box,
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

const initialDirection = ref<Quaternion | null>(null)
const currentDirection = ref<Quaternion | null>(null)

const { isAbsolute, alpha, beta, gamma } = useDeviceOrientation()

const store = useStore()
const tiltStrength = 0.04
const { rendererRef, sceneRef, enableEffect } = useRenderer()
const sceneTilt = ref<Vector3>(new Vector3(0, 0, 0))

const onBeforeRender = () => {
  const renderer = rendererRef.value
  if (!renderer) return
  const normalizedPointer = renderer.three.pointer.positionN as Vector2
  sceneTilt.value.x = normalizedPointer.y * -tiltStrength
  sceneTilt.value.y = normalizedPointer.x * tiltStrength

  if (alpha.value && beta.value && gamma.value) {
    if (!initialDirection.value) {
      // create a quaternion from the euler angles

      const a = alpha.value * (Math.PI / 180)
      const b = beta.value * (Math.PI / 180)
      const c = gamma.value * (Math.PI / 180)
      const euler = new Euler(b, a, -c, 'YXZ')
      const quaternion = new Quaternion()
      quaternion.setFromEuler(euler)
      initialDirection.value = quaternion
    } else {
      if (!currentDirection.value) currentDirection.value = new Quaternion()

      // create a quaternion from the euler angles
      const a = alpha.value * (Math.PI / 180)
      const b = beta.value * (Math.PI / 180)
      const c = gamma.value * (Math.PI / 180)
      const euler = new Euler(b, a, -c, 'YXZ')
      const quaternion = new Quaternion()
      quaternion.setFromEuler(euler)
      currentDirection.value = quaternion

      // calculate the difference between the initial and current direction
      const diff = new Quaternion()
      diff.copy(initialDirection.value)
      diff.invert()
      diff.multiply(currentDirection.value)
      // apply the difference to the sceneTilt
      // limit the rotation to few degrees
      const euler2 = new Euler()
      euler2.setFromQuaternion(diff)
      euler2.x = Math.min(Math.max(euler2.x, -0.5), 0.5)
      euler2.y = Math.min(Math.max(euler2.y, -0.5), 0.5)
      euler2.z = Math.min(Math.max(euler2.z, -0.5), 0.5)
      // apply the euler to the sceneTilt
      sceneTilt.value.x = euler2.x * tiltStrength
      sceneTilt.value.y = euler2.y * tiltStrength
      sceneTilt.value.z = euler2.z * tiltStrength
      // sceneTilt.value.applyQuaternion(diff)
    }
  }
}

onMounted(() => {
  rendererRef.value?.onBeforeRender(onBeforeRender)
})

onBeforeUnmount(() => {
  rendererRef.value?.offBeforeRender(onBeforeRender)
})
</script>
