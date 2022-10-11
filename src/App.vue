<template>
  <Suspense>
    <AppRenderer>
      <router-view v-slot="{ Component }">
        <template>
          <component :is="Component" />
        </template>
      </router-view>
    </AppRenderer>
  </Suspense>

  <button
    v-if="requestPermissionResponse !== 'granted' && showOverlay"
    class="absolute inset-0"
    @click="requestPermission"
  ></button>
  <!-- UI -->
  <div
    id="ui"
    class="absolute inset-0 grid grid-cols-12 grid-rows-6 overflow-hidden pointer-events-none"
  >
    <div id="teleport-header" class="row-start-1 row-end-2 p-2 col-span-full">
      <button
        class="p-3 transition-opacity rounded-full opacity-50 pointer-events-auto hover:opacity-100"
        @click="goHome"
      >
        <HomeIcon class="w-10 h-10 text-white/80" />
      </button>
      <button
        class="p-3 transition-opacity rounded-full opacity-50 pointer-events-auto hover:opacity-100"
        @click="store.shuffle"
      >
        <ArrowPathIcon class="w-10 h-10 text-white/80" />
      </button>

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
      class="flex items-end justify-between row-start-5 row-end-7 p-2 md:row-start-6 col-span-full"
    >
      <button
        class="p-3 mr-auto transition-opacity rounded-full"
        :class="
          store.showArrowLeft
            ? 'pointer-events-auto opacity-50 hover:opacity-100'
            : 'opacity-0 pointer-events-none hover:opacity-0'
        "
        @click="store.onClickLeft"
      >
        <ArrowLeftIcon class="w-10 h-10 text-white/80" />
      </button>
      <button
        class="p-3 ml-auto transition-opacity rounded-full"
        :class="
          store.showArrowRight
            ? 'pointer-events-auto  opacity-50 hover:opacity-100'
            : 'opacity-0 pointer-events-none'
        "
        @click="store.onClickRight"
      >
        <ArrowRightIcon class="w-10 h-10 text-white/80" />
      </button>

      <div v-for="text in store.texts" :key="text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  nextTick,
  onActivated,
  onErrorCaptured,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HomeIcon,
} from '@heroicons/vue/24/outline'
import { useDeviceOrientation } from '@vueuse/core'

import AppRenderer from '@/components/App/AppRenderer.vue'
import useStore from '@/composables/useStore'
import { setSecretSeed } from '@/utils'

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

const store = useStore()

const requestPermissionResponse = ref<'granted' | 'denied'>('denied')

const showOverlay = ref(true)
requestPermission()

async function requestPermission() {
  const fn = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS)
    .requestPermission
  const iOS = typeof fn === 'function'

  if (iOS) {
    const response = await fn()
    requestPermissionResponse.value = response

    if (response === 'granted') {
      // execute
    }
  }
  showOverlay.value = false
}
const router = useRouter()
const route = useRoute()

const goHome = async () => {
  if (route.path === '/') {
    store.resetDetails()

    return
  }

  await store.deactivatePage()
  router.push('/')
  await store.setPageActive('home')
}

onErrorCaptured((error) => {
  router.push('/')
})

onMounted(async () => {
  if (route.name === 'home') {
    await store.setPageActive('home')
  } else if (route.name === 'Gallery') {
    await store.setPageActive('gallery')
  }
})
</script>

<style>
html,
body {
  font-family: 'Fira Code VF' monospace;
  /* font-weight: bold; */
}
</style>
