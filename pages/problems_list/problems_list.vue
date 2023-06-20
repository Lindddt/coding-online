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
              @click="problem_click"
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
          :page-sizes="[1,10, 20, 30, 40]"
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
  });
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
  const problem_click = (e) => {
    let dom = e.target;

    // if (e.target.nodeName.toLowerCase() === 'span') {

    //   if (isLogin) {
    //     console.log(isLogin);
    //     let routerIndex = dom.getAttribute('routerIndex');
    //     $router.push({
    //       path: '/problem', query: {
    //         problemIndex: routerIndex
    //       }
    //     });
    //   }
    //   else {
    //     // Message({
    //     //   message: '尚未登录，请先登录',
    //     //   type: 'warning'
    //     // });
    //     console.log($parent);
    //   }

    // }
  };

  // const page_change = (index) => {
  //   page_current_index = index;
  //   page_changeAll();
  // };

  // const page_left = () => {
  //   if (page_current_index > 1) {
  //     page_current_index -= 1;
  //     page_changeAll();
  //   }

  // };

  // const pageRight = () => {
  //   if (page_current_index < Math.ceil(problemsNum.value / 10)) {
  //     page_current_index += 1;
  //     page_changeAll();
  //   }

  // };

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
  // const page_changeAll = () => {
  //   start_index = (page_current_index - 1) * 10;
  //   end_index = page_current_index * 10;
  //   // axios({
  //   //   method: 'post',
  //   //   url: '/questions_list/get_questions_list',
  //   //   data:
  //   //     qs.stringify(
  //   //       {
  //   //         startNum:start_index,
  //   //         endNum:end_index,
  //   //       })// TBD:
  //   //   ,
  //   // })
  //   //   .then(res => {
  //   //     // 获取数据
  //   //     if(res.data.errcode===0)
  //   //     {
  //   //       console.log(res.data.questionsList);
  //   //       console.log(res.data.totalNum);
  //   //       list_length=res.data.totalNum;
  //   //       console.info(res);
  //   //       if(res.data.totalNum<10)
  //   //       {
  //   //         end_index=res.data.totalNum;
  //   //       }
  //   //       problems=res.data.questionsList;
  //   //       console.log(problems);
  //   //     }
  //   //     else if(res.data.errcode===-1)
  //   //     {
  //   //       Message.error('未知错误');
  //   //     }
  //   //     else if(res.data.errcode===-2)
  //   //     {
  //   //       Message.error('序号范围错误');
  //   //     }
  //   //     /*
  //   //   $message({
  //   //     message: '载入完成',
  //   //     type: 'success'
  //   //   }); */
  //   //   })
  //   //   .catch((error) => {
  //   //     Message.error(error);
  //   //   });

  //   pageActive = page_current_index;
  //   if (page_current_index > 3 && page_current_index < Math.ceil(problems.length / 10) - 2) {
  //     page_index = page_current_index - 3;
  //   }
  //   else if (page_current_index <= 3) {
  //     page_index = 0;
  //   }
  //   else {
  //     page_index = Math.ceil(problems.length / 10) - 5;
  //   }
  // };
  // 以下为初始化
  pageChange({
  });

</script>


<style scoped>
  @import "~/assets/css/all.css";
  @import "~/assets/css/problems_list.css";
  @import "~/assets/stylus/style.css";
</style>