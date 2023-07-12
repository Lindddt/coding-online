<template>
  <div class="w markdown">
    <!-- <textarea
      v-model="markdown_content"
      rows="8"
      class="markdown_content"
    /> -->
    <div id="header">
      基础版 Monaco Editor
    </div>

    <n-space>
      <span>语言：</span>
      <n-select
        default-value="javascript"
        class="w-72"
        :virtual-scroll="false"
        :options="langOptions"
        :on-update:value="changeLanguage"
      />
      <n-button :on-click="submitCode">
        提交代码
      </n-button>
      <n-popconfirm
        @positive-click="resetCode"
      >
        <template #trigger>
          <n-button>重置代码</n-button>
        </template>
        一切都将一去杳然，任何人都无法将其捕获。
      </n-popconfirm>
    </n-space>
    <MonacoEditorNuxt
      ref="editorRef"
      v-model="codeContext"
      class="manaco"
      :options="options"
      :lang="language"
    />

    <!--    <button @click="markdown_click()">显示</button>-->
  </div>
</template>

<script setup lang='ts'>
  import { ref, computed } from 'vue';
  import { definePageMeta } from '#imports';
  import { NSpace, NSelect, NButton,NPopconfirm } from 'naive-ui';
  // import type { MonacoEditor } from '#build/components.d.ts';
  import { MonacoEditor } from '#components';
  import * as models from '~/models';

  // import * as jailed from 'jailed';

  // let code = 'console.log(\'Hello from the plugin!\');';

  // let api = {
  //   console: console
  // };

  // let plugin = new jailed.DynamicPlugin(code, api);
  // import CustomForm from '~/components/Form/CustomForm.vue';
  // https://e-chan1007.github.io/nuxt-monaco-editor/references/monaco-editor
  definePageMeta({
    layout: 'nav',
    componentKey: 'coding'
  });
  const defaultValue = `function solution(...args) {
    const res = "Hello world!";
    console.log("Hello world!");
    return res;
  }`;
  const editorRef = ref<InstanceType<typeof MonacoEditor>>();
  const langOptions = [
    {
      label: 'javascript',
      value: 'javascript'
    },
    {
      label: 'typescript',
      value: 'typescript'
    },
    {
      label: 'css',
      value: 'css'
    },
    {
      label: 'json',
      value: 'json'
    }
  ];

  const html = ref('');
  const options = ref({
    theme: 'vs-dark',
  });

  const markdown_content = ref('');

  const codeContext = ref(defaultValue);
  const language = ref('javascript');

  const changeLanguage = (v: string) => {
    language.value = v;
    console.log(language.value);
  };

  const resetCode = () => {
    codeContext.value = defaultValue;
  };
  const submitCode = async () => {
    console.log(codeContext.value);
    // await $fetch('/api/sandbox');
    await models.runCode({
      code: codeContext.value,
      input: {
        a: 1,
        b: 2
      },
    });
  };

</script>


<style scoped less>
  /* @import "~/assets/stylus/style.css";
                                              
                                              @import "~/assets/css/code_page.css"; */
  .manaco {
    height: 500px;
    width: 90%;
    margin: 20px;
    z-index: 20;
  }
</style>