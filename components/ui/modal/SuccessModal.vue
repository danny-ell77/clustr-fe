<template>
    <Teleport to="body">
        <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                @click="handleBackdropClick">
                <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200"
                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="show" class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center"
                        @click.stop>
                        <!-- Success Icon -->
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name="check" class="w-8 h-8 text-green-600" />
                        </div>

                        <!-- Success Message -->
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                            {{ title }}
                        </h3>

                        <p v-if="message" class="text-gray-600 mb-8">
                            {{ message }}
                        </p>

                        <!-- OK Button -->
                        <Button @click="handleOk"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium">
                            {{ okText }}
                        </Button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Success!'
    },
    message: {
        type: String,
        default: ''
    },
    okText: {
        type: String,
        default: 'OK'
    },
    closeOnBackdrop: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close', 'ok'])

const handleOk = () => {
    emit('ok')
    emit('close')
}

const handleBackdropClick = () => {
    if (props.closeOnBackdrop) {
        emit('close')
    }
}
</script>