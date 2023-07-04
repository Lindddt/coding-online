// https://ithelp.ithome.com.tw/articles/10299002
import { defineNuxtPlugin } from '#app';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

export default defineNuxtPlugin(nuxtApp => {
  // http://ckang1229.gitee.io/vue-markdown-editor/zh/api.html#methods
  VMdEditor.use(githubTheme, {
    Hljs: hljs,
  });
  nuxtApp.vueApp.use(VMdEditor);
});