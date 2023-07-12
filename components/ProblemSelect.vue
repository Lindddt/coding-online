<template>
  <n-card
    title="题目列表"
    class="bg-white w-11/12 items-center mx-auto p-4 rounded-md"
    content-style="width: 100%;"
  >
    <template #header-extra>
      <n-input :value="searchValue" />
      <n-button
        type="info"
        :on-click="() => pageChange({})"
      >
        搜索题目
      </n-button>
    </template>

    <n-data-table
      remote
      :checked-row-keys="checkedRowKeys"
      :columns="columns"
      :data="problems"
      :row-key="(row: RowData) => row.QID"
      :pagination="paginationReactive"
      :row-props="rowProps"
      @update:checked-row-keys="handleCheck"
    />
  </n-card>
</template>

<script setup lang='ts'>

  import { NInput, NCard, NButton, NDataTable, PaginationProps, DataTableRowKey } from 'naive-ui';
  import { ref, reactive } from 'vue';
  import { definePageMeta } from '#imports';
  import { sendMessage } from '~/utils';
  import * as models from '~/models';
  // import CustomForm from '~/components/Form/CustomForm.vue';
  // import { useFetch } from 'nuxt';
  import { useStore } from '~/store';
  import { assignIn } from 'lodash';
  import { storeToRefs } from 'pinia';
  import { RowData, TableColumn } from 'naive-ui/es/data-table/src/interface';
  definePageMeta({
    layout: 'nav',
    componentKey: 'problems'
  });
  const store = useStore();
  const searchValue = ref('');
  const columns: TableColumn[] = [
    {
      type: 'selection',
    },
    {
      title: 'ID',
      key: 'QID'
    },
    {
      title: '难度',
      key: 'Difficulty',
    },
    {
      title: '题名',
      key: 'Title'
    },
    {
      title: '上传时间',
      key: 'Time'
    }
  ];

  const { isLogin } = storeToRefs(store);
  const checkedRowKeys = ref<DataTableRowKey[]>([]);
  // const problemsNum = ref(10);
  // const pageIndex = ref(1);
  // const pageSize = ref(1);
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


  const problemClick = async (row: RowData) => {
    console.log(row, row.QID);
    const { QID } = row;
    if (checkedRowKeys.value.includes(QID)) {
      checkedRowKeys.value = checkedRowKeys.value.filter((item) => item !== QID);
    } else {
      checkedRowKeys.value.push(QID);
    }
  };
  const handleCheck = (rowKeys: DataTableRowKey[]) => {
    console.log(rowKeys)
    checkedRowKeys.value = rowKeys;
  };

  const rowProps = (row: RowData) => {
    return {
      style: 'cursor: pointer;',
      onClick: problemClick
    };
  };

  const pageChange = async ({
    index,
    size
  }: {
    index?: number,
    size?: number
  }) => {
    let paginationIndex = index || paginationReactive.page || 1;
    let paginationSize = size || paginationReactive.pageSize || 1;
    console.log(paginationIndex, paginationSize);
    if (paginationIndex < 1 || paginationSize < 1) {
      sendMessage.error('页码或页大小不能小于1');
      return;
    }
    if (index) {
      paginationReactive.page = index;
    }
    if (size) {
      paginationReactive.pageSize = size;
    }
    try {
      const query = {
        startNum: (paginationIndex - 1) * paginationSize + 1,
        endNum: (paginationIndex) * paginationSize,
      };
      if (searchValue.value) {
        assignIn(query, {
          title: searchValue.value
        });
      }
      const res = await models.getProblemFilterList(query);
      problems.value = res.questionsList;
      paginationReactive.itemCount = res.totalNum;
      // console.log(problems.value, JSON.stringify(res, null, 2));
    } catch (error) {
      console.error(error);
      const { message } = error as Error;
      sendMessage.error(String(message || '请求失败'));
    }
  };

  const paginationReactive = reactive<PaginationProps>({
    page: 1,
    pageSize: 1,
    showSizePicker: true,
    itemCount: 2,
    pageSizes: [1, 10, 20, 30, 40],
    onChange: (page: number) => {
      pageChange({ index: page });
    },
    onUpdatePageSize: (pageSize: number) => {
      pageChange({ size: pageSize });
    },

  });

  ///
  pageChange({});

</script>
