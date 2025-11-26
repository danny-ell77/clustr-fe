<template>
    <div class="p-6">
        <UnderConstruction title="Roles & Permissions"
            description="Define and manage roles, assign specific permissions, and control what each user can access and do within the system."
            :features="['Role Creation', 'Permission Assignment', 'Role Hierarchy', 'Audit Trails']" :progress="80" />
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Roles & Permissions',
    description: 'Configure roles and permissions',
    requiresPermission: 'security.roles.view'
})
</script>
