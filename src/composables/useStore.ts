import { ComponentPublicInstance, reactive } from 'vue'

import { Vector3, WebGLRenderer } from 'three'
import { Renderer } from 'troisjs'

const startDate = new Date('1999-12-22T08:01').getTime()

interface Store {
  texts: string[]
  renderer?: WebGLRenderer
  rendererComponent?: ComponentPublicInstance<typeof Renderer>
}

// { x: Math.PI / 2 + (23.4 / 180) * Math.PI }
const store = reactive<Store>({
  texts: [],
})

export default function () {
  return store
}
