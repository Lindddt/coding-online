<template>
  <div class="w">
    <custom-form
      ref="formRef"
      :form-list="formConfigList"
      :on-submit="onSubmit"
      confirm-text="创建"
      label-placement="left"
    />
    <h3>题目：{{ title }}</h3>
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
    </ClientOnly>
  </div>
</template>

<script setup lang='ts'>
  import { NInput, NList, NListItem, NModal, NCard, FormItemRule } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent } from 'vue';
  import { navigateTo, definePageMeta, useRoute } from '#imports';
  import qs from 'qs';
  import { sendMessage } from '~/utils';
  import { FormFieldConfig, FormRef } from '~/components';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm, MarkDownEditor } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';
  const MarkDownEditorComp = resolveComponent('MarkDownEditor');

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
      value: '',
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
  // title: this.questions[i].title,
  //   time: Date(),
  //     difficulty: "Middle",
  //       content: this.questions[i].content,
  //         remark: this.questions[i].remark,
  //           inputFormat: this.questions[i].input_format,
  //             inputExample: this.questions[i].input_data.toString(),
  //               outputExample: this.questions[i].output_data.toString()
  const formConfigList = ref<FormFieldConfig[]>(basicConfig);
  const onSubmit = async (formValue: Record<string, any>) => {
    
  };

  const getUrl = () => {
    console.log(route.params);
  };


  const getProblemDetail = async () => {
    getUrl();
    try {
      const res = await models.getProblemDetail({ id: 1 });
      inputExample.value = [res.InputExample];
      id.value = res.QID;
      title.value = res.Title;
      outputExample.value = [res.OutputExample];
      content.value = res.Content;
      remark.value = res.Remark;
      inputformat.value = res.InputFormat;
    } catch (error) {

    }
  };
  getProblemDetail();
  // axios({
  //   method: 'post',
  //   url: '/question/get_question_detail?id=' + this.$route.query.problemIndex.toString(),
  // })
  //   .then(res => {
  //     // 获取数据
  //     if (res.data.errcode === 0) {

  //       this.inputExample = [res.data.inputExample];
  //       this.id = res.data.id;
  //       this.title = res.data.title;
  //       this.outputExample = [res.data.outputExample];
  //       this.content = res.data.content;
  //       this.remark = res.data.remark;
  //       this.inputformat = res.data.inputFormat;
  //       console.log(res.data);
  //     }
  //     else if (res.data.errcode === -2) {
  //       Message.error('查询不到题目');
  //     }
  //     else if (res.data.errcode === -1) {
  //       Message.error('未知错误');

  //     }
  //     else {
  //       Message.error('未知错误');

  //     }
  //     /*
  //   this.$message({
  //     message:res.data,
  //     type: 'success'
  //   }); */
  //   })
  //   .catch(function (error) {
  //     this.$message.error(error);
  //   });
  content.value = '';
                        /*    this.$message({
  message: this.$route.query.problemIndex,
  type: 'success'
  }); */


</script>

<style scoped>
  @import "~/assets/stylus/style.css";
  @import "~/assets/css/all.css";
  @import "~/assets/css/problem_detail.css";
</style>