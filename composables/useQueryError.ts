import type { Ref } from 'vue'

interface QueryErrorOptions {
    showToast?: boolean
    anchorEl?: HTMLElement
    customMessage?: string
}

export const useQueryError = () => {
    const toast = useToast()

    const handleQueryError = (error: any, options: QueryErrorOptions = {}) => {
        const { showToast = true, anchorEl, customMessage } = options

        const message = customMessage || error?.data?.message || error?.message || 'Failed to load data'

        if (showToast) {
            toast.error(message, '', { anchorEl })
        }

        return message
    }

    const handleMutationError = (error: any, options: QueryErrorOptions = {}) => {
        const { showToast = true, anchorEl, customMessage } = options

        const message = customMessage || error?.data?.message || error?.message || 'Operation failed'

        if (showToast) {
            toast.error(message, '', { anchorEl })
        }

        return message
    }

    const getErrorMessage = (error: any): string => {
        return error?.data?.message || error?.message || 'An error occurred'
    }

    return {
        handleQueryError,
        handleMutationError,
        getErrorMessage,
    }
}

export const useQueryState = (query: { isError: Ref<boolean>; error: Ref<any> }) => {
    const errorMessage = computed(() => {
        if (!query.isError.value) return null
        return query.error.value?.data?.message || query.error.value?.message || 'An error occurred'
    })

    const hasError = computed(() => query.isError.value)

    return {
        errorMessage,
        hasError,
    }
}
