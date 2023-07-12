<template>
  <n-card
    :title="title "
    class="bg-white w-11/12 items-center mx-auto p-4 rounded-md"
    content-style="width: 100%;"
  >
    <h3>题目描述</h3>
    <p class="post_content">
      <v-md-preview :text="content" />
    </p>
    <br>
    <h3>输入格式</h3>
    <p class="post_content">
      {{ inputformat }}
    </p>
    <br>
    <h3>样例数据</h3>
    <n-card
      content-style="padding: 0 0 0 0;"
      class="io-class"
    >
      <n-tabs
        v-model:value="openTabs"
        type="card"
        tab-style="min-width: 80px;"
      >
        <n-tab-pane
          v-for="(IOExample, index) in ioData"
          :key="index + 1"
          :name="index + 1"
        >
          <div class="pl-8">
            <h4>输入</h4>
            <br>
            <pre>{{ IOExample.input }}</pre>

            <br>
            <br>
            <br>

            <h4>输出</h4>
            <br>
            <pre>{{ IOExample.output }}</pre>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <h3>备注</h3>
    <p class="post_content">
      <v-md-preview :text="remark" />
    </p>
  </n-card>
</template>

<script setup lang='ts'>
  import { NInput, NList, NListItem, NModal, NCard, FormItemRule, NTabs, NTabPane } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent } from 'vue';
  import { navigateTo, definePageMeta, useRoute } from '#imports';
  import qs from 'qs';
  import { sendMessage } from '~/utils';
  import { FormFieldConfig, FormRef, JSONSchema } from '~/components';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  import { CustomForm, VerificationCode } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';
  const route = useRoute();

  const id = ref(1);
  const title = ref('');
  const inputformat = ref('');
  const ioData = ref<{
    input: JSONSchema;
    output: JSONSchema;
  }[]>([]);
  const openTabs = ref(1);
  const content = ref('');
  const remark = ref('');
  definePageMeta({
    layout: 'nav',
    componentKey: 'problem_detail'
  });


  const getIndex = (): number => {
    return Number(route.query.problemIndex) || 1;
  };


  const getProblemDetail = async () => {
    const res = await models.getProblemDetail({ id: getIndex() });
    id.value = res.QID;
    title.value = res.Title;
    content.value = res.Content;
    remark.value = res.Remark;
    inputformat.value = res.InputFormat;
    const outputList: JSONSchema[] = JSON.parse(res.OutputExample);
    const inputList: JSONSchema[] = JSON.parse(res.InputExample);
    if (!outputList || !inputList) {
      return;
    }
    for (let i = 0; i < Math.min(outputList.length, inputList.length); i++) {
      ioData.value.push({
        input: inputList[i],
        output: outputList[i]
      });
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

<style lang='less' scoped>
.io-class {
  border-top: 0 !important;
}
</style>