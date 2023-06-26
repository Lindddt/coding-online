
module.exports = {
  extends: [
    'alloy',
    'alloy/vue',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'plugin:vue/essential',
    'plugin:vue/vue3-recommended',
  ],
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
  },
  env: {},
  // 'plugins': ['import', 'vue'],
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
    '$fetch': false,
    '$pinia': false,
    'NodeJS': false,
    'definePageMeta': false,
    'useRequestHeaders': false,
  },
  // 'parser': '@babel/eslint-parser',
  // 'parserOptions': {
  //   'babelOptions': {
  //     'presets': ['@babel/preset-react']
  //   },
  // },
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'dot-notation': 'error',
    'no-async-promise-executor': 'off',
    'no-empty': 'off',
    'no-loop-func': 'off',
    'no-plusplus': 'off',
    'vue/script-indent': ['error', 2, {  // script标签缩进设置
      'baseIndent': 1,
      'switchCase': 0,
      'ignores': []
    }],
    'vue/component-definition-name-casing': 0,
    'vue/no-unused-components': [2],
    'no-multiple-empty-lines': 2,
    'vue/multi-word-component-names': 'off',
    'no-trailing-spaces': 1, // 一行结束后面不要有空格
    'no-var': 2, // 禁用var，用let和const代替
    'consistent-this': [2, 'that'], // this别名
    'object-curly-newline': 'off',
    'vue/comment-directive': 'off',
    'vue/no-v-model-argument': 'off',
    'no-lone-blocks': 'off',
  },
};