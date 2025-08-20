import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

// project styles (keep for custom overrides)
import './index.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
