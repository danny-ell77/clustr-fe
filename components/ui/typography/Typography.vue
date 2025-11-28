<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva(
  'text-foreground',
  {
    variants: {
      variant: {
        h1: 'scroll-m-20 text-4xl font-medium tracking-tight lg:text-5xl',
        h2: 'scroll-m-20 text-3xl font-medium tracking-tight first:mt-0',
        h3: 'scroll-m-20 text-2xl font-medium tracking-tight',
        h4: 'scroll-m-20 text-xl font-medium tracking-tight',
        h5: 'scroll-m-20 text-lg font-medium tracking-tight',
        h6: 'scroll-m-20 text-base font-medium tracking-tight',
        p: 'leading-7 [&:not(:first-child)]:mt-6',
        blockquote: 'mt-6 border-l-2 pl-6 italic',
        lead: 'text-xl text-muted-foreground',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-sm text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'p',
    },
  },
)

type TypographyProps = {
  as?: string
  class?: HTMLAttributes['class']
} & VariantProps<typeof typographyVariants>

const props = withDefaults(defineProps<TypographyProps>(), {
  as: undefined,
})

const Component = computed(() => {
  if (props.as) return props.as
  
  switch (props.variant) {
    case 'h1': return 'h1'
    case 'h2': return 'h2'
    case 'h3': return 'h3'
    case 'h4': return 'h4'
    case 'h5': return 'h5'
    case 'h6': return 'h6'
    case 'p': return 'p'
    case 'blockquote': return 'blockquote'
    default: return 'div'
  }
})
</script>

<template>
  <Component :is="Component" :class="cn(typographyVariants({ variant }), props.class)">
    <slot />
  </Component>
</template>
