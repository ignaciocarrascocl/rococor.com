<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
    <svg ref="navbarBgSvg" class="navbar-bg-svg" xmlns="http://www.w3.org/2000/svg"></svg>
    <div class="container navbar-content">
      <a class="navbar-brand fw-bold navbar-title" href="#">Rococor</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link-custom">
              <RoughButton label="Home" variant="lined" :padding-x="16" :padding-y="8" :roughness="1.8"
                fill="var(--black)" stroke="var(--black)" hover-fill="var(--razzmatazz)" @click="navigateTo('/')" />
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link-custom">
              <RoughButton label="About" variant="lined" :padding-x="16" :padding-y="8" :roughness="1.8"
                fill="var(--black)" stroke="var(--black)" hover-fill="var(--razzmatazz)"
                @click="navigateTo('/about')" />
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link-custom">
              <RoughButton label="Contact" variant="lined" :padding-x="16" :padding-y="8" :roughness="1.8"
                fill="var(--black)" stroke="var(--black)" hover-fill="var(--razzmatazz)"
                @click="navigateTo('/contact')" />
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import RoughButton from './RoughButton.vue'
import rough from 'roughjs'

const router = useRouter()
const navbarBgSvg = ref(null)

function navigateTo(path) {
  router.push(path)
}

function drawNavbarBackground() {
  const svg = navbarBgSvg.value
  if (!svg) return

  const navbar = svg.parentElement
  const rect = navbar.getBoundingClientRect()
  const w = Math.max(100, Math.round(rect.width || window.innerWidth))
  const h = Math.max(50, Math.round(rect.height || 80))

  svg.setAttribute('width', String(w))
  svg.setAttribute('height', String(h))

  while (svg.firstChild) svg.removeChild(svg.firstChild)

  const rc = rough.svg(svg)
  const rectangle = rc.rectangle(2, 2, w - 4, h - 4, {
    stroke: 'var(--taupe-gray)',
    strokeWidth: 2,
    fill: 'var(--white)',
    fillStyle: 'hachure',
    hachureAngle: 45,
    hachureGap: 1,
    roughness: 2,
    bowing: 1
  })
  svg.appendChild(rectangle)
}

onMounted(() => {
  nextTick(() => {
    drawNavbarBackground()
    window.addEventListener('resize', drawNavbarBackground)
  })
})
</script>

<style scoped>
.custom-navbar {
  position: relative;
  background: transparent;
  padding: 1rem 0;
  border: none;
}

.navbar-bg-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.navbar-content {
  position: relative;
  z-index: 2;
}

.navbar-title {
  font-family: var(--font-rubik-glitch);
  color: var(--black);
  font-size: 2rem;
}

.nav-link-custom {
  text-decoration: none;
  display: block;
  margin: 0 0.25rem;
}

.nav-item {
  margin: 0.25rem 0;
}

/* Remove router-link default styles */
.nav-link-custom:hover,
.nav-link-custom:focus,
.nav-link-custom:active {
  text-decoration: none;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .nav-item {
    margin: 0.5rem 0;
    text-align: center;
  }

  .nav-link-custom {
    margin: 0;
  }
}
</style>
