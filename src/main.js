import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';
import {createPersistedState} from'pinia-persistedstate-plugin'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const pinia = createPinia()
const persist = createPersistedState()

const app = createApp(App)

pinia.use(persist)
app.use(pinia)
app.use(ElementPlus,{locale:zhCn})
app.use(router)

app.mount('#app')
