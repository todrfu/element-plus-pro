import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import { watch } from "vue";

import { ElementPlusContainer } from "@vitepress-demo-preview/component";
import "@vitepress-demo-preview/component/dist/style.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import ElementPlusPro, { setLocale } from "@todrfu/element-plus-pro";
import "@todrfu/element-plus-pro/dist/style.css";

// switch locale when route change
const setupLocale = () => {
  const route = useRoute();
  watch(
    () => route.path,
    (path) => {
      const locale = path.includes("/zh/") ? "zh-CN" : "en";
      setLocale(locale);
    },
    { immediate: true }
  );
};

export default {
  ...DefaultTheme,
  setup() {
    setupLocale();
  },
  enhanceApp({ app }) {
    app.use(ElementPlus);
    app.use(ElementPlusPro);
    app.component("demo-preview", ElementPlusContainer);
  },
};
