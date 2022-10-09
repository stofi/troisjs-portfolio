/* eslint-disable vue/require-default-prop */
import { defineComponent, PropType, watch } from 'vue'

import { CanvasTexture, ShaderMaterial } from 'three'
import { MaterialInjectionKey } from 'troisjs'

export interface TexureInterface {
  material?: MaterialInterface
  texture?: CanvasTexture
}

interface MaterialInterface {
  setTexture(texture: CanvasTexture | null, key: string): void
}

export default defineComponent({
  name: 'CanvasTexture',
  inject: {
    material: MaterialInjectionKey as symbol,
  },

  props: {
    name: { type: String, default: 'map' },
    canvasTexture: Object as PropType<CanvasTexture>,
    props: { type: Object, default: () => ({}) },
  },

  setup(): TexureInterface {
    return {}
  },

  created() {
    this.refreshTexture()
  },

  unmounted() {
    this.material?.setTexture(null, this.name)
    this.texture?.dispose()
  },

  methods: {
    initTexture() {
      if (!this.canvasTexture) return

      if (!this.material) return

      this.material.setTexture(this.canvasTexture, this.name)
    },

    refreshTexture() {
      this.texture?.dispose()
      this.initTexture()
    },
  },

  render() {
    return []
  },
})
