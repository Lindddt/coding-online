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
          :get-popup-container="triggerNode => {
            return triggerNode.parentNode || document.body;
          }"
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
          v-else-if="['string'].includes(pickValue.type)"
          v-model:value="pickValue.value"
          :disabled="isObject || isArray"
        />
        <n-input-number
          v-else-if="['number'].includes(pickValue.type)"
          v-model:value="pickValue.value"
        />
        <n-select
          v-else-if="['boolean'].includes(pickValue.type)"
          v-model:value="pickValue.value"
          :options="[{ label: 'true', value: true }, { label: 'false', value: false }]"
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
    <template v-if="!hidden && pickValue.value && isObject">
      <DataEditor
        v-for="(item, index) in pickValue.value"
        :key="index"
        :input-data="item"
        :parent="pickValue"
        :deep="deep + 1"
        :root="false"
        :lang="lang"
      />
    </template>
    <template v-if="!hidden && pickValue.value && isArray">
      <DataEditor
        v-for="(item, index) in pickValue.value"
        :key="`${index}_${item.name}`"
        :input-data="item"
        :deep="deep + 1"
        :parent="pickValue"
        disabled
        is-item
        :root="false"
        :lang="lang"
      />
    </template>
  </div>
</template>

<script>
  import { renamePropertyAndKeepKeyPrecedence } from './util';
  import { NRow, NCol, NButton, NInput, NCheckbox, NInputNumber, NSelect, NTooltip, NModal, NForm, NSwitch, NFormItem } from 'naive-ui';
  import { CaretRightOutlined, CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, CheckOutlined } from '@vicons/antd';
  import LocalProvider from './LocalProvider';
  import { JSONSchemaType, TYPE_NAME, TYPE_DEFAULT } from './types';
  export default {
    name: 'DataEditor',
    components: {
      NRow, NCol, NButton, NInput, NCheckbox, NInputNumber, NSelect, NTooltip, NModal, NForm, NSwitch,
      CaretRightOutlined, NFormItem,
      CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined, DeleteOutlined
    },
    props: {
      inputData: {
        type: Object,
        required: true
      },
      disabled: { // name不可编辑，根节点name不可编辑,数组元素name不可编辑
        type: Boolean,
        default: false
      },
      disabledType: { // 禁用类型选择
        type: Boolean,
        default: false
      },
      isItem: { // 是否数组元素
        type: Boolean,
        default: false
      },
      deep: { // 节点深度，根节点deep=0
        type: Number,
        default: 0
      },
      root: { // 是否root节点
        type: Boolean,
        default: true
      },
      parent: { // 父节点
        type: Object,
        default: null
      },
      custom: { // enable custom properties
        type: Boolean,
        default: false
      },
      lang: { // i18n language
        type: String,
        default: 'zh_CN'
      }
    },
    data() {
      return {
        TYPE_NAME,
        hidden: false,
        countAdd: 1,
        modalVisible: false,
        local: LocalProvider(this.lang)
      };
    },
    computed: {
      pickValue() {
        console.log('pickValue', JSON.stringify(this.inputData));
        return this.inputData;
      },
      pickKey() {
        return this.inputData.name || '';
      },
      isObject() {
        return this.pickValue.type === 'object';
      },
      isArray() {
        return this.pickValue.type === 'array';
      },
      checked() {
        return this.parent && this.parent.required && this.parent.required.indexOf(this.pickKey) >= 0;
      },
      ownProps() {
        return ['type', 'value', 'key', 'name'];
      },
      completeNodeValue() {
        const t = {};
        const basicValue = { ...this.pickValue };
        for (const item of this.customProps) {
          t[item.key] = item.value;
        }
        this._pickDiffKey().forEach(key => delete basicValue[key]);
        return { ...basicValue, ...t };
      },
    },
    methods: {
      mounted() {
        console.log(this.pickKey, 'pickKey', this.pickValue, 'pickValue');
      },
      onInputName(e) {
        const oldKey = this.pickKey;
        const newKey = e.target.value;
        if (oldKey === newKey) return;
        const index = this.parent.value.indexOf((item) => item.name === oldKey);
        const value = this.parent.value[index];
        value.name = newKey;

      },
      onChangeType(v) {
        console.log(v);
        this.pickValue.type = v;
        this.pickValue.value = TYPE_DEFAULT[v];
      },
      addChild() {
        console.log('addChild');
        const name = this._joinName();
        const type = 'string';
        const node = this.pickValue;
        node.value || (node.value = []);
        node.value.push({ name, type, value: '' });
      },
      removeNode() {
        const { value } = this.parent;
        const index = value.indexOf(this.pickValue);
        value.splice(index, 1);
        // delete value[this.pickKey];
      },
      _joinName() {
        if (this.isArray) return `array_item_${this.countAdd++}`;
        return `object_${this.deep}_${this.countAdd++}`;
      },

      _pickDiffKey() {
        const keys = Object.keys(this.pickValue);
        return keys.filter(item => this.ownProps.indexOf(item) === -1);
      }
    }
  };
</script>
