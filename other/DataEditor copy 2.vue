<template>
  <div class="json-schemn-editor">
    <n-row
      class="row"
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
            style="color:rgba(0,0,0,.65)"
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
        <n-tooltip v-if="root">
          <template #title>
            {{ local['checked_all'] }}
          </template>
          <n-checkbox
            :disabled="!isObject && !isArray"
            class="ant-col-name-required"
            @change="onRootCheck"
          />
        </n-tooltip>
        <n-tooltip v-else>
          <template #title>
            {{ local['required'] }}
          </template>
          <n-checkbox
            :disabled="isItem"
            :checked="checked"
            class="ant-col-name-required"
            @change="onCheck"
          />
        </n-tooltip>
      </n-col>
      <n-col :span="4">
        <n-select
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
        <n-tooltip>
          <template #title>
            {{ local['adv_setting'] }}
          </template>
          <n-button
            quaternary
            class="setting-icon"
            @click="onSetting"
          >
            <template #icon>
              <SettingOutlined />
            </template>
          </n-button>
        </n-tooltip>
        <n-tooltip v-if="isObject">
          <template #title>
            {{ local['add_child_node'] }}
          </template>
          <n-button
            quaternary
            class="plus-icon"
            @click="addChild"
          >
            <template #icon>
              <PlusOutlined />
            </template>
          </n-button>
        </n-tooltip>
        <n-tooltip v-if="!root && !isItem">
          <template #title>
            {{ local['remove_node'] }}
          </template>
          <n-button
            quaternary
            class="close-icon ant-btn-icon-only"
            @click="removeNode"
          >
            <i
              arin-label="icon: plus"
              class="anticon anticon-plus"
            >
              <svg
                viewBox="64 64 896 896"
                datn-icon="plus"
                width="1em"
                height="1em"
                fill="currentColor"
                arin-hidden="true"
                focusable="false"
                class=""
              >
                <path
                  d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"
                  p-id="1142"
                />
              </svg>
            </i>
          </n-button>
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
      <n-modal
        v-if="modalVisible"
        v-model:visible="modalVisible"
        :title="local['adv_setting']"
        :mask-closable="false"
        :ok-text="local['ok']"
        :cancel-text="local['cancel']"
        width="800px"
        wrap-class-name="json-schemn-editor-advanced-modal"
        @ok="handleOk"
      >
        <h3>{{ local['base_setting'] }}</h3>
        <n-form
          :model="advancedValue"
          class="ant-advanced-search-form"
        >
          <n-row :gutter="6">
            <n-col
              v-for="(item, key) in advancedValue"
              :key="key"
              :span="8"
            >
              <n-form-item>
                <span>{{ local[key] }}</span>
                <n-input-number
                  v-if="advancedAttr[key].type === 'integer' || advancedAttr[key].type === 'number'"
                  v-model:value="advancedValue[key]"
                  style="width:100%"
                  :placeholder="key"
                />
                <span
                  v-else-if="advancedAttr[key].type === 'boolean'"
                  style="display:inline-block;width:100%"
                >
                  <n-switch v-model:checked="advancedValue[key]" />
                </span>
                <n-input
                  v-else-if="key === 'enum'"
                  type="textarea"
                  :default-value="enumText"
                  :rows="2"
                  :placeholder="local['enum_msg']"
                  @blur="changeEnumValue"
                />
                <n-select
                  v-else-if="advancedAttr[key].type === 'array'"
                  v-model:value="advancedValue[key]"
                  style="width:100%"
                  :get-popup-container="triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }"
                  :placeholder="local[key]"
                  :options="[local['nothing'], ...advancedAttr[key]].enums.map(item => ({ label: item, value: item }))"
                />
                <n-input
                  v-else
                  v-model:value="advancedValue[key]"
                  style="width:100%"
                  :placeholder="key"
                />
              </n-form-item>
            </n-col>
          </n-row>
        </n-form>
        <h3 v-show="custom">
          {{ local['add_custom'] }}
        </h3>
        <n-form
          v-show="custom"
          class="ant-advanced-search-form"
        >
          <n-row :gutter="6">
            <n-col
              v-for="item in customProps"
              :key="item.key"
              :span="8"
            >
              <n-form-item :label="item.key">
                <n-input
                  v-model:value="item.value"
                  style="width:calc(100% - 30px)"
                />
                <n-button
                  quaternary
                  style="width:30px"
                  @click="removeCustomNode(item.key)"
                >
                  <template #icon>
                    <CloseOutlined />
                  </template>
                </n-button>
              </n-form-item>
            </n-col>
            <n-col
              v-show="addProp.key != undefined"
              :span="8"
            >
              <n-form-item>
                <template #label>
                  <n-input
                    v-model:value="addProp.key"
                    style="width:100px"
                  />
                </template>
                <n-input
                  v-model:value="addProp.value"
                  style="width:100%"
                />
              </n-form-item>
            </n-col>
            <n-col :span="8">
              <n-form-item>
                <n-button
                  v-if="customing"
                  quaternary
                  @click="confirmAddCustomNode(null)"
                >
                  <template #icon>
                    <CheckOutlined />
                  </template>
                </n-button>
                <n-tooltip
                  v-else
                  :title="local['add_custom']"
                >
                  <n-button
                    quaternary
                    @click="addCustomNode"
                  >
                    <template #icon>
                      <PlusOutlined />
                    </template>
                  </n-button>
                </n-tooltip>
              </n-form-item>
            </n-col>
          </n-row>
        </n-form>
        <h3>{{ local['preview'] }}</h3>
        <pre style="width:100%">{{ completeNodeValue }}</pre>
      </n-modal>
  </div>
</template>
<script>
  import { isNull, renamePropertyAndKeepKeyPrecedence } from './util';
  import { TYPE_NAME, TYPE } from './type/type';
  import { NRow, NCol, NButton, NInput, NCheckbox, NInputNumber, NSelect, NTooltip, NModal, NForm, NSwitch, NFormItem } from 'naive-ui';
  import { CaretRightOutlined, CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@vicons/antd';
  import LocalProvider from './LocalProvider';
  export default {
    name: 'DataEditor',
    components: {
      NRow, NCol, NButton, NInput, NCheckbox, NInputNumber, NSelect, NTooltip, NModal, NForm, NSwitch,
      CaretRightOutlined, NFormItem,
      CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined
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
      advanced() {
        return TYPE[this.pickValue.type];
      },
      advancedAttr() {
        return TYPE[this.pickValue.type].attr;
      },
      ownProps() {
        return ['type', 'title', 'properties', 'items', 'required', ...Object.keys(this.advancedAttr)];
      },
      advancedNotEmptyValue() {
        const jsonNode = { ...this.advancedValue };
        for (let key in jsonNode) {
          isNull(jsonNode[key]) && delete jsonNode[key];
        }
        return jsonNode;
      },
      completeNodeValue() {
        const t = {};
        const basicValue = { ...this.pickValue };
        for (const item of this.customProps) {
          t[item.key] = item.value;
        }
        this._pickDiffKey().forEach(key => delete basicValue[key]);
        return { ...basicValue, ...t, ...this.advancedNotEmptyValue };
      },
      enumText() {
        const t = this.advancedValue.enum;
        if (!t) return '';
        if (!t.length) return '';
        return t.join('\n');
      }
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
      changeEnumValue(e) {
        const pickType = this.pickValue.type;
        const value = e.target.value;
        let arr = value.split('\n');

        if (pickType === 'string') {
          this.advancedValue.enum = arr.map(item => item);
        } else {
          if (arr.length === 0 || (arr.length === 1 && arr[0] == '')) {
            this.advancedValue.enum = null;
          } else {
            this.advancedValue.enum = arr.map(item => Number(item));
          }
        }
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
      onSetting() {
        this.modalVisible = true;
        this.advancedValue = { ...this.advanced.value };
        for (const k in this.advancedValue) {
          if (this.pickValue[k]) {
            this.advancedValue[k] = this.pickValue[k];
          }
        }
        this.parseCustomProps();
      },

      handleOk() {
        this.modalVisible = false;
        for (const key in this.advancedValue) {
          if (isNull(this.advancedValue[key])) {
            delete this.pickValue[key];
          } else {
            this.pickValue[key] = this.advancedValue[key];
          }
        }
        const diffKey = this._pickDiffKey();
        diffKey.forEach(key => delete this.pickValue[key]);
        for (const item of this.customProps) {
          this.pickValue[item.key] = item.value;
        }
      },
      _pickDiffKey() {
        const keys = Object.keys(this.pickValue);
        return keys.filter(item => this.ownProps.indexOf(item) === -1);
      }
    }
  };
</script>
<style scoped>
  /* .json-schemn-editor .row {
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
<style>
  .json-schemn-editor-advanced-modal {
    color: rgba(0, 0, 0, 0.65);
    min-width: 600px;
  }

  .json-schemn-editor-advanced-modal pre {
    font-family: monospace;
    height: 100%;
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 12px;
    width: 50%;
  }

  .json-schemn-editor-advanced-modal h3 {
    display: block;
    border-left: 3px solid #1890ff;
    padding: 0 8px;
  }

  .json-schemn-editor-advanced-modal .ant-advanced-search-form .ant-form-item {
    display: flex;
  }

  .json-schemn-editor-advanced-modal .ant-advanced-search-form .ant-form-item .ant-form-item-control-wrapper {
    flex: 1;
  } */
</style>