<template>
    <div class="p-6">
        <UnderConstruction title="Property Tenants"
            description="This section will provide comprehensive tools for managing tenant information, leases, and communication."
            :features="['Tenant Profiles', 'Lease Management', 'Communication Tools', 'Payment History']"
            :progress="60" />
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Tenants',
    description: 'Manage tenant information and leases',
    requiresPermission: 'property.tenants.view'
})
</script>
