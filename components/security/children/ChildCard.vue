<template>
    <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="$emit('click', child)">
        <CardContent class="pt-6">
            <div class="space-y-4">
                <div class="flex items-start gap-4">
                    <Avatar class="w-16 h-16">
                        <AvatarImage v-if="child.profilePhoto" :src="child.profilePhoto" :alt="child.name" />
                        <AvatarFallback>{{ initials }}</AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="font-semibold text-lg">{{ child.name }}</h3>
                            <Badge v-if="!child.isActive" variant="destructive">Inactive</Badge>
                        </div>
                        <div class="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{{ child.age }} years old</span>
                            <span>•</span>
                            <span>{{ formatGender(child.gender) }}</span>
                        </div>
                        <p class="text-sm text-muted-foreground mt-1">
                            House {{ child.houseNumber }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p class="text-xs text-muted-foreground">Parent</p>
                        <p class="text-sm font-medium">{{ child.parentName }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground">Date of Birth</p>
                        <p class="text-sm font-medium">{{ formatDate(child.dateOfBirth) }}</p>
                    </div>
                    <div class="col-span-2">
                        <p class="text-xs text-muted-foreground">Emergency Contacts</p>
                        <p class="text-sm font-medium">{{ child.emergencyContactsDisplay || 'None' }}</p>
                    </div>
                </div>

                <div v-if="child.notes" class="pt-4 border-t">
                    <p class="text-xs text-muted-foreground mb-1">Notes</p>
                    <p class="text-sm line-clamp-2">{{ child.notes }}</p>
                </div>

                <div v-if="showActions" class="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" class="flex-1" @click.stop="$emit('view', child)">
                        View Details
                    </Button>
                    <Button v-if="canEdit" variant="outline" size="sm" @click.stop="$emit('edit', child)">
                        Edit
                    </Button>
                    <Button v-if="canRequestExit" variant="default" size="sm" @click.stop="$emit('request-exit', child)">
                        Request Exit
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import type { Child } from '~/types/children'

interface Props {
    child: Child
    showActions?: boolean
    canEdit?: boolean
    canRequestExit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
    canEdit: true,
    canRequestExit: true
})

defineEmits<{
    click: [child: Child]
    view: [child: Child]
    edit: [child: Child]
    'request-exit': [child: Child]
}>()

const initials = computed(() => {
    return props.child.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const formatGender = (gender: string) => {
    return gender.charAt(0) + gender.slice(1).toLowerCase()
}
</script>
