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

  <!-- UI -->
  <div
    id="ui"
    class="absolute inset-0 grid grid-cols-12 grid-rows-6 overflow-hidden pointer-events-none"
  >
    <div
      id="teleport-header"
      class="flex items-start row-start-1 row-end-2 p-2 col-span-full"
    >
      <button
        class="p-3 transition-opacity rounded-full opacity-50 pointer-events-auto hover:opacity-100"
        @click="goHome"
      >
        <HomeIcon class="h-7 w-7 text-white/80" />
      </button>
      <button
        class="p-3 transition-opacity rounded-full opacity-50 pointer-events-auto hover:opacity-100"
        @click="store.shuffle"
      >
        <ArrowPathIcon class="h-7 w-7 text-white/80" />
      </button>
      <button
        class="p-3 ml-auto transition-opacity rounded-full opacity-50 pointer-events-auto hover:opacity-100"
        @click="orientationModal.open = true"
      >
        <CogIcon class="h-7 w-7 text-white/80" />
      </button>
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
        <ArrowLeftIcon class="h-7 w-7 text-white/80" />
      </button>
      <button
        class="p-3 mx-auto transition-opacity rounded-full"
        :class="
          store.showLink
            ? 'pointer-events-auto opacity-50 hover:opacity-100'
            : 'opacity-0 pointer-events-none hover:opacity-0'
        "
        @click="store.onClickLink"
      >
        <RectangleGroupIcon class="h-7 w-7 text-white/80" />
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
        <ArrowRightIcon class="h-7 w-7 text-white/80" />
      </button>

      <div v-for="text in store.texts" :key="text">
        {{ text }}
      </div>
    </div>
  </div>
  <AppModal
    v-if="orientationSupported"
    v-bind="orientationModal"
    @click:primary="requestPermission"
    @click:secondary="disableGyroscope"
    @click:overlay="orientationModal.open = false"
  />
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
  CogIcon,
  HomeIcon,
  RectangleGroupIcon,
} from '@heroicons/vue/24/outline'

import type { AppModalType } from '@/components/App/AppModal.vue'
import AppModal from '@/components/App/AppModal.vue'
import AppRenderer from '@/components/App/AppRenderer.vue'
import useStore from '@/composables/useStore'
import { setSecretSeed } from '@/utils'

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied' | 'prompt'>
}

const store = useStore()

const orientationPermission = ref<'granted' | 'denied' | 'prompt'>('prompt')

const orientationModal = reactive<{
  open: boolean
  type: AppModalType
}>({
  open: false,
  type: {
    type: 'info',
    title: 'Enable gyro?',
    message: `Do you want to enable device orientation? It's not required, so feel no pressure.`,
    secondary: 'No',
    primary: 'Yes',
  },
})

const orientationSupported = ref(false)

const fn = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS)
  .requestPermission
const iOS = typeof fn === 'function'

async function requestPermission() {
  if (iOS) {
    orientationPermission.value = await fn()
  }
  orientationModal.open = false
  store.enableSceneTilt = true
}

const disableGyroscope = () => {
  orientationPermission.value = 'denied'
  orientationModal.open = false
  store.enableSceneTilt = false
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
  // device orientation support
  if (window.DeviceOrientationEvent) {
    orientationSupported.value = true

    if (iOS) {
      orientationPermission.value = await fn()

      if (orientationPermission.value === 'prompt') {
        orientationModal.open = true
      }
    }
  }

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
