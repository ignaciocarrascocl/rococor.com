<template>
  <!-- Hero Slider Section -->
  <section class="py-5 px-3">
    <div class="container">

      <CoolSlider />
    </div>
  </section>
</template>

<script setup>
import CoolSlider from '../components/CoolSlider.vue'
</script>

<style scoped>
/* page title and subtitle colors */
.page-title {
  font-family: var(--font-rubik-glitch);
  color: var(--white);
}

.subtitle {
  color: var(--platinum);
}
</style>
