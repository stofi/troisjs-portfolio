<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="$emit('click:overlay')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 transition-opacity bg-opacity-75 bg-stone-900/50 backdrop-blur-sm text-stone-400"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform rounded-lg shadow-xl bg-stone-800/50 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 backdrop-blur-md"
            >
              <div class="sm:flex sm:items-start">
                <div
                  class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10"
                >
                  <CogIcon
                    class="w-12 h-12 text-stone-400"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-stone-300"
                    >{{ type.title }}</DialogTitle
                  >
                  <div v-if="type.message" class="mt-2">
                    <p class="text-sm text-stone-400">
                      {{ type.message }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  v-if="type.primary"
                  type="button"
                  class="inline-flex justify-center w-full px-4 py-2 text-base font-medium border border-transparent rounded-md shadow-sm text-stone-100 bg-stone-600/30 hover:bg-stone-400/30 focus:outline-none focus:ring-stone-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm backdrop-blur-xl"
                  @click="$emit('click:primary')"
                >
                  {{ type.primary }}
                </button>
                <button
                  v-if="type.secondary"
                  ref="cancelButtonRef"
                  type="button"
                  class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium border-2 rounded-md shadow-sm backdrop-blur-xl text-stone-300 border-stone-400/50 hover:bg-stone-400/30 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm hover-text-stone-100"
                  @click="$emit('click:secondary')"
                >
                  {{ type.secondary }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { CogIcon } from '@heroicons/vue/24/outline'

export type AppModalType = {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  primary?: string
  secondary?: string
}

// const open = ref(true)
defineProps<{ open: boolean; type: AppModalType }>()
defineEmits(['click:primary', 'click:secondary', 'click:overlay'])
</script>
