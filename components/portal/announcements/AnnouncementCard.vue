<template>
  <Card class="overflow-visible">
    <CardContent class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <Avatar class="h-10 w-10">
            <AvatarImage :src="announcement.author.avatar" />
            <AvatarFallback>{{ getInitials(announcement.author.name) }}</AvatarFallback>
          </Avatar>
          <div>
            <h3 class="font-medium text-sm">{{ announcement.author.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ formatTimeAgo(announcement.createdAt) }}</p>
          </div>
        </div>
        <DropdownMenu v-if="announcement.author.id === currentUser.id">
          <DropdownMenuTrigger as="div">
            <Button variant="ghost" size="icon">
              <Icon name="more-vertical" class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="$emit('edit', announcement)">
              <Icon name="edit-2" class="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem @click="$emit('delete', announcement)" class="text-destructive">
              <Icon name="trash-2" class="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div class="mt-4">
        <p class="text-sm text-foreground whitespace-pre-wrap">{{ announcement.content }}</p>
      </div>

      <div v-if="announcement.image" class="mt-4 relative rounded-lg overflow-hidden">
        <img :src="announcement.image" :alt="announcement.content" class="w-full h-auto" />
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center -ml-2">
          <Button 
            variant="ghost" 
            size="sm" 
            class="flex items-center gap-1"
            @click="handleLike"
          >
            <Icon 
              :name="isLiked ? 'heart-fill' : 'heart'" 
              class="h-4 w-4" 
              :class="isLiked ? 'text-red-500' : ''"
            />
            <span class="text-sm">{{ announcement.likes || 0 }}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            class="flex items-center gap-1"
            @click="showComments = !showComments"
          >
            <Icon name="message-circle" class="h-4 w-4" />
            <span class="text-sm">{{ announcement.comments?.length || 0 }}</span>
          </Button>

          <Button variant="ghost" size="sm" @click="share">
            <Icon name="share-2" class="h-4 w-4" />
          </Button>
        </div>

        <Badge 
          v-if="announcement.status" 
          :variant="getStatusVariant(announcement.status)"
        >
          {{ capitalize(announcement.status) }}
        </Badge>
      </div>

      <div v-if="showComments" class="mt-4 pt-4 border-t">
        <div class="space-y-4">
          <div 
            v-for="comment in announcement.comments" 
            :key="comment.id" 
            class="flex items-start space-x-3"
          >
            <Avatar class="h-8 w-8">
              <AvatarImage :src="comment.author.avatar" />
              <AvatarFallback>{{ getInitials(comment.author.name) }}</AvatarFallback>
            </Avatar>
            <div>
              <div class="flex items-baseline space-x-2">
                <h4 class="text-sm font-medium">{{ comment.author.name }}</h4>
                <span class="text-xs text-muted-foreground">{{ formatTimeAgo(comment.createdAt) }}</span>
              </div>
              <p class="text-sm mt-1">{{ comment.content }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-start space-x-3">
          <Avatar class="h-8 w-8">
            <AvatarImage :src="currentUser.avatar" />
            <AvatarFallback>{{ getInitials(currentUser.name) }}</AvatarFallback>
          </Avatar>
          <div class="flex-1">
            <Textarea
              v-model="newComment"
              placeholder="Write a comment..."
              :rows="1"
              class="resize-none"
              @keydown.enter.prevent="addComment"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Textarea } from '~/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useFormatters } from '~/composables/useFormatters'
import Icon from '~/components/Icon.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'like', 'comment'])

const { 
  formatTimeAgo, 
  getInitials, 
  capitalize, 
  getStatusVariant 
} = useFormatters()

const showComments = ref(false)
const newComment = ref('')
const isLiked = ref(false)

// Mock current user - replace with actual user store
const currentUser = {
  id: 1,
  name: 'Current User',
  avatar: ''
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', {
    announcementId: props.announcement.id,
    liked: isLiked.value
  })
}

const addComment = () => {
  if (!newComment.value.trim()) return

  emit('comment', {
    announcementId: props.announcement.id,
    content: newComment.value
  })
  
  newComment.value = ''
}

const share = () => {
  // Implement share functionality
  // Could use navigator.share if available
  console.log('Share:', props.announcement)
}
</script>
