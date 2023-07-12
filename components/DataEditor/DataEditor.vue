<template>
  <div class="json-schemn-editor">
    <n-row
      class="border-0 flex items-center"
      :gutter="10"
    >
      <n-col :span="8">
        <div
          :style="{ marginLeft: `${20 * deep}px` }"
          class="flex"
        >
          <n-button
            v-if="pickValue.type === 'object'"
            text
            style="color:rgba(0,0,0,.65)"
            class="w-4 hover:cursor-pointer"
            @click="hidden = !hidden"
          >
            <template #icon>
              <CaretRightOutlined v-if="hidden" />
              <CaretDownOutlined v-else />
            </template>
          </n-button>
          <span
            v-else
            style="width:32px;display:inline-block"
          />
          <n-input
            :key="pickKey"
            :disabled="disabled || root"
            :default-value="pickKey"
            class="ant-col-name-input"
            @blur="onInputName"
          />
        </div>
      </n-col>
      <n-col :span="4">
        <n-select
          v-model:value="pickValue.type"
          :virtual-scroll="false"
          :disabled="disabledType"
          class="w-full"
          :options="TYPE_NAME.map(item => ({ label: item, value: item }))"
          :on-update:value="onChangeType"
        />
      </n-col>
      <n-col
        :v-if="!(isObject || isArray)"
        :span="6"
      >
        <n-input
          v-if="(isObject || isArray)"
          value="数组对象不填值"
          :disabled="isObject || isArray"
        />
        <n-input
          v-if="pickValue.type === JSONSchemaType.string"
          v-model:value="pickValue.values"
          :disabled="isObject || isArray"
        />
        <n-input-number
          v-else-if="pickValue.type === JSONSchemaType.number"
          v-model:value="pickValue.values"
        />
        <n-select
          v-else-if="pickValue.type === JSONSchemaType.boolean"
          v-model:value="pickValue.values"
          :options="([{ label: 'true', value: 'true' }, { label: 'false', value: 'false' }] as unknown as SelectOption[])"
        />
      </n-col>
      <n-col
        :span="6"
        class="ant-col-setting"
      >
        <n-tooltip v-if="isObject || isArray">
          <template #trigger>
            <n-button
              text
              class="w-6"
              @click="addChild"
            >
              <template #icon>
                <PlusOutlined />
              </template>
            </n-button>
          </template>
          {{ local['add_child_node'] }}
        </n-tooltip>
        <n-tooltip v-if="!root">
          <template #trigger>
            <n-button
              text
              :class="`close-icon ant-btn-icon-only  w-6 ${isObject || isArray ? '' : 'ml-6'}`"
              @click="removeNode"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
            </n-button>
          </template>
          {{ local['remove_node'] }}
        </n-tooltip>
      </n-col>
    </n-row>
    <template v-if="!hidden && pickValue.values && pickValue.type === JSONSchemaType.object">
      <DataEditor
        v-for="(item, index) in pickValue.values"
        :key="`${index}_${item.name}`"
        :input-data="item"
        :parent="pickValue"
        :deep="deep + 1"
        :root="false"
      />
    </template>
    <template v-if="!hidden && pickValue.values && pickValue.type === JSONSchemaType.array">
      <DataEditor
        v-for="(item, index) in pickValue.values"
        :key="`${index}_${item.name}`"
        :input-data="item"
        :deep="deep + 1"
        :parent="pickValue"
        disabled
        is-item
        :root="false"
      />
    </template>
  </div>
</template>
<script setup lang='ts'>
  import { TYPE_NAME, TYPE_DEFAULT } from './types';
  // import { Row, Col, Button, Input, InputNumber, Icon, Checkbox, Select, Tooltip, Modal, Form, Switch } from 'ant-design-vue';
  import { NRow, NCol, NButton, NInput, NInputNumber, NSelect, NTooltip, SelectOption } from 'naive-ui';
  // import { CaretRightOutlined, CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';
  import { CaretRightOutlined, CaretDownOutlined, DeleteOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@vicons/antd';
  import { ref, computed, watch } from 'vue';
  import LocalProvider from './LocalProvider';
  import { JSONSchema, JSONSchemaType } from './types';
  import { isSlotEmpty } from 'naive-ui/es/_utils';
  const props = withDefaults(defineProps<{
    inputData: JSONSchema,
    disabled?: boolean, // name不可编辑，根节点name不可编辑,数组元素name不可编辑,
    disabledType?: boolean, // 禁用类型选择
    isItem?: boolean,// 是否数组元素
    deep?: number, // 节点深度，根节点deep=0
    root?: boolean, // 是否root节点
    parent?: JSONSchema | null, // 父节点
    onChange?: (data: JSONSchema) => void,
  }>(), {
    disabled: false,
    disabledType: false,
    isItem: false,
    deep: 0,
    root: true,
    parent: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange: () => { },
  });
  // const emit = defineEmits<{
  //   (e: 'changeParent', parent: JSONSchema): void;
  //   ()
  //   (e: 'update', value: string): void
  // }>();
  const hidden = ref(false);
  const local = ref(LocalProvider('zh_CN'));
  const pickValue = computed(() => {
    // {type: 'object', title: '条件', properties: {…}, required: Array(3)}
    return props.inputData;
  });
  watch(
    () => pickValue,
    (state) => {
      props.onChange && props.onChange(state.value);
    }
  );
  const countAdd = ref(1);
  const pickKey = computed(() => {
    // root
    return props.inputData.name;

  });
  const isObject = computed(() => {
    return pickValue.value.type === JSONSchemaType.object;

  });
  const isArray = computed(() => {
    return pickValue.value.type === JSONSchemaType.array;

  });

  function onInputName(e: FocusEvent) {
    const oldKey = pickKey.value;
    const newKey = (e.target as HTMLInputElement).value;
    if (!props.parent) {
      return;
    }
    if (oldKey === newKey) return;
    if (props.parent.type !== JSONSchemaType.object && props.parent.type !== JSONSchemaType.array) {
      return;
    }
    const index = props.parent.values.findIndex((item: JSONSchema) => item.name === oldKey);
    const value = props.parent.values[index];
    value.name = newKey;

  }
  function onChangeType(v: string) {
    console.log(v);
    const type = v as JSONSchemaType;
    pickValue.value.type = type;
    pickValue.value.values = TYPE_DEFAULT[type];
  }
  function addChild() {
    console.log('addChild');
    const name = _joinName();
    const type = JSONSchemaType.string;
    if (pickValue.value.type !== JSONSchemaType.object && pickValue.value.type !== JSONSchemaType.array) return;
    const node: {
      name: string,
      type: JSONSchemaType.object | JSONSchemaType.array,
      values: JSONSchema[]
    } = pickValue.value;
    node.values || (node.values = []);
    node.values.push({ name, type, values: name });
  }
  function removeNode() {
    if (!props.parent) return;
    const values = props.parent.values as JSONSchema[];
    const index = values.indexOf(pickValue.value);
    values.splice(index, 1);
    // delete value[pickKey.value];
  }
  function _joinName() {
    if (isArray.value) return `array_item_${countAdd.value++}`;
    return `object_${props.deep}_${countAdd.value++}`;
  }

  const getData = () => {
    return pickValue.value;
  };

  const validate = (obj: JSONSchema): boolean => {
    if (obj.type === JSONSchemaType.object || obj.type === JSONSchemaType.array) {
      return obj.values.every((item) => {
        if (typeof item === 'object') {
          return validate(item);
        }
        return true;
      });
    } else {
      return obj.values !== '';
    }

  };
  defineExpose({
    getData,
    validate: () => validate(pickValue.value),
  });
</script>
