import { ref } from 'vue'

const toasts = ref([])

export const useToast = () => {
    const addToast = (toast) => {
        const id = Date.now()
        const newToast = {
            id,
            show: true,
            ...toast
        }
        
        toasts.value.push(newToast)
        
        // Auto remove after duration
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id)
            }, toast.duration || 5000)
        }
        
        return id
    }
    
    const removeToast = (id) => {
        const index = toasts.value.findIndex(toast => toast.id === id)
        if (index > -1) {
            toasts.value[index].show = false
            setTimeout(() => {
                toasts.value.splice(index, 1)
            }, 300) // Wait for transition
        }
    }
    
    const success = (title, message = '', duration = 5000) => {
        return addToast({ type: 'success', title, message, duration })
    }
    
    const error = (title, message = '', duration = 5000) => {
        return addToast({ type: 'error', title, message, duration })
    }
    
    const warning = (title, message = '', duration = 5000) => {
        return addToast({ type: 'warning', title, message, duration })
    }
    
    const info = (title, message = '', duration = 5000) => {
        return addToast({ type: 'info', title, message, duration })
    }
    
    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    }
}