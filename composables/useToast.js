import { ref } from 'vue'

const toasts = ref([])

export const useToast = () => {
    const addToast = (toast) => {
        const id = Date.now() + Math.random()
        const newToast = {
            id,
            show: true,
            ...toast
        }
        
        toasts.value.push(newToast)
        
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
            }, 300)
        }
    }
    
    const success = (title, message = '', options = {}) => {
        const duration = typeof options === 'number' ? options : (options.duration || 5000)
        const anchorEl = typeof options === 'object' ? options.anchorEl : undefined
        return addToast({ type: 'success', title, message, duration, anchorEl })
    }
    
    const error = (title, message = '', options = {}) => {
        const duration = typeof options === 'number' ? options : (options.duration || 5000)
        const anchorEl = typeof options === 'object' ? options.anchorEl : undefined
        return addToast({ type: 'error', title, message, duration, anchorEl })
    }
    
    const warning = (title, message = '', options = {}) => {
        const duration = typeof options === 'number' ? options : (options.duration || 5000)
        const anchorEl = typeof options === 'object' ? options.anchorEl : undefined
        return addToast({ type: 'warning', title, message, duration, anchorEl })
    }
    
    const info = (title, message = '', options = {}) => {
        const duration = typeof options === 'number' ? options : (options.duration || 5000)
        const anchorEl = typeof options === 'object' ? options.anchorEl : undefined
        return addToast({ type: 'info', title, message, duration, anchorEl })
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

export const calculateToastPosition = (anchorEl) => {
    if (!anchorEl || typeof window === 'undefined') {
        return { top: '1rem', right: '1rem' }
    }
    
    const rect = anchorEl.getBoundingClientRect()
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceRight = window.innerWidth - rect.right
    
    if (spaceAbove > spaceBelow && spaceAbove > 100) {
        return {
            top: `${rect.top - 70}px`,
            left: spaceRight > 400 ? `${rect.left}px` : 'auto',
            right: spaceRight <= 400 ? '1rem' : 'auto'
        }
    } else {
        return {
            top: `${rect.bottom + 10}px`,
            left: spaceRight > 400 ? `${rect.left}px` : 'auto',
            right: spaceRight <= 400 ? '1rem' : 'auto'
        }
    }
}