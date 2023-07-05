<template>
  <div class="json-schemn-editor">
    <n-row
      class="row flex items-center"
      :gutter="10"
    >
      <n-col
        :span="8"
        class="ant-col-name"
      >
        <div
          :style="{ marginLeft: `${20 * deep}px` }"
          class="ant-col-name-c"
        >
          <n-button
            v-if="pickValue.type === 'object'"
            quaternary
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
            :key="pickValue"
            :disabled="disabled || root"
            :default-value="pickKey"
            class="ant-col-name-input"
            @blur="onInputName"
          />
        </div>
      </n-col>
      <n-col :span="4">
        <n-select
          :virtual-scroll="false"
          v-model:value="pickValue.type"
          :disabled="disabledType"
          class="ant-col-type"
          :get-popup-container="triggerNode => {
            return triggerNode.parentNode || document.body;
          }"
          :options="TYPE_NAME.map(item => ({ label: item, value: item }))"
          @change="onChangeType"
        />
      </n-col>
      <n-col :span="6">
        <n-input
          v-model:value="pickValue.title"
          class="ant-col-title"
          :placeholder="local['title']"
        />
      </n-col>
      <n-col
        :span="6"
        class="ant-col-setting"
      >
        <n-tooltip v-if="isObject">
          <template #trigger>
            <n-button
              quaternary
              text
              class="plus-icon"
              @click="addChild"
            >
              <template #icon>
                <PlusOutlined />
              </template>
            </n-button>
          </template>
          {{ local['add_child_node'] }}
        </n-tooltip>
        <n-tooltip v-if="!root && !isItem">
          <template #trigger>
            <n-button
              quaternary
              text
              class="close-icon ant-btn-icon-only"
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
    <template v-if="!hidden && pickValue.properties && !isArray">
      <DataEditor
        v-for="(item, key, index) in pickValue.properties"
        :key="index"
        :value="{ [key]: item }"
        :parent="pickValue"
        :deep="deep + 1"
        :root="false"
        class="children"
        :lang="lang"
        :custom="custom"
      />
    </template>
    <template v-if="isArray">
      <DataEditor
        :value="{ items: pickValue.items }"
        :deep="deep + 1"
        disabled
        is-item
        :root="false"
        class="children"
        :lang="lang"
        :custom="custom"
      />
    </template>
  </div>
</template>
<script>
  import { isNull, renamePropertyAndKeepKeyPrecedence } from './util';
  import { TYPE_NAME, TYPE } from './type/type';
  import { NRow, NCol, NButton, NInput, NCheckbox, NInputNumber, NSelect, NTooltip, NModal, NForm, NSwitch, NFormItem } from 'naive-ui';
  import { CaretRightOutlined, CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, CheckOutlined } from '@vicons/antd';
  import LocalProvider from './LocalProvider';
  export default {
    name: 'DataEditor',
    components: {
      NRow, NCol, NButton, NInput, NCheckbox, NInputNumber, NSelect, NTooltip, NModal, NForm, NSwitch,
      CaretRightOutlined, NFormItem,
      CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined, DeleteOutlined
    },
    props: {
      value: {
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
        advancedValue: {},
        addProp: {},// 自定义属性
        customProps: [],
        customing: false,
        local: LocalProvider(this.lang)
      };
    },
    computed: {
      pickValue() {
        console.log(Object.values(this.value)[0], 'pickValue', this.value);
        return Object.values(this.value)[0];
      },
      pickKey() {
        return Object.keys(this.value)[0];
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
        return ['type', 'title', 'properties', 'items', 'required', ...Object.keys(this.advancedAttr)];
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
      onInputName(e) {
        const oldKey = this.pickKey;
        const newKey = e.target.value;


        if (oldKey === newKey) return;

        // const nodeValue = this.parent.properties[oldKey]

        // 替换key名
        // delete this.parent.properties[oldKey]
        // eslint-disable-next-line vue/no-mutating-props
        // this.parent.properties[newKey] = nodeValue
        renamePropertyAndKeepKeyPrecedence(this.parent.properties, [oldKey, newKey]);

        // required重新设置
        const requireds = this.parent.required || [];
        const oldIndex = requireds.indexOf(oldKey);
        if (requireds.length > 0 && oldIndex > -1) {
          requireds.splice(oldIndex, 1);
          requireds.push(newKey);
          // eslint-disable-next-line vue/no-mutating-props
          this.parent.required = [...new Set(requireds)];
        }
      },
      onChangeType() {
        this.parseCustomProps();
        // 删除自定义属性
        this.customProps.forEach(item => {
          delete this.pickValue[item.key];
        });
        this.customProps = [];

        delete this.pickValue.properties;
        delete this.pickValue.items;
        delete this.pickValue.required;
        delete this.pickValue.format;
        delete this.pickValue.enum;

        if (this.isArray) {
          this.pickValue.items = { type: 'string' };
        }
      },
      onCheck(e) {
        this._checked(e.target.checked, this.parent);
      },
      onRootCheck(e) {
        this._deepCheck(e.target.checked, this.pickValue);
      },
      _deepCheck(checked, node) {
        if (node.type === 'object' && node.properties) {
          checked ? node.required = Object.keys(node.properties) : (delete node.required);
          Object.keys(node.properties).forEach(key => this._deepCheck(checked, node.properties[key]));
        } else if (node.type === 'array' && node.items.type === 'object') {
          checked ? node.items.required = Object.keys(node.items.properties) : (delete node.items.required);
          Object.keys(node.items.properties).forEach(key => this._deepCheck(checked, node.items.properties[key]));
        }
      },
      _checked(checked, parent) {
        let required = parent.required;
        if (checked) {
          // eslint-disable-next-line vue/no-mutating-props
          required || (this.parent.required = []);

          required = this.parent.required;
          required.indexOf(this.pickKey) === -1 && required.push(this.pickKey);
        } else {
          const pos = required.indexOf(this.pickKey);
          pos >= 0 && required.splice(pos, 1);
        }
        required.length === 0 && (delete parent.required);
      },
      addChild() {
        const name = this._joinName();
        const type = 'string';
        const node = this.pickValue;
        node.properties || (node.properties = {}); // this.$set(node,'properties',{})
        const props = node.properties;
        props[name] = { type: type }; // this.$set(props,name,{type: type})
      },
      parseCustomProps() {
        const ownProps = this.ownProps;
        Object.keys(this.pickValue).forEach(key => {
          if (ownProps.indexOf(key) === -1) {
            this.confirmAddCustomNode({ key: key, value: this.pickValue[key] });
            // this.$delete(this.pickValue,key)
          }
        });
      },
      addCustomNode() {
        // this.$set(this.addProp,'key',this._joinName())
        // this.$set(this.addProp,'value','')
        this.addProp.key = this._joinName();
        this.addProp.value = '';
        this.customing = true;
      },
      removeCustomNode(key) {
        this.customProps.forEach((item, index) => {
          if (item.key === key) {
            this.customProps.splice(index, 1);
            return;
          }
        });
      },
      confirmAddCustomNode(prop) {
        const p = prop || this.addProp;
        let existKey = false;
        this.customProps.forEach(item => {
          if (item.key === p.key) {
            existKey = true;
          }
        });
        if (existKey) return;
        this.customProps.push(p);
        this.addProp = {};
        this.customing = false;
      },
      removeNode() {
        const { properties, required } = this.parent;
        delete properties[this.pickKey];
        if (required) {
          const pos = required.indexOf(this.pickKey);
          pos >= 0 && required.splice(pos, 1);
          required.length === 0 && (delete this.parent.required);
        }
      },
      _joinName() {
        return `field_${this.deep}_${this.countAdd++}`;
      },

      _pickDiffKey() {
        const keys = Object.keys(this.pickValue);
        return keys.filter(item => this.ownProps.indexOf(item) === -1);
      }
    }
  };
</script>
<style scoped>
  .json-schemn-editor .row {
    display: flex;
    margin: 12px;
  }

  .json-schemn-editor .row .ant-col-name {
    display: flex;
    align-items: center;
  }

  .json-schemn-editor .row .ant-col-name .ant-col-name-c {
    display: flex;
    align-items: center;
  }

  .json-schemn-editor .row .ant-col-name .ant-col-name-required {
    flex: 0 0 24px;
    text-align: center;
    padding-left: 5px;
  }

  .json-schemn-editor .row .ant-col-type {
    width: 100%;
  }

  .json-schemn-editor .row .ant-col-setting {
    display: inline-block;
  }

  .json-schemn-editor .row .setting-icon {
    color: rgba(0, 0, 0, 0.45);
    border: none;
  }

  .json-schemn-editor .row .plus-icon {
    border: none;
  }

  .json-schemn-editor .row .close-icon {
    color: #888;
    border: none;
  }
</style>
