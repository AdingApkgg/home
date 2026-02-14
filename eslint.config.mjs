// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // ─── 项目自定义规则 ───
  {
    rules: {
      // JavaScript 严格规则
      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // JavaScript
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "multi-line"],
      "no-implicit-coercion": "error",
      "no-duplicate-imports": "error",
      "no-useless-rename": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "prefer-destructuring": ["warn", { object: true, array: false }],
      "no-param-reassign": ["warn", { props: false }],
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",
      "prefer-arrow-callback": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-extend-native": "error",
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",
      "no-return-assign": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-lone-blocks": "error",

      // Vue 严格规则
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",
      "vue/block-order": [
        "error",
        { order: ["template", "script", "style"] },
      ],
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/define-macros-order": [
        "error",
        { order: ["defineProps", "defineEmits"] },
      ],
      "vue/no-empty-component-block": "warn",
      "vue/no-static-inline-styles": "warn",
      "vue/prefer-true-attribute-shorthand": "warn",
      "vue/eqeqeq": ["error", "always"],
      "vue/no-useless-v-bind": "error",
      "vue/no-useless-mustaches": "error",
      "vue/prefer-separate-static-class": "warn",
      "vue/html-self-closing": [
        "error",
        {
          html: { void: "always", normal: "never", component: "always" },
          svg: "always",
          math: "always",
        },
      ],
      "vue/padding-line-between-blocks": ["warn", "always"],
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  },
);
