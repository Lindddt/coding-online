<template>
  <div class="w markdown">
    <!-- <textarea
      v-model="markdown_content"
      rows="8"
      class="markdown_content"
    /> -->
    <MonacoEditor
      v-model="value"
      lang="typescript"
    />
    <div id="header">
      基础版 Monaco Editor
    </div>
    <div id="codeEditBox" />
    <!--    <button @click="markdown_click()">显示</button>-->
  </div>
</template>

<script setup lang='ts'>
  import { NInput, NList, NListItem, NModal, NCard, FormItemRule } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent, nextTick } from 'vue';
  import { navigateTo, definePageMeta, useRoute } from '#imports';
  import qs from 'qs';
  import { sendMessage } from '~/utils';
  import { FormFieldConfig, FormRef } from '~/components';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm, VerificationCode } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';


  definePageMeta({
    layout: 'nav',
    componentKey: 'problem_detail'
  });
  const html = ref('');
  const options = ref({
    markdownIt: {
      linkify: true
    }
  });
  const markdown_content = ref('');

  const value = ref('');
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        // eslint-disable-next-line new-cap
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        // eslint-disable-next-line new-cap
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        // eslint-disable-next-line new-cap
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        // eslint-disable-next-line new-cap
        return new tsWorker();
      }
      // eslint-disable-next-line new-cap
      return new editorWorker();
    }
  };


</script>


<style scoped>
  @import "~/assets/stylus/style.css";
  @import "~/assets/css/all.css";
  @import "~/assets/css/code_page.css";
</style>