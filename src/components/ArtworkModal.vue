<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal" @keydown.esc="closeModal">
    <div class="modal-container" @click.stop>
      <button class="modal-close" @click="closeModal" aria-label="Cerrar modal">
        <svg ref="closeSvg" class="close-svg" xmlns="http://www.w3.org/2000/svg"></svg>
        <span class="close-icon">×</span>
      </button>

      <div class="modal-content">
        <!-- Image Section with Zoom -->
        <div class="modal-image-section">
          <div class="zoom-container" ref="zoomContainer">
            <!-- Zoomist container -->
            <div class="zoomist-container" ref="zoomistContainer">
              <div class="zoomist-wrapper">
                <div class="zoomist-image">
                  <img :src="artwork.image || 'https://via.placeholder.com/600x400/333333/ffffff?text=Artwork'"
                    :alt="artwork.title" />
                </div>
              </div>
            </div>
            
            <!-- Zoom Controls -->
            <div class="zoom-controls">
              <RoughButton label="−" variant="filled" :padding-x="6" :padding-y="4" @click="zoomOut" class="zoom-btn" />
              <span class="zoom-level">{{ Math.round(currentZoom * 100) }}%</span>
              <RoughButton label="+" variant="filled" :padding-x="6" :padding-y="4" @click="zoomIn" class="zoom-btn" />
              <RoughButton label="⌂" variant="filled" :padding-x="6" :padding-y="4" @click="resetZoom" class="zoom-btn"
                title="Restaurar zoom" />
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="modal-info">
          <div class="modal-year">{{ artwork.year }}</div>
          <h2 class="modal-title">{{ artwork.title }}</h2>
          <p class="modal-description">{{ artwork.description }}</p>

          <!-- Actions -->
          <div class="modal-actions">
            <RoughButton :label="artwork.actions.music.label" variant="filled" :padding-x="12" :padding-y="8"
              @click="handleAction(artwork.actions.music)" class="modal-action-btn" />
            <RoughButton :label="artwork.actions.commission.label" variant="lined" :padding-x="12" :padding-y="8"
              @click="handleAction(artwork.actions.commission)" class="modal-action-btn" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onBeforeUnmount } from 'vue'
import RoughButton from './RoughButton.vue'
import rough from 'roughjs'
import Zoomist from 'zoomist'
import 'zoomist/css'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  artwork: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close', 'action'])

const closeSvg = ref(null)
const zoomContainer = ref(null)
const zoomistContainer = ref(null)
const currentZoom = ref(1)
let zoomistInstance = null

function closeModal() {
  emit('close')
}

function handleAction(action) {
  emit('action', action)
}

function zoomIn() {
  if (zoomistInstance) {
    const newScale = Math.min(currentZoom.value + 0.25, 3)
    zoomistInstance.zoomTo(newScale)
    // Force update the current zoom value
    setTimeout(() => {
      currentZoom.value = newScale
    }, 50)
  }
}

function zoomOut() {
  if (zoomistInstance) {
    const newScale = Math.max(currentZoom.value - 0.25, 0.5)
    zoomistInstance.zoomTo(newScale)
    // Force update the current zoom value
    setTimeout(() => {
      currentZoom.value = newScale
    }, 50)
  }
}

function resetZoom() {
  if (zoomistInstance) {
    zoomistInstance.reset()
    currentZoom.value = 1
  }
}

function initializeZoomist() {
  if (zoomistContainer.value && !zoomistInstance) {
    zoomistInstance = new Zoomist(zoomistContainer.value, {
      maxScale: 3,
      minScale: 0.5,
      bounds: true,
      wheel: true,
      slider: false,
      zoomer: false,
      on: {
        zoom(zoomist, scale) {
          currentZoom.value = scale
        }
      }
    })
  }
}

function destroyZoomist() {
  if (zoomistInstance) {
    zoomistInstance.destroy()
    zoomistInstance = null
  }
}

function drawRoughElements() {
  // Draw close button background
  if (closeSvg.value) {
    const svg = closeSvg.value
    svg.setAttribute('width', '40')
    svg.setAttribute('height', '40')
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const rc = rough.svg(svg)
    const circle = rc.circle(20, 20, 36, {
      stroke: 'var(--razzmatazz)',
      strokeWidth: 2,
      fill: 'var(--white)',
      fillStyle: 'solid',
      roughness: 2
    })
    svg.appendChild(circle)
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      drawRoughElements()
      initializeZoomist()
      document.addEventListener('keydown', handleKeydown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    })
  } else {
    destroyZoomist()
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
    currentZoom.value = 1 // Reset zoom when modal closes
  }
})

onBeforeUnmount(() => {
  destroyZoomist()
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 8, 14, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: var(--white);
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  transition: transform 0.2s ease;
}

.modal-close:hover {
  transform: scale(1.1);
}

.close-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  z-index: 1;
}

.close-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: var(--razzmatazz);
  pointer-events: none;
  z-index: 2;
  line-height: 1;
}

.modal-content {
  display: flex;
  min-height: 500px;
  max-height: calc(90vh - 40px);
}

.modal-image-section {
  flex: 2;
  position: relative;
  background: var(--platinum);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.zoom-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Zoomist container styles */
.zoomist-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoomist-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoomist-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.zoomist-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}

/* Hide default Zoomist controls */
.zoomist-slider,
.zoomist-zoomer {
  display: none !important;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  z-index: 100;
  pointer-events: auto;
}

.zoom-btn {
  min-width: 24px;
}

.zoom-level {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--white);
  min-width: 40px;
  text-align: center;
}

.modal-info {
  flex: 1;
  padding: 40px;
  background: var(--black);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 350px;
}

.modal-year {
  font-size: 1rem;
  color: var(--razzmatazz);
  font-weight: bold;
  margin-bottom: 1rem;
}

.modal-title {
  font-family: var(--font-rubik-glitch);
  font-size: 2.5rem;
  color: var(--white);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.modal-description {
  font-size: 1.1rem;
  color: var(--platinum);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.modal-action-btn {
  flex: 1;
  justify-content: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive design */
@media (max-width: 1024px) {
  .modal-content {
    flex-direction: column;
    max-height: none;
  }

  .modal-image-section {
    flex: none;
    height: 50vh;
    min-height: 300px;
  }

  .modal-info {
    flex: none;
    min-width: auto;
    padding: 30px;
  }

  .modal-title {
    font-size: 2rem;
  }

  .modal-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-container {
    max-width: 95vw;
    max-height: 95vh;
  }

  .modal-image-section {
    height: 40vh;
    min-height: 250px;
  }

  .modal-info {
    padding: 20px;
  }

  .modal-title {
    font-size: 1.75rem;
  }

  .modal-description {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .modal-actions {
    flex-direction: row;
    gap: 0.5rem;
  }

  .zoom-controls {
    bottom: 10px;
    padding: 6px 10px;
    gap: 6px;
  }

  .zoom-btn {
    min-width: 20px;
  }

  .zoom-level {
    font-size: 0.7rem;
    min-width: 35px;
  }
}
</style>
