<template>
    <div class="max-w-2xl mx-auto space-y-6 p-6">
        <div class="text-center">
            <Icon name="alert-circle" class="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 class="text-3xl font-semibold">Request Entry</h1>
            <p class="text-muted-foreground mt-2">
                Enter your access code to request entry to the estate
            </p>
        </div>

        <Card>
            <CardContent class="pt-6">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div>
                        <Label for="accessCode">Access Code *</Label>
                        <Input id="accessCode" v-model="accessCode" placeholder="Enter your 6-digit access code"
                            maxlength="6" class="text-center text-2xl tracking-widest font-mono" required
                            :disabled="isLoading" />
                        <p class="text-sm text-muted-foreground mt-2">
                            Enter the access code provided by your host
                        </p>
                    </div>

                    <div v-if="visitor">
                        <div class="bg-muted p-4 rounded-lg space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium">Visitor Name</span>
                                <span class="text-sm">{{ visitor.name }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium">Host</span>
                                <span class="text-sm">{{ visitor.invitedBy }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium">Visit Type</span>
                                <span class="text-sm">{{ formatVisitType(visitor.visitType) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium">Status</span>
                                <StatusBadge :status="visitor.status" />
                            </div>
                        </div>

                        <div v-if="visitor.purpose" class="mt-4">
                            <Label>Purpose of Visit</Label>
                            <p class="text-sm text-muted-foreground mt-1">{{ visitor.purpose }}</p>
                        </div>
                    </div>

                    <div v-if="error" class="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-2">
                        <Icon name="alert-triangle" class="w-5 h-5 mt-0.5" />
                        <div>
                            <p class="font-medium">{{ error }}</p>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <Button type="button" variant="outline" class="flex-1" @click="reset" :disabled="isLoading">
                            Clear
                        </Button>
                        <Button type="submit" class="flex-1" :disabled="isLoading || !accessCode">
                            {{ isLoading ? 'Verifying...' : visitor ? 'Request Entry' : 'Verify Code' }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

        <div v-if="visitor && canRequestEntry" class="text-center">
            <p class="text-sm text-muted-foreground">
                Security will be notified of your arrival request
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import StatusBadge from '~/components/common/StatusBadge.vue'
import Icon from '~/components/Icon.vue'
import type { Visitor } from '~/types/visitors'

definePageMeta({
    title: 'Request Entry',
    layout: 'default'
})

const accessCode = ref('')
const visitor = ref<Visitor | null>(null)
const isLoading = ref(false)
const error = ref('')

const canRequestEntry = computed(() => {
    return visitor.value && visitor.value.status === 'APPROVED'
})

const formatVisitType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}

const handleSubmit = async () => {
    if (!accessCode.value) return

    error.value = ''
    isLoading.value = true

    try {
        const { $api } = useNuxtApp()

        if (!visitor.value) {
            const response = await $api<Visitor>('/management/visitors/verify_access_code/', {
                method: 'POST',
                body: { access_code: accessCode.value }
            })
            visitor.value = response
        } else {
            await $api('/management/visitors/request_entry/', {
                method: 'POST',
                body: { access_code: accessCode.value }
            })

            useToast().success('Entry request sent', 'Security has been notified of your arrival')

            setTimeout(() => {
                reset()
            }, 2000)
        }
    } catch (err: any) {
        error.value = err.data?.message || 'Invalid access code or visitor not found'
        visitor.value = null
    } finally {
        isLoading.value = false
    }
}

const reset = () => {
    accessCode.value = ''
    visitor.value = null
    error.value = ''
}
</script>
