<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Visitor Pass</DialogTitle>
                <DialogDescription>
                    Digital pass for {{ visitor?.name }}
                </DialogDescription>
            </DialogHeader>

            <div v-if="visitor" class="space-y-4">
                <div class="bg-gradient-to-br from-primary to-primary/90 rounded-lg p-6 text-white">
                    <div class="text-center space-y-2">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2">
                            <Icon name="user" class="w-8 h-8" />
                        </div>
                        <h3 class="text-xl">{{ visitor.name }}</h3>
                        <p class="text-sm opacity-90">Visitor Pass</p>
                    </div>

                    <div class="mt-6 space-y-3">
                        <div class="flex justify-between items-center text-sm">
                            <span class="opacity-80">Access Code</span>
                            <span class="font-mono text-lg">{{ visitor.accessCode }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="opacity-80">Valid Until</span>
                            <span class="font-medium">{{ formatDate(visitor.validDate) }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="opacity-80">Visit Type</span>
                            <span class="font-medium">{{ formatVisitType(visitor.visitType) }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="qrCode" class="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div class="flex flex-col items-center space-y-3">
                        <p class="text-sm text-muted-foreground text-center">
                            Scan this QR code at the gate
                        </p>
                        <div class="bg-white p-4 rounded-lg border">
                            <img :src="qrCode" alt="Visitor QR Code" class="w-48 h-48" />
                        </div>
                        <p class="text-xs text-muted-foreground text-center">
                            This pass is valid for {{ formatValidFor(visitor.validFor) }}
                        </p>
                    </div>
                </div>

                <div v-else-if="isGenerating" class="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div class="flex flex-col items-center space-y-3">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p class="text-sm text-muted-foreground">Generating QR code...</p>
                    </div>
                </div>

                <div v-else class="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div class="flex flex-col items-center space-y-3">
                        <Icon name="qr-code" class="w-12 h-12 text-muted-foreground" />
                        <p class="text-sm text-muted-foreground text-center">
                            Click the button below to generate a QR code pass
                        </p>
                        <Button @click="handleGeneratePass" :disabled="isGenerating" class="w-full">
                            Generate QR Code
                        </Button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <Button variant="outline" @click="handleDownload" :disabled="!qrCode || isGenerating"
                        class="w-full">
                        <Icon name="download" class="w-4 h-4 mr-2" />
                        Download
                    </Button>
                    <Button variant="outline" @click="handlePrint" :disabled="!qrCode || isGenerating" class="w-full">
                        <Icon name="printer" class="w-4 h-4 mr-2" />
                        Print
                    </Button>
                </div>

                <div class="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" @click="isOpen = false">
                        Close
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import Icon from '~/components/Icon.vue'
import { useVisitors } from '~/composables/security/useVisitors'
import type { Visitor } from '~/types/visitors'

interface Props {
    open: boolean
    visitor?: Visitor
}

const props = defineProps<Props>()
const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const { generatePassMutation } = useVisitors()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

const qrCode = ref<string>('')
const passUrl = ref<string>('')
const isGenerating = computed(() => generatePassMutation.isPending.value)

watch(() => props.open, (open) => {
    if (!open) {
        qrCode.value = ''
        passUrl.value = ''
    }
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatVisitType = (type: string) => {
    return type.split('_').map(word =>
        word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
}

const formatValidFor = (validFor: string) => {
    return validFor === 'ONE_TIME' ? 'one-time entry' : 'multiple entries'
}

const handleGeneratePass = async () => {
    if (!props.visitor) return

    try {
        const response = await generatePassMutation.mutateAsync(props.visitor.id)
        qrCode.value = response.qr_code
        passUrl.value = response.pass_url
    } catch (error) {
        console.error('Failed to generate pass:', error)
    }
}

const handleDownload = () => {
    if (!qrCode.value || !props.visitor) return

    const link = document.createElement('a')
    link.href = qrCode.value
    link.download = `visitor-pass-${props.visitor.accessCode}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const handlePrint = () => {
    if (!qrCode.value || !props.visitor) return

    const visitor = props.visitor
    const qrCodeData = qrCode.value

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const visitorName = visitor.name
    const accessCode = visitor.accessCode
    const visitType = formatVisitType(visitor.visitType)
    const validDate = formatDate(visitor.validDate)
    const validForText = formatValidFor(visitor.validFor)

    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Visitor Pass - ${visitorName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                .pass-container {
                    text-align: center;
                    max-width: 400px;
                }
                .header {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 10px 10px 0 0;
                }
                .header h1 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 5px 0;
                    opacity: 0.9;
                }
                .qr-section {
                    background: white;
                    padding: 30px;
                    border: 2px solid #e5e7eb;
                    border-top: none;
                    border-radius: 0 0 10px 10px;
                }
                .qr-code {
                    margin: 20px 0;
                }
                .qr-code img {
                    width: 250px;
                    height: 250px;
                }
                .info {
                    margin-top: 20px;
                    text-align: left;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .info-label {
                    color: #6b7280;
                    font-size: 14px;
                }
                .info-value {
                    font-weight: bold;
                    font-size: 14px;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="pass-container">
                <div class="header">
                    <h1>${visitorName}</h1>
                    <p>Visitor Pass</p>
                    <p style="font-size: 20px; font-weight: bold; margin-top: 15px;">${accessCode}</p>
                </div>
                <div class="qr-section">
                    <p style="color: #6b7280; margin-bottom: 10px;">Scan at Gate</p>
                    <div class="qr-code">
                        <img src="${qrCodeData}" alt="QR Code" />
                    </div>
                    <div class="info">
                        <div class="info-row">
                            <span class="info-label">Visit Type</span>
                            <span class="info-value">${visitType}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Valid Until</span>
                            <span class="info-value">${validDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Valid For</span>
                            <span class="info-value">${validForText}</span>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
    }
}
</script>
