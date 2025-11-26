import { ref, computed } from 'vue'

export interface FileUploadOptions {
    maxSize?: number
    allowedTypes?: string[]
    multiple?: boolean
}

export interface UploadedFile {
    file: File
    preview?: string
    progress: number
    error?: string
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
    const {
        maxSize = 10 * 1024 * 1024,
        allowedTypes = [],
        multiple = false
    } = options

    const files = ref<UploadedFile[]>([])
    const isUploading = ref(false)

    const validateFile = (file: File): string | null => {
        if (maxSize && file.size > maxSize) {
            return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB`
        }

        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            return `File type ${file.type} is not allowed`
        }

        return null
    }

    const addFiles = async (fileList: FileList | File[]) => {
        const filesToAdd = Array.from(fileList)

        if (!multiple && filesToAdd.length > 1) {
            return
        }

        if (!multiple) {
            files.value = []
        }

        for (const file of filesToAdd) {
            const error = validateFile(file)

            const uploadedFile: UploadedFile = {
                file,
                progress: 0,
                error: error || undefined
            }

            if (file.type.startsWith('image/')) {
                uploadedFile.preview = URL.createObjectURL(file)
            }

            files.value.push(uploadedFile)
        }
    }

    const removeFile = (index: number) => {
        const file = files.value[index]
        if (file.preview) {
            URL.revokeObjectURL(file.preview)
        }
        files.value.splice(index, 1)
    }

    const clearFiles = () => {
        files.value.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview)
            }
        })
        files.value = []
    }

    const uploadFile = async (
        file: UploadedFile,
        uploadFn: (file: File, onProgress: (progress: number) => void) => Promise<any>
    ) => {
        try {
            isUploading.value = true
            file.progress = 0
            file.error = undefined

            const result = await uploadFn(file.file, (progress) => {
                file.progress = progress
            })

            file.progress = 100
            return result
        } catch (error: any) {
            file.error = error.message || 'Upload failed'
            throw error
        } finally {
            isUploading.value = false
        }
    }

    const uploadAll = async (
        uploadFn: (file: File, onProgress: (progress: number) => void) => Promise<any>
    ) => {
        const results = []
        for (const file of files.value) {
            if (!file.error) {
                try {
                    const result = await uploadFile(file, uploadFn)
                    results.push(result)
                } catch (error) {
                    console.error('Upload failed:', error)
                }
            }
        }
        return results
    }

    const hasErrors = computed(() => files.value.some(f => f.error))
    const hasFiles = computed(() => files.value.length > 0)
    const validFiles = computed(() => files.value.filter(f => !f.error))

    return {
        files,
        isUploading,
        hasErrors,
        hasFiles,
        validFiles,
        addFiles,
        removeFile,
        clearFiles,
        uploadFile,
        uploadAll
    }
}
