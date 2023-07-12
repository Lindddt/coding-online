<template>
  <n-card
    content-style="padding: 0 0 0 0;"
    class="io-class"
  >
    <n-tabs
      v-model:value="value"
      type="card"
      addable
      :closable="closable"
      tab-style="min-width: 80px;"
      @close="handleClose"
      @add="handleAdd"
    >
      <n-tab-pane
        v-for="panel in panels"
        :key="panel"
        :name="panel"
      >
        <DataEditor
          disabled-type
          :input-data="IOData[value - 1].input"
        />
        <DataEditor
          disabled-type
          :input-data="IOData[value - 1].output"
        />
      </n-tab-pane>
    </n-tabs>
    <!-- <n-tab
        v-for="panel in  panels"
        :key="panel"
        :name="panel"
      >
        {{ panel }}
      </n-tab>
    </n-tabs>
    <DataEditor
      disabled-type
      :input-data="IOData[value - 1].input"
    />
    <DataEditor
      disabled-type
      :input-data="IOData[value - 1].output"
    /> -->
  </n-card>
</template>
<script setup lang='ts'>
  // import { Row, Col, Button, Input, InputNumber, Icon, Checkbox, Select, Tooltip, Modal, Form, Switch } from 'ant-design-vue';
  import { NTabs, NTabPane, NCard } from 'naive-ui';
  // import { CaretRightOutlined, CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';
  import { CaretRightOutlined, CaretDownOutlined, DeleteOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@vicons/antd';
  import { DataEditor } from '#components';
  import { ref, computed, watch, reactive } from 'vue';
  import { JSONSchema, JSONSchemaType, TYPE_DEFAULT } from './DataEditor';
  import LocalProvider from './DataEditor/LocalProvider';
  import { cloneDeep } from 'lodash';
  const props = defineProps<{
    'formData'?: any;
    'itemKey': string
    'changeData'?: (value: string, key: string) => void;
    'validate'?: (keys?: string[]) => Promise<boolean>;
    // 'handleClick'?: (e: MouseEvent) => void;
  }>();

  const value = ref(1);
  const panels = ref([1]);
  const IOExample: {
    input: JSONSchema;
    output: JSONSchema;
  } = {
    input: {
      'name': 'input',
      'type': JSONSchemaType.object,
      'values': [
        {
          'name': '名称',
          'type': JSONSchemaType.string,
          'values': '名称',
        },
        {
          'name': 'appId',
          'type': JSONSchemaType.number,
          'values': 654321,
        },
        {
          'name': 'credate',
          'type': JSONSchemaType.string,
          'values': '创建日期',
        }
      ]
    },
    output: {
      'name': 'output',
      'type': JSONSchemaType.object,
      'values': [
        {
          'name': '名称',
          'type': JSONSchemaType.string,
          'values': '名称',
        },
        {
          'name': 'appId',
          'type': JSONSchemaType.number,
          'values': 654321,
        },
        {
          'name': 'credate',
          'type': JSONSchemaType.string,
          'values': '创建日期',
        }
      ]
    }
  };
  const IOData = reactive<{
    input: JSONSchema;
    output: JSONSchema;
  }[]>([cloneDeep(IOExample)]);
  const closable = computed(() => {
    return panels.value.length > 1;
  });

  const handleAdd = () => {
    const newValue = Math.max(...panels.value) + 1;
    panels.value.push(newValue);
    IOData.push(cloneDeep(IOExample));
    value.value = newValue;
  };
  const handleClose = (name: number) => {
    const prePanels = panels.value;
    const nameIndex = prePanels.findIndex((panelName) => panelName === name);
    if (!~nameIndex) return;
    panels.value.splice(nameIndex, 1);
    IOData.splice(nameIndex, 1);
    console.log(name, value.value, IOData, prePanels, nameIndex);
    if (name === value.value) {
      value.value = prePanels[Math.min(nameIndex, prePanels.length - 1)];
    }
  };
  // const emit = defineEmits<{
  //   (e: 'changeParent', parent: JSONSchema): void;
  //   ()
  //   (e: 'update', value: string): void
  // }>();

  watch(IOData, (state, prevState) => {
    props.changeData && props.changeData(JSON.stringify(state), props.itemKey);
    // console.log(state, prevState);F
  }, { deep: true, immediate: true });

                    // defineExpose({
                    // });
</script>

<style lang='less' scoped>
.io-class {
  border-top: 0 !important;
}
</style>