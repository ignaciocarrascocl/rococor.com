<template>
  <div class="cool-slider">
    <!-- Custom Navigation Arrows -->
    <div class="rough-nav-prev" @click="prevSlide">
      <svg ref="prevArrowSvg" class="nav-arrow-svg" xmlns="http://www.w3.org/2000/svg"></svg>
      <span class="arrow-icon">‹</span>
    </div>
    <div class="rough-nav-next" @click="nextSlide">
      <svg ref="nextArrowSvg" class="nav-arrow-svg" xmlns="http://www.w3.org/2000/svg"></svg>
      <span class="arrow-icon">›</span>
    </div>

    <!-- Custom Pagination -->
    <div class="rough-pagination">
      <div v-for="(slide, index) in slides" :key="`pagination-${slide.id}`" class="rough-bullet"
        :class="{ active: currentSlide === index }" @click="goToSlide(index)">
        <svg :ref="el => setBulletRef(el, index)" class="bullet-svg" xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    </div>

    <swiper :modules="modules" :slides-per-view="1" :space-between="30" :loop="true" :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }" :navigation="false" :pagination="false" :effect="'fade'" :fade-effect="{
      crossFade: true
    }" class="slider-swiper" @slide-change="onSlideChange" @swiper="onSwiper">
      <swiper-slide v-for="slide in slides" :key="slide.id" class="slide">
        <div class="slide-content">
          <div class="slide-image" @click="openModal(slide)">
            <div class="image-background">
              <svg :ref="el => setImageBgRef(el, slide.id)" class="image-bg-svg"
                xmlns="http://www.w3.org/2000/svg"></svg>
            </div>
            <img :src="slide.image" :alt="slide.title" class="img-fluid" />
            <div class="image-overlay"></div>
          </div>
          <div class="slide-info">
            <div class="slide-year">{{ slide.year }}</div>
            <h3 class="slide-title">{{ slide.title }}</h3>
            <p class="slide-description">{{ slide.description }}</p>
            <div class="slide-actions">
              <RoughButton :label="slide.actions.more.label" variant="lined" :padding-x="8" :padding-y="4"
                @click="openModal(slide)" class="action-btn" />
              <RoughButton :label="slide.actions.music.label" variant="lined" :padding-x="8" :padding-y="4"
                @click="handleAction(slide.actions.music)" class="action-btn" />
              <RoughButton :label="slide.actions.commission.label" variant="lined" :padding-x="8" :padding-y="4"
                @click="handleAction(slide.actions.commission)" class="action-btn" />
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Artwork Modal -->
    <ArtworkModal :is-open="showModal" :artwork="selectedArtwork" @close="closeModal" @action="handleAction" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import RoughButton from './RoughButton.vue'
import ArtworkModal from './ArtworkModal.vue'
import rough from 'roughjs'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const modules = [Navigation, Pagination, Autoplay, EffectFade]

const prevArrowSvg = ref(null)
const nextArrowSvg = ref(null)
const bulletRefs = ref([])
const imageBgRefs = ref([])
const swiperInstance = ref(null)
const currentSlide = ref(0)
const showModal = ref(false)
const selectedArtwork = ref(null)

const setBulletRef = (el, index) => {
  if (el) bulletRefs.value[index] = el
}

const setImageBgRef = (el, slideId) => {
  if (el) imageBgRefs.value[slideId] = el
}

const slides = ref([
  {
    id: 1,
    image: '/sampleImages/1491612.jpg',
    title: 'Caos Urbano',
    description: 'Una explosión de color y rebeldía que captura la esencia de la contracultura urbana.',
    year: '2024',
    band: 'The Clash',
    song: 'London Calling',
    actions: {
      more: { label: 'Ver más', action: 'view', id: 1 },
      music: { label: '▶ The Clash - London Calling', action: 'play', id: 1 },
      commission: { label: 'Quiero uno', action: 'commission', id: 1 }
    }
  },
  {
    id: 2,
    image: '/sampleImages/2461739.webp',
    title: 'Anarquía Visual',
    description: 'Técnica mixta que combina fotografía, pintura y elementos encontrados.',
    year: '2024',
    band: 'Dead Kennedys',
    song: 'Holiday in Cambodia',
    actions: {
      more: { label: 'Ver más', action: 'view', id: 2 },
      music: { label: '▶ Dead Kennedys - Holiday in Cambodia', action: 'play', id: 2 },
      commission: { label: 'Quiero uno', action: 'commission', id: 2 }
    }
  },
  {
    id: 3,
    image: '/sampleImages/4621049.webp',
    title: 'Resistencia Creativa',
    description: 'Obra provocadora que desafía las normas sociales y simbolismo punk.',
    year: '2023',
    band: 'Sex Pistols',
    song: 'Anarchy in the UK',
    actions: {
      more: { label: 'Ver más', action: 'view', id: 3 },
      music: { label: '▶ Sex Pistols - Anarchy in the UK', action: 'play', id: 3 },
      commission: { label: 'Quiero uno', action: 'commission', id: 3 }
    }
  },
  {
    id: 4,
    image: '/sampleImages/5253396.webp',
    title: 'Subversión Artística',
    description: 'Instalación que rompe barreras entre arte y activismo social.',
    year: '2024',
    band: 'Black Flag',
    song: 'Rise Above',
    actions: {
      more: { label: 'Ver más', action: 'view', id: 4 },
      music: { label: '▶ Black Flag - Rise Above', action: 'play', id: 4 },
      commission: { label: 'Quiero uno', action: 'commission', id: 4 }
    }
  }
])

function drawRoughElements() {
  // Draw navigation arrows
  if (prevArrowSvg.value) {
    const svg = prevArrowSvg.value
    svg.setAttribute('width', '50')
    svg.setAttribute('height', '50')
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const rc = rough.svg(svg)
    const circle = rc.circle(25, 25, 46, { // Slightly smaller circle to fit better
      stroke: 'var(--razzmatazz)',
      strokeWidth: 2,
      fill: 'var(--white)',
      fillStyle: 'solid',
      roughness: 2
    })
    svg.appendChild(circle)
  }

  if (nextArrowSvg.value) {
    const svg = nextArrowSvg.value
    svg.setAttribute('width', '50')
    svg.setAttribute('height', '50')
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const rc = rough.svg(svg)
    const circle = rc.circle(25, 25, 46, { // Slightly smaller circle to fit better
      stroke: 'var(--razzmatazz)',
      strokeWidth: 2,
      fill: 'var(--white)',
      fillStyle: 'solid',
      roughness: 2
    })
    svg.appendChild(circle)
  }

  // Draw pagination bullets
  bulletRefs.value.forEach((svg, index) => {
    if (svg) {
      svg.setAttribute('width', '16')
      svg.setAttribute('height', '16')
      while (svg.firstChild) svg.removeChild(svg.firstChild)

      const rc = rough.svg(svg)
      const isActive = currentSlide.value === index
      const circle = rc.circle(8, 8, isActive ? 14 : 10, {
        stroke: 'var(--razzmatazz)',
        strokeWidth: isActive ? 2 : 1,
        fill: isActive ? 'var(--razzmatazz)' : 'var(--white)',
        fillStyle: 'solid',
        roughness: 1.5
      })
      svg.appendChild(circle)
    }
  })

  // Draw image backgrounds
  slides.value.forEach(slide => {
    const svg = imageBgRefs.value[slide.id]
    if (svg) {
      const parent = svg.parentElement
      const rect = parent.getBoundingClientRect()
      const w = Math.max(100, Math.round(rect.width || 300))
      const h = Math.max(100, Math.round(rect.height || 200))

      svg.setAttribute('width', String(w))
      svg.setAttribute('height', String(h))
      while (svg.firstChild) svg.removeChild(svg.firstChild)

      const rc = rough.svg(svg)
      const rectangle = rc.rectangle(5, 5, w - 10, h - 10, {
        stroke: 'var(--razzmatazz)',
        strokeWidth: 3,
        fill: 'var(--white)',
        fillStyle: 'solid',
        roughness: 2.5,
        bowing: 2
      })
      svg.appendChild(rectangle)
    }
  })
}

function onSwiper(swiper) {
  swiperInstance.value = swiper
}

function onSlideChange(swiper) {
  currentSlide.value = swiper.realIndex
  nextTick(() => {
    drawRoughElements()
  })
}

function prevSlide() {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev()
  }
}

function nextSlide() {
  if (swiperInstance.value) {
    swiperInstance.value.slideNext()
  }
}

function goToSlide(index) {
  if (swiperInstance.value) {
    swiperInstance.value.slideToLoop(index)
  }
}

function openModal(artwork) {
  selectedArtwork.value = artwork
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedArtwork.value = null
}

function handleAction(action) {
  console.log(`Acción activada: ${action.action} para obra ${action.id}`)

  switch (action.action) {
    case 'view':
      // This case is now handled by the modal
      console.log('Mostrando más detalles de la obra...')
      break
    case 'play':
      console.log('Reproduciendo música...')
      break
    case 'commission':
      console.log('Iniciando proceso de encargo...')
      break
    default:
      console.log('Acción no reconocida')
  }
}

onMounted(() => {
  nextTick(() => {
    drawRoughElements()
  })
})
</script>

<style scoped>
.cool-slider {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--black);
}

/* Custom Navigation Arrows */
.rough-nav-prev,
.rough-nav-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  /* Higher z-index to ensure visibility */
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
}

.rough-nav-prev {
  left: 20px;
}

.rough-nav-next {
  right: 20px;
}

.rough-nav-prev:hover,
.rough-nav-next:hover {
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  z-index: 1;
}

.arrow-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
  color: var(--razzmatazz);
  pointer-events: none;
  z-index: 2;
  line-height: 1;
}

/* Custom Pagination */
.rough-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 20;
  /* Higher z-index */
}

.rough-bullet {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 16px;
  height: 16px;
}

.rough-bullet:hover {
  transform: scale(1.2);
}

.bullet-svg {
  width: 16px;
  height: 16px;
}

.slider-swiper {
  width: 100%;
  height: 100%;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-content {
  display: flex;
  height: 100%;
  align-items: center;
  position: relative;
  margin: 0 80px;
  /* Add margin to avoid navigation arrows */
}

.slide-image {
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 10px;
  /* Add padding for the rough background */
  cursor: pointer;
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.image-bg-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slide-image img {
  position: relative;
  z-index: 2;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 10px;
  object-fit: cover;
  transition: transform 0.6s ease;
  border-radius: 0;
  /* Remove border radius */
}

.slide:hover .slide-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(237, 29, 104, 0.1) 0%,
      rgba(10, 8, 14, 0.3) 50%,
      rgba(237, 29, 104, 0.2) 100%);
  pointer-events: none;
}

.slide-info {
  flex: 1;
  padding: 3rem;
  background: var(--black);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.slide-year {
  font-size: 0.875rem;
  color: var(--razzmatazz);
  font-weight: bold;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease forwards 0.1s;
}

.slide-title {
  font-family: var(--font-rubik-glitch);
  font-size: 1.75rem;
  color: var(--white);
  margin-bottom: 0.75rem;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease forwards 0.2s;
}

.slide-description {
  font-size: 0.95rem;
  color: var(--platinum);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease forwards 0.3s;
}

.slide-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease forwards 0.4s;
}

.action-btn {
  flex: 0 0 auto;
  font-size: 0.85rem;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .cool-slider {
    height: auto;
    min-height: 400px;
  }

  .slide-content {
    flex-direction: column;
    margin: 0 60px;
    /* Reduced margin for mobile */
  }

  .slide-image {
    height: 250px;
  }

  .slide-info {
    padding: 1.5rem;
  }

  .slide-title {
    font-size: 1.5rem;
  }

  .slide-description {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .slide-actions {
    gap: 0.25rem;
    justify-content: center;
  }

  .action-btn {
    font-size: 0.75rem;
    flex: 1 1 auto;
    min-width: 0;
  }

  .rough-nav-prev {
    left: 10px;
  }

  .rough-nav-next {
    right: 10px;
  }

  .rough-pagination {
    bottom: 10px;
  }
}
</style>
