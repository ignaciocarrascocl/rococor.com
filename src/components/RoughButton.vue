<template>
  <button ref="btnRef" class="rough-button" @click="$emit('click')">
    <svg ref="svgRef" class="rough-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
    <span class="label" :style="labelStyle">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onBeforeUnmount, computed } from 'vue'
import rough from 'roughjs'

const props = defineProps({
  label: { type: String, default: 'Button' },
  paddingX: { type: Number, default: 18 },
  paddingY: { type: Number, default: 10 },
  variant: { type: String, default: 'filled', validator: (value) => ['filled', 'lined'].includes(value) },
  fill: { type: String, default: 'var(--razzmatazz)' },
  stroke: { type: String, default: 'transparent' },
  strokeWidth: { type: Number, default: 0 },
  hoverFill: { type: String, default: 'var(--taupe-gray)' },
  hoverStroke: { type: String, default: 'transparent' },
  roughness: { type: Number, default: 2.5 },
  bowing: { type: Number, default: 3 },
  fillWeight: { type: Number, default: 1 }
})

const btnRef = ref(null)
const svgRef = ref(null)
const isHover = ref(false)
let resizeObserver = null

const labelStyle = computed(() => ({
  padding: `${props.paddingY}px ${props.paddingX}px`,
  color: props.variant === 'filled' ? 'var(--white)' : (isHover.value ? 'var(--white)' : 'var(--white)'),
  fontWeight: 'bold',
  fontSize: '1rem'
}))

function draw() {
  const btn = btnRef.value
  const svg = svgRef.value
  if (!btn || !svg) return

  const rect = btn.getBoundingClientRect()
  const w = Math.max(2, Math.round(rect.width))
  const h = Math.max(2, Math.round(rect.height))

  svg.setAttribute('width', String(w))
  svg.setAttribute('height', String(h))

  // Clear previous content
  while (svg.firstChild) svg.removeChild(svg.firstChild)

  const rc = rough.svg(svg)

  const isFilledVariant = props.variant === 'filled'

  const opts = {
    stroke: isFilledVariant ? 'transparent' : 'transparent', // No borders for both variants
    strokeWidth: 0, // Always no stroke
    fill: isHover.value ? props.hoverFill : (isFilledVariant ? props.fill : props.fill),
    fillStyle: isFilledVariant ? 'hachure' : 'solid', // Hachure for filled, solid for lined
    fillWeight: props.fillWeight,
    hachureAngle: isHover.value ? 45 + Math.random() * 10 : -45 + Math.random() * 10,
    hachureGap: isFilledVariant ? 2 : 0, // Gaps only for hachure
    roughness: isHover.value ? props.roughness + 0.5 : props.roughness,
    bowing: props.bowing + Math.random() * 1,
    curveStepCount: 6,
    curveFitting: 0.8,
    seed: Math.floor(Math.random() * 1000)
  }

  const node = rc.rectangle(1, 1, w - 2, h - 2, opts)
  svg.appendChild(node)
}

onMounted(() => {
  nextTick(() => {
    draw()
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(draw)
      resizeObserver.observe(btnRef.value)
    }

    const btn = btnRef.value
    if (btn) {
      btn.addEventListener('mouseenter', () => { isHover.value = true; draw() })
      btn.addEventListener('mouseleave', () => { isHover.value = false; draw() })
    }
  })
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

watch(() => [props.variant, props.fill, props.stroke, props.strokeWidth, props.paddingX, props.paddingY, props.roughness, props.bowing, props.fillWeight, isHover.value], draw)
</script>

<style scoped>
.rough-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.rough-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.label {
  position: relative;
  z-index: 1;
  display: inline-block;
}
</style>
