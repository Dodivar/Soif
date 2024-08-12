/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// import '@/styles/variables.scss'
// import '@/styles/vuetify/overrides.scss'

const theme = {
  primary: '#1e88e5',
  info: '#1e88e5',
  success: '#21c1d6',
  accent: '#fc4b6c',
  default: '#563dea'
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light'
    // themes: {
    //   dark: theme,
    //   light: theme
    // }
  },
  icons: {
    defaultSet: 'mdi'
  }
})
