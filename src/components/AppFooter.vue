<template>
  <footer class="custom-footer">
    <svg ref="footerBgSvg" class="footer-bg-svg" xmlns="http://www.w3.org/2000/svg"></svg>
    <div class="container py-4 text-center footer-content">
      © {{ year }} Rococor — built with Vue + Vite
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import rough from 'roughjs'

const year = new Date().getFullYear()
const footerBgSvg = ref(null)

function drawFooterBackground() {
  const svg = footerBgSvg.value
  if (!svg) return

  const footer = svg.parentElement
  const rect = footer.getBoundingClientRect()
  const w = Math.max(100, Math.round(rect.width || window.innerWidth))
  const h = Math.max(50, Math.round(rect.height || 60))

  svg.setAttribute('width', String(w))
  svg.setAttribute('height', String(h))

  while (svg.firstChild) svg.removeChild(svg.firstChild)

  const rc = rough.svg(svg)
  const rectangle = rc.rectangle(2, 2, w - 4, h - 4, {
    stroke: 'var(--taupe-gray)',
    strokeWidth: 2,
    fill: 'var(--white)',
    fillStyle: 'hachure',
    hachureAngle: -45,
    hachureGap: 1,
    roughness: 2,
    bowing: 1
  })
  svg.appendChild(rectangle)
}

onMounted(() => {
  nextTick(() => {
    drawFooterBackground()
    window.addEventListener('resize', drawFooterBackground)
  })
})
</script>

<style scoped>
.custom-footer {
  position: relative;
  background: transparent;
  border: none;
  margin-top: 2rem;
}

.footer-bg-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.footer-content {
  position: relative;
  z-index: 2;
  color: var(--black) !important;
}
</style>
