import { ref } from 'vue'

export interface ConfirmDialogOptions {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    showInput?: boolean
    inputLabel?: string
    inputPlaceholder?: string
    requireInput?: boolean
}

export const useConfirmDialog = () => {
    const isOpen = ref(false)
    const options = ref<ConfirmDialogOptions>({
        title: '',
        description: ''
    })
    const resolveCallback = ref<((value: boolean | string) => void) | null>(null)

    const confirm = (dialogOptions: ConfirmDialogOptions): Promise<boolean | string> => {
        options.value = dialogOptions
        isOpen.value = true

        return new Promise((resolve) => {
            resolveCallback.value = resolve
        })
    }

    const handleConfirm = (inputValue?: string) => {
        isOpen.value = false
        if (resolveCallback.value) {
            resolveCallback.value(options.value.showInput ? inputValue || '' : true)
            resolveCallback.value = null
        }
    }

    const handleCancel = () => {
        isOpen.value = false
        if (resolveCallback.value) {
            resolveCallback.value(false)
            resolveCallback.value = null
        }
    }

    return {
        isOpen,
        options,
        confirm,
        handleConfirm,
        handleCancel
    }
}
