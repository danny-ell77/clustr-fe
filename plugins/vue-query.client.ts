import { VueQueryPlugin, QueryClient, QueryCache, type VueQueryPluginOptions } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
    const toast = useToast()

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 30,
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 0,
                onError: (error: any) => {
                    const message = error?.data?.message || error?.message || 'An error occurred'
                    toast.error(message)
                },
            },
        },
        queryCache: new QueryCache({
            onError: (error: any) => {
                const message = error?.data?.message || error?.message || 'Failed to load data'
                toast.error(message)
            },
        }),
    })

    const options: VueQueryPluginOptions = {
        queryClient,
        enableDevtoolsV6Plugin: true,
    }

    nuxtApp.vueApp.use(VueQueryPlugin, options)

    return {
        provide: {
            queryClient,
        },
    }
})
