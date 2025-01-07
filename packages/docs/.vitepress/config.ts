import { defineConfig } from "vitepress";
import {
  containerPreview,
  componentPreview,
} from "@vitepress-demo-preview/plugin";
import { zhConfig, enConfig } from "./locales";

export default defineConfig({
  title: "Element Plus Pro",
  description: "Extension Component Library Based on Element Plus",
  base: "/element-plus-pro/",

  locales: {
    root: {
      label: "English",
      lang: "en",
      ...enConfig,
    },
    zh: {
      label: "中文",
      lang: "zh",
      ...zhConfig,
    },
  },

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "Components", link: "/components/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/" },
            { text: "Getting Started", link: "/guide/getting-started" },
          ],
        },
      ],
      "/components/": [
        {
          text: "Data Transfer",
          items: [{ text: "TransferTree", link: "/components/transfer-tree" }],
        },
        {
          text: "Form Components",
          items: [],
        },
        {
          text: "Data Display",
          items: [],
        },
      ],
    },
  },
  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
});
