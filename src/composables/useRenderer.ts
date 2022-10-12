import { ComponentPublicInstance, onMounted, ref } from 'vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as EC from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { Renderer, Scene } from 'troisjs'

import useScene from '@/composables/useScene'
import useStore from '@/composables/useStore'

const renderer = ref<THREE.WebGLRenderer>()
const scene = ref<THREE.Scene>()
const camera = ref<THREE.PerspectiveCamera>()
const composer = ref<EC.EffectComposer>()

export default function useRenderer() {
  const store = useStore()
  const rendererRef = ref<ComponentPublicInstance<typeof Renderer>>()

  const enableEffect = ref(true)

  const { target, sceneRef } = useScene()

  onMounted(() => {
    const rendererComponent = rendererRef.value
    if (!rendererComponent) return
    renderer.value = rendererComponent.renderer as THREE.WebGLRenderer
    camera.value = rendererComponent.three.camera as THREE.PerspectiveCamera
    composer.value = rendererComponent.three.composer as EC.EffectComposer
    scene.value = rendererComponent.scene as THREE.Scene

    enableEffect.value = true
    store.renderer = renderer.value
    store.rendererComponent = rendererRef.value
  })

  return {
    rendererRef,
    sceneRef,
    enableEffect,
    renderer,
    camera,
    composer,
    target,
  }
}
