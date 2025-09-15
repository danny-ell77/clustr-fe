<template>
  <Tabs v-model="internalValue" v-bind="$attrs" :class="containerClass">
    <TabsList :class="listClass">
      <TabsTrigger 
        v-for="tab in normalizedTabs" 
        :key="tab.value" 
        :value="tab.value"
        :class="triggerClass"
      >
        <Icon v-if="tab.icon" :name="tab.icon" :class="iconClass" />
        {{ tab.name }}
      </TabsTrigger>
    </TabsList>
    
    <!-- Content slots for each tab -->
    <template v-for="tab in normalizedTabs" :key="`content-${tab.value}`">
      <TabsContent :value="tab.value">
        <slot :name="tab.value" :tab="tab">
          <!-- Default content if no slot provided -->
          <div class="p-4 text-gray-500">
            Content for {{ tab.name }}
          </div>
        </slot>
      </TabsContent>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '~/components/ui/tabs'
import Icon from '~/components/Icon.vue'

// Type definitions for better type safety
export interface TabOption {
  name: string
  value: string
  icon?: string
}

export interface DynamicTabsProps {
  modelValue?: string
  tabs: string[] | TabOption[]
  containerClass?: HTMLAttributes['class']
  listClass?: HTMLAttributes['class']
  triggerClass?: HTMLAttributes['class']
  iconClass?: HTMLAttributes['class']
}

export interface DynamicTabsEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'tab-change', value: string, tab: TabOption): void
}

const props = withDefaults(defineProps<DynamicTabsProps>(), {
  iconClass: 'w-4 h-4 mr-2'
})

const emit = defineEmits<DynamicTabsEmits>()

// Computed property to normalize tabs to a consistent format
const normalizedTabs = computed<TabOption[]>(() => {
  return props.tabs.map(tab => {
    if (typeof tab === 'string') {
      return {
        name: tab,
        value: tab.toLowerCase().replace(/\s+/g, '_')
      }
    }
    return tab
  })
})

// Internal v-model handling with tab change event
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    const tab = normalizedTabs.value.find(t => t.value === value)
    if (tab) {
      emit('tab-change', value, tab)
    }
  }
})
</script>