module.exports = {
  extends: [
    'alloy',
    'alloy/vue',
    'plugin:vue/essential',
  ],
  'parser': '@typescript-eslint/parser',
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
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
    }]
  },
};