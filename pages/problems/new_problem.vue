<template>
  <n-card
    title="创建新问题"
    class="bg-white w-11/12 items-center mx-auto p-4 rounded-md"
    content-style="width: 100%;"
  >
    <custom-form
      ref="formRef"
      class="w-full"
      :form-list="formConfigList"
      :on-submit="onSubmit"
      confirm-text="创建"
      label-placement="left"
    />
    <!-- <IODataEditor
      item-key="dsadsad"
    /> -->
    <!-- <h3>题目：{{ title }}</h3>
    <h3>题目描述</h3>
    <p class="post_content">
      {{ content }}
    </p>
    <br>
    <h3>输入格式</h3>
    <p class="post_content">
      {{ inputformat }}
    </p>
    <br>
    <h3>样例数据</h3>
    <p class="post_content">
      输入
    </p>
    <ul class="input_output">
      <li
        v-for="i in inputExample.length"
        :key="`input_${i}`"
      >
        {{ inputExample[i - 1] }}
      </li>
    </ul>
    <p class="post_content">
      输出
    </p>
    <ul class="input_output">
      <li
        v-for="i in outputExample.length"
        :key="`output_${i}`"
      >
        {{ outputExample[i - 1] }}
      </li>
    </ul>
    <h3>备注</h3>
    <p class="post_content">
      {{ content }}
    </p>
    <ClientOnly
      fallback-tag="span"
      fallback="Loading Markdown..."
    >
      <v-md-editor
        v-model="markdown"
        height="400px"
        @change="getUrl"
      />
    </ClientOnly> -->
  </n-card>
</template>

<script setup lang='ts'>
  import { NInput, NList, NListItem, NModal, NCard, FormItemRule } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent } from 'vue';
  import { navigateTo, definePageMeta, useRoute } from '#imports';
  import qs from 'qs';
  import { sendMessage } from '~/utils';
  import { FormFieldConfig, FormRef, JSONSchema } from '~/components';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm, MarkDownEditor, IODataEditor } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';
  const MarkDownEditorComp = resolveComponent('MarkDownEditor');
  const IODataEditorComp = resolveComponent('IODataEditor');


  const route = useRoute();
  definePageMeta({
    layout: 'nav',
    componentKey: 'problem_detail'
  });
  const id = ref(1);
  const title = ref('');
  const inputformat = ref('');
  const inputExample = ref<string[]>([]);
  const outputExample = ref<string[]>([]);
  const content = ref('');
  const remark = ref('');
  const markdown = ref('# Hello World');
  const basicConfig: FormFieldConfig[] = [
    {
      key: 'title',
      value: '',
      formType: 'input',
      label: '题目',
      placeholder: '请输入题目',
      type: 'text',
      rule: {
        required: true,
      }
    },
    {
      key: 'difficulty',
      value: 'Middle',
      formType: 'select',
      label: '难度',
      placeholder: '请选择难度',
      options: [
        {
          value: 'Middle',
          label: '中等'
        },
        {
          value: 'Easy',
          label: '简单'
        },
        {
          value: 'Hard',
          label: '困难'
        }
      ],
      rule: {
        required: true,
      },
    },
    {
      label: '题目描述',
      key: 'content',
      formType: 'custom',
      render: ({ formData, changeData, validate }) => h(MarkDownEditorComp, {
        'formData': formData,
        'itemKey': 'content',
        'changeData': changeData,
        'validate': validate,
      }),
    },
    {
      key: 'inputFormat',
      value: '',
      formType: 'input',
      label: '输入格式',
      placeholder: '请输入输入格式',
      type: 'text',
      rule: {
        required: true,
      }
    },
    {
      key: 'outputFormat',
      value: '',
      formType: 'input',
      label: '输入格式',
      placeholder: '请输入输入格式',
      type: 'text',
      rule: {
        required: true,
      }
    },
    {
      key: 'ioData',
      value: '',
      label: '输入输出',
      formType: 'custom',
      render: ({ formData, changeData, validate }) => h(IODataEditorComp, {
        'formData': formData,
        'itemKey': 'ioData',
        'changeData': changeData,
        'validate': validate,
      }),
    },
    {
      label: '备注',
      key: 'remark',
      formType: 'custom',
      render: ({ formData, changeData, validate }) => h(MarkDownEditorComp, {
        'formData': formData,
        'itemKey': 'content',
        'changeData': changeData,
        'validate': validate,
      }),
    },
  ];
  const formConfigList = ref<FormFieldConfig[]>(basicConfig);
  const onSubmit = async (formValue: Record<string, any>) => {
    console.log(formValue);
    const inputData: JSONSchema[] = [];
    const outputData: JSONSchema[] = [];
    const ioList = JSON.parse(formValue.ioData);
    ioList.forEach((item: any) => {
      inputData.push(item.input);
      outputData.push(item.output);
    });

    const res = await models.newQuestion({
      title: formValue.title,
      difficulty: formValue.difficulty,
      content: formValue.content,
      remark: formValue.remark,
      inputFormat: formValue.inputFormat,
      inputData: JSON.stringify(inputData),
      outputData: JSON.stringify(outputData),
    });
    sendMessage.success('创建成功');
    await navigateTo({
      path: '/problems/problem_detail',
      query: {
        problemIndex: res,
      }
    });
  };

  const getUrl = () => {
    console.log(route.params);
  };

</script>

<style scoped>
  @import "~/assets/stylus/style.css";

  @import "~/assets/css/problem_detail.css";
</style>