<template>
    <div class="p-6">
        <UnderConstruction title="Time Logging"
            description="Allow employees to log their work hours, track breaks, and manage their timesheets."
            :features="['Clock In/Out', 'Manual Time Entries', 'Timesheet Approval', 'Reporting']" :progress="50" />
    </div>
</template>

<script setup>
definePageMeta({
    requiresPermission: 'shift.overview.view'
})
</script>
