<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl text-foreground">Property Listings</h1>
                <p class="text-muted-foreground">Manage your property portfolio</p>
            </div>
            <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Icon name="plus" class="w-4 h-4 mr-2 inline" />
                Add Property
            </button>
        </div>

        <div class="card p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Status</label>
                    <select v-model="filters.status" class="w-full border border-border rounded-md px-3 py-2">
                        <option value="All">All Status</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Under Maintenance</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Type</label>
                    <select v-model="filters.type" class="w-full border border-border rounded-md px-3 py-2">
                        <option value="All">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Search</label>
                    <input v-model="filters.search" type="text" placeholder="Search properties..."
                        class="w-full border border-border rounded-md px-3 py-2" />
                </div>
                <div class="flex items-end">
                    <button @click="resetFilters"
                        class="px-4 py-2 text-muted-foreground hover:text-gray-800 transition-colors">
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="property in filteredProperties" :key="property.id" class="card hover:-md transition-">
                <div class="aspect-w-16 aspect-h-9">
                    <img :src="property.image" :alt="property.name" class="w-full h-48 object-cover rounded-t-lg" />
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-semibold text-foreground">{{ property.name }}</h3>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(property.status)">
                            {{ property.status }}
                        </span>
                    </div>
                    <p class="text-muted-foreground text-sm mb-2">{{ property.address }}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-lg text-green-600">${{ property.rent }}/month</span>
                        <div class="flex space-x-2">
                            <button class="p-2 text-gray-400 hover:text-primary transition-colors">
                                <Icon name="edit" class="w-4 h-4" />
                            </button>
                            <button class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Icon name="trash-2" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
    title: 'Property Listings',
    description: 'Manage your property portfolio',
    requiresPermission: 'property.listings.view'
})

const filters = ref({
    status: '',
    type: '',
    search: ''
})

const properties = ref([
    {
        id: 1,
        name: 'Sunset Apartments 4B',
        address: '123 Main St, Downtown',
        type: 'apartment',
        status: 'occupied',
        rent: 1200,
        image: '/placeholder.svg?height=200&width=300'
    },
    {
        id: 2,
        name: 'Oak Street House',
        address: '456 Oak St, Suburbs',
        type: 'house',
        status: 'available',
        rent: 2500,
        image: '/placeholder.svg?height=200&width=300'
    },
    {
        id: 3,
        name: 'Downtown Condo 12A',
        address: '789 City Ave, Downtown',
        type: 'condo',
        status: 'maintenance',
        rent: 1800,
        image: '/placeholder.svg?height=200&width=300'
    }
])

const filteredProperties = computed(() => {
    return properties.value.filter(property => {
        const matchesStatus = !filters.value.status || property.status === filters.value.status
        const matchesType = !filters.value.type || property.type === filters.value.type
        const matchesSearch = !filters.value.search ||
            property.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
            property.address.toLowerCase().includes(filters.value.search.toLowerCase())

        return matchesStatus && matchesType && matchesSearch
    })
})

function getStatusClass(status) {
    const classes = {
        available: 'bg-green-100 text-green-800',
        occupied: 'bg-primary/15 text-primary',
        maintenance: 'bg-yellow-100 text-yellow-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

function resetFilters() {
    filters.value = {
        status: '',
        type: '',
        search: ''
    }
}
</script>
