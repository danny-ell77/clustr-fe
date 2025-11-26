import { ref, computed } from 'vue'
import type { ZodSchema, ZodError } from 'zod'

export interface ValidationError {
    field: string
    message: string
}

export const useFormValidation = <T extends Record<string, any>>(schema: ZodSchema<T>) => {
    const errors = ref<Record<string, string>>({})
    const isValidating = ref(false)

    const validate = async (data: T): Promise<boolean> => {
        isValidating.value = true
        errors.value = {}

        try {
            await schema.parseAsync(data)
            return true
        } catch (error) {
            if (error instanceof Error && 'errors' in error) {
                const zodError = error as ZodError
                zodError.errors.forEach((err) => {
                    const field = err.path.join('.')
                    errors.value[field] = err.message
                })
            }
            return false
        } finally {
            isValidating.value = false
        }
    }

    const validateField = async (field: string, value: any, data: T): Promise<boolean> => {
        try {
            await schema.parseAsync({ ...data, [field]: value })
            delete errors.value[field]
            return true
        } catch (error) {
            if (error instanceof Error && 'errors' in error) {
                const zodError = error as ZodError
                const fieldError = zodError.errors.find((err) => err.path.join('.') === field)
                if (fieldError) {
                    errors.value[field] = fieldError.message
                }
            }
            return false
        }
    }

    const clearErrors = () => {
        errors.value = {}
    }

    const clearFieldError = (field: string) => {
        delete errors.value[field]
    }

    const hasErrors = computed(() => Object.keys(errors.value).length > 0)

    const getFieldError = (field: string) => errors.value[field]

    return {
        errors,
        isValidating,
        hasErrors,
        validate,
        validateField,
        clearErrors,
        clearFieldError,
        getFieldError
    }
}
