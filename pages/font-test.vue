<template>
    <div class="min-h-screen bg-background p-8">
        <div class="max-w-4xl mx-auto space-y-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold mb-2">Neue Montreal Font Test</h1>
                <p class="text-muted-foreground">Testing all font weights and styles</p>
            </div>

            <Card>
                <CardHeader>
                    <h2 class="text-2xl font-bold">Font Weights</h2>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div>
                        <p class="text-sm text-muted-foreground mb-1">Light (300)</p>
                        <p class="text-2xl font-light">The quick brown fox jumps over the lazy dog</p>
                    </div>

                    <div>
                        <p class="text-sm text-muted-foreground mb-1">Regular (400)</p>
                        <p class="text-2xl font-normal">The quick brown fox jumps over the lazy dog</p>
                    </div>

                    <div>
                        <p class="text-sm text-muted-foreground mb-1">Medium (500)</p>
                        <p class="text-2xl font-medium">The quick brown fox jumps over the lazy dog</p>
                    </div>

                    <div>
                        <p class="text-sm text-muted-foreground mb-1">Bold (700)</p>
                        <p class="text-2xl font-bold">The quick brown fox jumps over the lazy dog</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 class="text-2xl font-bold">Typography Scale</h2>
                </CardHeader>
                <CardContent class="space-y-4">
                    <h1 class="text-4xl font-bold">Heading 1 - 4xl Bold</h1>
                    <h2 class="text-3xl font-bold">Heading 2 - 3xl Bold</h2>
                    <h3 class="text-2xl font-semibold">Heading 3 - 2xl Semibold</h3>
                    <h4 class="text-xl font-semibold">Heading 4 - xl Semibold</h4>
                    <p class="text-base">Body text - Base Regular</p>
                    <p class="text-sm text-muted-foreground">Small text - SM Muted</p>
                    <p class="text-xs text-muted-foreground">Extra small text - XS Muted</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 class="text-2xl font-bold">UI Components</h2>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="flex gap-2">
                        <Button variant="default">Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                        <Button variant="destructive">Destructive Button</Button>
                    </div>

                    <div class="flex gap-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="error">Error</Badge>
                        <Badge variant="info">Info</Badge>
                    </div>

                    <div class="space-y-2">
                        <Label>Input Label</Label>
                        <Input placeholder="Enter text here..." />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 class="text-2xl font-bold">Numbers & Special Characters</h2>
                </CardHeader>
                <CardContent class="space-y-2">
                    <p class="text-xl">0123456789</p>
                    <p class="text-xl">₦1,234,567.89</p>
                    <p class="text-xl">$1,234,567.89</p>
                    <p class="text-xl">!@#$%^&*()_+-=[]{}|;':",.<>?/</p>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    auth: false,
    layout: false
})
</script>
