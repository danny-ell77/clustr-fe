<template>
    <div class="p-6">
        <UnderConstruction title="Shift Scheduling"
            description="Plan and manage employee shifts, create schedules, and handle shift assignments efficiently."
            :features="['Drag-and-Drop Scheduling', 'Shift Templates', 'Employee Availability', 'Conflict Detection']"
            :progress="45" />
    </div>
</template>

<script setup>
definePageMeta({
    requiresPermission: 'shift.overview.view'
})
</script>
