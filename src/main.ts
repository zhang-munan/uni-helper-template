import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
import App from './App.vue'
import 'uno.css'

const pinia = createPinia()

export function createApp() {
  const app = createSSRApp(App).use(pinia)
  return {
    app,
  }
}
