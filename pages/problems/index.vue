<template>
  <div class="problem w">
    <table
      cellpadding="30"
      cellspacing="0"
      width="1200"
    >
      <thead>
        <tr>
          <th>#</th>
          <th>题名</th>
          <th>上传时间</th>
          <th>难度</th>
        </tr>
      </thead>
      <tbody class="problem_data">
        <tr
          v-for="problem in problems"
          :key="problem.QID"
        >
          <th><span>{{ problem.QID }}</span></th>
          <th class="problem_title">
            <span
              :routerIndex="problem.QID"
              @click="problemClick(problem.QID)"
            >{{ problem.Title }}</span>
          </th>
          <th><span>{{ problem.Time }}</span></th>
          <th><span>{{ problem.Difficulty }}</span></th>
        </tr>
      </tbody>
      <tbody class="problem_pagination">
        <n-pagination
          v-model:page="pageIndex"
          v-model:page-size="pageSize"
          show-size-picker
          :item-count="problemsNum"
          :page-sizes="[1, 10, 20, 30, 40]"
          :on-update:page="(page: number) => {
            pageChange({ index: page });
          }"
          :on-update:page-size="(pageSize: number) => {
            pageChange({ size: pageSize });
          }"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang='ts'>
  // import { userStatus } from '@/store/mutations';
  // import { identity } from '@/store/getters';

  import { NInput, NList, NListItem, NModal, NCard, FormItemRule, NPagination } from 'naive-ui';
  import { ref, watchEffect, watch, h, resolveComponent } from 'vue';
  import qs from 'qs';
  import { navigateTo, definePageMeta } from '#imports';
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
    componentKey: 'problems'
  });
  const store = useStore();

  const { isLogin } = storeToRefs(store);

  const problemsNum = ref(10);
  const pageIndex = ref(1);
  const pageSize = ref(1);
  const problems = ref([
    {
      QID: 1,
      Title: '',
      Time: '',
      Difficulty: '',
    },
    {
      QID: 2,
      Title: '',
      Time: '',
      Difficulty: '',
    },
  ]);
  const problemClick = async (index: number) => {
    if (isLogin.value) {
      console.log(isLogin.value);
      await navigateTo({
        path: '/problems/problem_detail',
        query: {
          problemIndex: index,
        }
      });
    }
    else {
      sendMessage.warning('尚未登录，请先登录');
    }

  };

  const pageChange = async ({
    index,
    size
  }: {
    index?: number,
    size?: number
  }) => {
    let paginationIndex = index || pageIndex.value;
    let paginationSize = size || pageSize.value;
    console.log(paginationIndex, paginationSize);
    if (paginationIndex < 1 || paginationSize < 1) {
      sendMessage.error('页码或页大小不能小于1');
      return;
    }
    if (index) {
      pageIndex.value = index;
    }
    if (size) {
      pageSize.value = size;
    }
    try {
      const res = await models.getProblemList({
        startNum: (paginationIndex - 1) * paginationSize,
        endNum: (paginationIndex) * paginationSize,
      });
      problems.value = res.questionsList;
      problemsNum.value = res.totalNum;
      // console.log(problems.value, JSON.stringify(res, null, 2));
    } catch (error) {
      console.error(error);
      const { message } = error as Error;
      sendMessage.error(String(message || '请求失败'));
    }
  };

  pageChange({});
</script>


<style scoped>
  @import "~/assets/css/all.css";
  @import "~/assets/css/problems_list.css";
  @import "~/assets/stylus/style.css";
</style>