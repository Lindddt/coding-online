<template>
  <n-card
    :title="data.title"
    class="bg-white w-11/12 items-center mx-auto p-4 rounded-md"
    content-style="width: 100%;"
  >
    <h3>题目描述</h3>
    <p class="post_content">
      <v-md-preview :text="data.content" />
    </p>
    <br>
    <h3>输入格式</h3>
    <p class="post_content">
      {{ data.inputformat }}
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
      <v-md-preview :text="data.remark" />
    </p>
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
  import { JSONSchema } from './DataEditor';
  const props = withDefaults(defineProps<{
    data: {
      QID: number;
      title: string;
      content: string;
      inputformat: string;
      OutputExample: string;
      InputExample: string;
      remark: string;
    }
  }>(), {
    data: {
      QID: 0,
      title: '',
      content: '',
      inputformat: '',
      OutputExample: '',
      InputExample: '',
      remark: ''
    }
  });
  const ioData = ref<{
    input: JSONSchema;
    output: JSONSchema;
  }[]>([]);
  const openTabs = ref(1);
  const getProblemDetail = async () => {
    const outputList: JSONSchema[] = JSON.parse(props.data.OutputExample);
    const inputList: JSONSchema[] = JSON.parse(props.data.InputExample);
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
</script>
