import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: ["node_modules/", "dist/"],
  },

  // Vue 3 essential rules (equivalent to "plugin:vue/vue3-essential")
  ...pluginVue.configs["flat/essential"],

  // Global configuration
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        // unplugin-auto-import globals
        defineProps: true,
        defineEmits: true,
        withDefaults: true,
        h: true,
        vue: true,
        ref: true,
        reactive: true,
        computed: true,
        watch: true,
        provide: true,
        inject: true,
        defineComponent: true,
        onBeforeMount: true,
        onMounted: true,
        onBeforeUnmount: true,
        nextTick: true,
        // Element Plus
        ElMessage: true,
        // Custom
        $openList: true,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
