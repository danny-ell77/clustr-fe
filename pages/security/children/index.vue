<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-semibold">Children</h1>
                <p class="text-muted-foreground">Manage child profiles and access control</p>
            </div>

            <Button @click="showCreateModal = true">
                <Icon name="plus" class="w-4 h-4 mr-2" />
                Add Child
            </Button>
        </div>

        <UnifiedView page-key="children-list" :data="children" :is-loading="childrenQuery.isLoading.value"
            :available-views="['grid', 'table']" default-view-mode="grid">
            <template #filters="{ filters, applyFilters }">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Search</Label>
                        <Input :model-value="filters.search"
                            @update:model-value="(value: string) => applyFilters({ search: value })"
                            placeholder="Search by name..." />
                    </div>

                    <div>
                        <Label>Gender</Label>
                        <Select :model-value="filters.gender"
                            @update:model-value="(value: string) => applyFilters({ gender: value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Genders" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.is_active"
                            @update:model-value="(value: string) => applyFilters({ is_active: value })">
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </template>

            <template #modal-filters="{ filters, setFilter }">
                <div class="space-y-4">
                    <div>
                        <Label>Search</Label>
                        <Input :model-value="filters.search"
                            @update:model-value="(value: string) => setFilter('search', value)"
                            placeholder="Search by name..." />
                    </div>

                    <div>
                        <Label>Gender</Label>
                        <Select :model-value="filters.gender"
                            @update:model-value="(value: string) => setFilter('gender', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Genders" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select :model-value="filters.is_active"
                            @update:model-value="(value: string) => setFilter('is_active', value)">
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </template>

            <template #grid="{ data, isLoading }">
                <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card v-for="i in 6" :key="i">
                        <CardContent class="pt-6">
                            <Skeleton class="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div v-else-if="!data.length" class="flex items-center justify-center py-12">
                    <EmptyState title="No children found" description="Get started by adding a child profile"
                        action-label="Add Child" @action="showCreateModal = true" />
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ChildCard v-for="child in data" :key="child.id" :child="child" @click="viewChild(child)"
                        @edit="editChild(child)" @request-exit="requestExit(child)" />
                </div>
            </template>

            <template #table="{ data, isLoading }">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>House</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="isLoading" v-for="i in 5" :key="i">
                            <TableCell v-for="j in 7" :key="j">
                                <Skeleton class="h-4 w-full" />
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="!data.length">
                            <TableCell :colspan="7" class="text-center py-8">
                                <div class="text-muted-foreground">No children found</div>
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="child in data" :key="child.id" class="cursor-pointer hover:bg-muted/50"
                            @click="viewChild(child)">
                            <TableCell>
                                <div class="flex items-center gap-2">
                                    <Avatar class="w-8 h-8">
                                        <AvatarImage v-if="child.profilePhoto" :src="child.profilePhoto"
                                            :alt="child.name" />
                                        <AvatarFallback>{{ getInitials(child.name) }}</AvatarFallback>
                                    </Avatar>
                                    <span class="font-medium">{{ child.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell>{{ child.age }}</TableCell>
                            <TableCell>{{ formatGender(child.gender) }}</TableCell>
                            <TableCell>{{ child.parentName }}</TableCell>
                            <TableCell>{{ child.houseNumber }}</TableCell>
                            <TableCell>
                                <Badge :variant="child.isActive ? 'default' : 'destructive'">
                                    {{ child.isActive ? 'Active' : 'Inactive' }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-2">
                                    <Button variant="ghost" size="sm" @click.stop="editChild(child)">
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" @click.stop="requestExit(child)">
                                        Exit Request
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </template>
        </UnifiedView>

        <ChildFormDialog v-model:open="showCreateModal" @success="onChildCreated" />

        <ChildFormDialog v-model:open="showEditModal" :child="selectedChild" @success="onChildUpdated" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChildren } from '~/composables/security/useChildren'
import UnifiedView from '~/components/common/UnifiedView.vue'
import ChildCard from '~/components/security/children/ChildCard.vue'
import ChildFormDialog from '~/components/security/children/ChildFormDialog.vue'
import EmptyState from '~/components/common/EmptyState.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import Icon from '~/components/Icon.vue'
import type { Child } from '~/types/children'

definePageMeta({
    layout: 'default'
})

const { useChildren: useChildrenQuery } = useChildren()

const filters = ref({})
const childrenQuery = useChildrenQuery(filters)

const children = computed(() => childrenQuery.data.value?.results || [])

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedChild = ref<Child | undefined>()

const viewChild = (child: Child) => {
    navigateTo(`/security/children/${child.id}`)
}

const editChild = (child: Child) => {
    selectedChild.value = child
    showEditModal.value = true
}

const requestExit = (child: Child) => {
    navigateTo(`/security/children/exit-requests?child=${child.id}`)
}

const onChildCreated = () => {
    showCreateModal.value = false
}

const onChildUpdated = () => {
    showEditModal.value = false
    selectedChild.value = undefined
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const formatGender = (gender: string) => {
    return gender.charAt(0) + gender.slice(1).toLowerCase()
}
</script>
