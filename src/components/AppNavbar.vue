<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div class="container">
            <a class="navbar-brand text-primary fw-bold" href="#">Rococor</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navMenu">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item"><router-link to="/" class="nav-link">Home</router-link></li>
                    <li class="nav-item"><router-link to="/about" class="nav-link">About</router-link></li>
                    <li class="nav-item"><router-link to="/contact" class="nav-link">Contact</router-link></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
// No script logic for now
</script>

<style scoped></style>
