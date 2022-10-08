<template>
  <KeepAlive>
    <Suspense>
      <AppRenderer>
        <router-view />
      </AppRenderer>
    </Suspense>
  </KeepAlive>

  <!-- UI -->
  <div
    id="ui"
    class="absolute inset-0 grid grid-cols-12 grid-rows-6 overflow-hidden pointer-events-none"
  >
    <div id="teleport-header" class="row-start-1 row-end-2 p-2 col-span-full">
      <div v-for="text in store.texts" :key="text">
        {{ text }}
      </div>
    </div>
    <div
      id="teleport-left"
      class="p-2 col-span-full md:row-start-2 md:row-end-6 md:col-start-1 md:col-end-7"
    >
      <div class="h-full overflow-x-scroll"></div>
    </div>
    <div
      id="teleport-right"
      class="p-2 col-span-full md:row-start-2 md:row-end-6 md:col-start-10 md:col-end-13"
    ></div>
    <div
      id="teleport-footer"
      class="row-start-5 row-end-7 p-2 md:row-start-6 col-span-full"
    >
      <div
        class="flex flex-col items-center justify-center w-full h-full gap-2"
      >
        <div class="flex gap-2"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onActivated, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

import AppRenderer from '@/components/App/AppRenderer.vue'
import InputButton from '@/components/Input/InputButton.vue'
import InputRange from '@/components/Input/InputRange.vue'
import useStore from '@/composables/useStore'

const router = useRouter()

onErrorCaptured((error) => {
  router.push('/')
})

const store = useStore()
</script>

<style>
html,
body {
  font-family: monospace;
  font-weight: bold;
}
</style>
