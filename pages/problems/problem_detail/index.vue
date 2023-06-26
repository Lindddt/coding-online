<template>
  <div class="problem_detail w">
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
      <li v-for="i in inputExample.length">
        {{ inputExample[i - 1] }}
      </li>
    </ul>
    <p class="post_content">
      输出
    </p>
    <ul class="input_output">
      <li v-for="i in outputExample.length">
        {{ outputExample[i - 1] }}
      </li>
    </ul>
    <h3>备注</h3>
    <p class="post_content">
      {{ content }}
    </p>
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
  import { CustomForm, VerificationCode } from '#components';
  // import { useFetch } from 'nuxt';
  import { Identity } from '~/types';
  import { useStore } from '~/store';
  import { storeToRefs } from 'pinia';
  const route = useRoute();

  const id = ref(1);
  const title = ref('');
  const inputformat = ref('');
  const inputExample = ref([]);
  const outputExample = ref([]);
  const content = ref('');
  const remark = ref('');
  definePageMeta({
    layout: 'nav',
    componentKey: 'problem_detail'
  });


  const getUrl = () => {
    console.log(route.params);
  };


  const getProblemDetail = async () => {
    getUrl();
    try {
      const res = await models.getProblemDetail({ id: 1 });
      inputExample.value = [res.InputExample];
      id.value = res.id;
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