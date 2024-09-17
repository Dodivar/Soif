// import './assets/main.css'
import vuetify from './plugins/vuetify'

import { createApp } from 'vue'
import App from './App.vue'

import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

const app = createApp(App)

app.use(vuetify)

app.mount('#app')

// https://stackoverflow.com/questions/75714004/is-there-a-browserify-for-vite-how-can-i-use-webrtc-swarm-with-a-vite-based-pro

// https://www.sliderrevolution.com/resources/css-animated-background/
