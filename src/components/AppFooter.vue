<template>
    <footer class="bg-light border-top">
        <div class="container py-4 text-center small text-muted">
            © {{ year }} Rococor — built with Vue + Vite
        </div>
    </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped></style>
