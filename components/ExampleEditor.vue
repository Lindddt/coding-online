<template>
  <n-table>
    <tr>
      <td class="table_head first">
        <span class="title1">变量名</span><br>
        <span class="title2">赋值</span><br>
        <span class="title3">第i组数据</span>
      </td>
      <td v-for="k in input_variables[i - 1]">
        <input
          type="text"
          class="td_message"
          v-model="question_variable[i - 1][k - 1]"
        ></input>
      </td>
      <td
        style="width: 32px"
        :rowspan="input_data_sets[i - 1] + 1"
      >
        <i
          v-if="((input_variables[i - 1] < 4 && rl_plus_sub_flags) || (!rl_plus_sub_flags && input_variables[i - 1] > 1)) && input_label_visible"
          @click="input_line_plus(i)"
          :class="line_icon"
        ></i>
      </td>
    </tr>
    <tr v-for="j in input_data_sets[i - 1]">
      <td class="table_head">{{ j }}</td>
      <td v-for="n in input_variables[i - 1]">
        <input
          type="text"
          class="td_message"
          v-model="question_set_data[i - 1][j - 1][n - 1]"
        ></input>
      </td>
    </tr>
    <tr>
      <td
        style="padding: 5px"
        :colspan="input_variables[i - 1] + 1"
      >
        <i
          v-if="(rl_plus_sub_flags || (!rl_plus_sub_flags && input_data_sets[i - 1] > 1)) && input_label_visible"
          @click="input_row_plus(i)"
          :class="row_icon"
        ></i>
      </td>
    </tr>
  </n-table>
</template>

<script setup lang='ts'>
  import { ref } from 'vue';
  import { NTable, NButton } from 'naive-ui';

  const props = defineProps<{
    'formData'?: any;
    'itemKey': string
    'changeData'?: (value: string, key: string) => void;
    'validate'?: (keys?: string[]) => Promise<boolean>;
    // 'handleClick'?: (e: MouseEvent) => void;
  }>();
  // console.log(props, 'formList', props.formData);

const markdown = ref('');


const changeDataInner = (text: string) => {
  props.changeData?.(text, props.itemKey);
};

</script>

<style lang='less' scoped>.verification-code {
  display: flex;
  flex: 1;
}</style>