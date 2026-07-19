import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import router from "./router";
import { useThemeStore } from "./shared/stores/theme";
import "./assets/tailwind.css";

const app = createApp(App);
app.use(createPinia()).use(VueQueryPlugin).use(router);
useThemeStore().init();
app.mount("#app");
