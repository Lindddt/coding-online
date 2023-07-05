<template>
  <div class="json-schema-editor">
    <n-row
      class="row"
      :gutter="10"
    >
      <n-col :span="8">
        <div :style="{ marginLeft: `${20 * deep}px` }">
          <n-button
            v-if="pickValue.type === 'object'"
            quaternary
            style="color:rgba(0,0,0,.65)"
            @click="hidden = !hidden"
          >
            <!-- <template #icon>
              <caret-right-outlined v-if="hidden" />
              <caret-down-outlined v-else />
            </template> -->
          </n-button>
          <span
            v-else
            style="width:32px;display:inline-block"
          />
          <n-input
            :key="pickValue"
            :disabled="disabled || root"
            :default-value="pickKey"
            @blur="onInputName"
          />
        </div>
        <n-tooltip v-if="root">
          <template #title>
            {{ local['checked_all'] }}
          </template>
          <n-checkbox
            :disabled="!isObject && !isArray"
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
            @change="onCheck"
          />
        </n-tooltip>
      </n-col>
      <n-col :span="4">
        <n-select
          v-model:value="pickValue.type"
          :disabled="disabledType"
          @change="onChangeType"
          :options="TYPE_NAME.map(item => ({ label: item, value: item })))"
        />
      </n-col>
      <n-col :span="6">
        <n-input
          v-model:value="pickValue.title"
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
            @click="onSetting"
          >
            <!-- <template #icon>
              <SettingOutlined />
            </template> -->
          </n-button>
        </n-tooltip>
        <n-tooltip v-if="isObject">
          <template #title>
            {{ local['add_child_node'] }}
          </template>
          <n-button
            quaternary
            @click="addChild"
          >
            <!-- <template #icon>
              <Plus />
            </template> -->
          </n-button>
        </n-tooltip>
        <n-tooltip v-if="!root && !isItem">
          <template #title>
            {{ local['remove_node'] }}
          </template>
          <n-button
            quaternary
            @click="removeNode"
          >
            <i aria-label="icon: plus">
              <svg
                viewBox="64 64 896 896"
                data-icon="plus"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
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
        v-for="( item, key, index ) in pickValue.properties "
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
      wrap-class-name="json-schema-editor-advanced-modal"
      @ok="handleOk"
    >
      <h3>{{ local['base_setting'] }}</h3>
      <n-form
        :model="advancedValue"
        class="ant-advanced-search-form"
      >
        <n-row :gutter="6">
          <n-col
            v-for="( item, key ) in advancedValue "
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
                :default-value="enumText"
                type="textarea"
                :rows="2"
                :placeholder="local['enum_msg']"
                @blur="changeEnumValue"
              />
              <n-select
                v-else-if="advancedAttr[key].type === 'array'"
                v-model:value="advancedValue[key]"
                style="width:100%"
                :placeholder="local[key]"
              >
                <n-select-option value="">
                  {{ local['nothing'] }}
                </n-select-option>
                <n-select-option
                  v-for=" t in advancedAttr[key].enums "
                  :key="t"
                >
                  {{ t }}
                </n-select-option>
              </n-select>
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
            v-for=" item in customProps "
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
                <!-- <template #icon>
                  <close-outlined />
                </template> -->
              </n-button>
            </n-form-item>
          </n-col>
          <n-col
            v-show="addProp.key !== undefined"
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
                <!-- <template #icon>
                  <check-outlined />
                </template> -->
              </n-button>
              <n-tooltip
                v-else
                :title="local['add_custom']"
              >
                <n-button
                  quaternary
                  @click="addCustomNode"
                >
                  <!-- <template #icon>
                    <n-icon>
                      <cash-icon />
                    </n-icon>
                    <plus-outlined />
                  </template> -->
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
<script setup lang='ts'>
  import { isNull, renamePropertyAndKeepKeyPrecedence } from './util';
  import { TYPE_NAME, TYPE } from './type/type';
  // import { Row, Col, Button, Input, InputNumber, Icon, Checkbox, Select, Tooltip, Modal, Form, Switch } from 'ant-design-vue';
  import { NRow, NCol, NButton, NInput, NInputNumber, NIcon, NCheckbox, NSelect, NTooltip, NModal, NForm, NSwitch } from 'naive-ui';
  // import { CaretRightOutlined, CaretDownOutlined, SettingOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';
  import { ref, computed } from 'vue';
  import { LocalProvider } from './LocalProvider';
  import { Icon } from '@vicons/utils';
  import { Plus } from '@vicons/fa';
  import { SettingOutlined } from '@vicons/antd';
  import { JSONSchema, JSONSchemaType } from './types';
  const props = withDefaults(defineProps<{
    value: {
      [key: string]: JSONSchema;
    },
    disabled?: boolean, // name不可编辑，根节点name不可编辑,数组元素name不可编辑,
    disabledType?: boolean, // 禁用类型选择
    isItem?: boolean,// 是否数组元素
    deep?: number, // 节点深度，根节点deep=0
    root?: boolean, // 是否root节点
    parent?: JSONSchema | null, // 父节点
    custom?: boolean, // enable custom properties
    lang?: string, // i18n language
  }>(), {
    disabled: false,
    disabledType: false,
    isItem: false,
    deep: 0,
    root: true,
    parent: null,
    custom: false,
    lang: 'zh_CN'
  });
  const TYPE_NAME = ref();
  const hidden = ref(false);
  const countAdd = ref(1);
  const modalVisible = ref(false);
  const advancedValue = ref<{
    [key: string]: string | number | boolean
  }>({});
  const addProp = ref({});
  const customProps = ref([]);
  const customing = ref(false);
  const local = ref(LocalProvider(props.lang));
  const pickValue = computed(() => {
    // {type: 'object', title: '条件', properties: {…}, required: Array(3)}
    return Object.values(props.value)[0];
  });
  const pickKey = computed(() => {
    // root
    return Object.keys(props.value)[0];

  });
  const isObject = computed(() => {
    return pickValue.value.type === JSONSchemaType.object;

  });
  const isArray = computed(() => {
    return pickValue.value.type === JSONSchemaType.array;

  });
  const checked = computed(() => {
    return props.parent && props.parent.required && props.parent.required.indexOf(pickKey.value) >= 0;

  });
  const advanced = computed(() => {
    return TYPE[pickValue.value.type];

  });
  const advancedAttr = computed(() => {
    return TYPE[pickValue.value.type].attr;

  });
  const ownProps = computed(() => {
    return ['type', 'title', 'properties', 'items', 'required', ...Object.keys(advancedAttr.value)];

  });
  const advancedNotEmptyValue = computed(() => {
    const jsonNode = { ...advancedValue.value };
    for (let key in jsonNode) {
      if (isNull(jsonNode[key])) {
        delete jsonNode[key];
      }
    }
    return jsonNode;
  });
  const completeNodeValue = computed(() => {
    const t = {};
    const basicValue = { ...pickValue };
    for (const item of customProps.value) {
      t[item.key] = item.value;
    }
    _pickDiffKey().forEach(key => delete basicValue[key]);
    return { ...basicValue, ...t, ...advanced.value.valueNotEmptyValue };
  });

  const enumText = computed(() => {
    const t = advancedValue.value.enum;
    if (!t) return '';
    if (!t.length) return '';
    return t.join('\n');
  });

  function onInputName(e: { target: { value: any; }; }) {
    const oldKey = pickKey.value;
    const newKey = e.target.value;


    if (oldKey === newKey) return;

    // const nodeValue = props.parent.properties[oldKey]

    // 替换key名
    // delete props.parent.properties[oldKey]
    // eslint-disable-next-line vue/no-mutating-props
    // props.parent.properties[newKey] = nodeValue
    renamePropertyAndKeepKeyPrecedence(props.parent.properties, [oldKey, newKey]);

    // required重新设置
    const requireds = props.parent?.required || [];
    const oldIndex = requireds.indexOf(oldKey);
    if (requireds.length > 0 && oldIndex > -1) {
      requireds.splice(oldIndex, 1);
      requireds.push(newKey);
      // eslint-disable-next-line vue/no-mutating-props
      props.parent!.required = [...new Set(requireds)];
    }
  }
  function onChangeType() {
    parseCustomProps();
    // 删除自定义属性
    customProps.value.forEach(item => {
      delete pickValue.value[item.key];
    });
    customProps.value = [];

    delete pickValue.value.properties;
    delete pickValue.value.items;
    delete pickValue.value.required;
    delete pickValue.value.format;
    delete pickValue.value.enum;

    if (isArray.value) {
      pickValue.value.items = { type: 'string' };
    }
  }
  function onCheck(e: { target: { checked: any; }; }) {
    _checked(e.target.checked, props.parent);
  }
  function onRootCheck(e: { target: { checked: any; }; }) {
    _deepCheck(e.target.checked, pickValue.value);
  }
  function changeEnumValue(e) {
    const pickType = pickValue.value.type;
    const value = e.target.value;
    let arr = value.split('\n');

    if (pickType === 'string') {
      advancedValue.value.enum = arr.map((item: any) => item);
    } else {
      if (arr.length === 0 || (arr.length === 1 && arr[0] === '')) {
        advancedValue.value.enum = null;
      } else {
        advancedValue.value.enum = arr.map((item: any) => Number(item));
      }
    }
  }
  function _deepCheck(checked: any, node: JSONSchema) {
    if (node.type === 'object' && node.properties) {
      checked ? node.required = Object.keys(node.properties) : (delete node.required);
      Object.keys(node.properties).forEach(key => this._deepCheck(checked, node.properties[key]));
    } else if (node.type === 'array' && node.items.type === 'object') {
      checked ? node.items.required = Object.keys(node.items.properties) : (delete node.items.required);
      Object.keys(node.items.properties).forEach(key => this._deepCheck(checked, node.items.properties[key]));
    }
  }
  function _checked(checked: any, parent: JSONSchema | null) {
    let required = parent.required;
    if (checked) {
      // eslint-disable-next-line vue/no-mutating-props
      required || (props.parent.required = []);

      required = props.parent.required;
      required.indexOf(pickKey.value) === -1 && required.push(pickKey.value);
    } else {
      const pos = required.indexOf(pickKey.value);
      pos >= 0 && required.splice(pos, 1);
    }
    required.length === 0 && (delete parent.required);
  }
  function addChild(this: any) {
    const name = this._joinName();
    const type = 'string';
    const node = pickValue.value;
    node.properties || (node.properties = {}); // this.$set(node,'properties',{})
    const props = node.properties;
    props[name] = { type: type }; // this.$set(props,name,{type: type})
  }
  function parseCustomProps() {
    const ownProps1 = ownProps.value;
    Object.keys(pickValue.value).forEach(key => {
      if (ownProps1.indexOf(key) === -1) {
        confirmAddCustomNode({ key: key, value: pickValue.value[key] });
        // this.$delete(pickValue.value,key)
      }
    });
  }
  function addCustomNode() {
    // this.$set(addProp.value,'key',this._joinName())
    // this.$set(addProp.value,'value','')
    addProp.value.key = _joinName();
    addProp.value.value = '';
    customing.value = true;
  }
  function removeCustomNode(key: any) {
    customProps.value.forEach((item, index) => {
      if (item.key === key) {
        customProps.value.splice(index, 1);
        return;
      }
    });
  }
  function confirmAddCustomNode(prop: { key?: string; value?: any; }) {
    const p = prop || addProp.value;
    let existKey = false;
    customProps.value.forEach(item => {
      if (item.key === p.key) {
        existKey = true;
      }
    });
    if (existKey) return;
    customProps.value.push(p);
    addProp.value = {};
    customing.value = false;
  }
  function removeNode() {
    const { properties, required } = props.parent;
    delete properties[pickKey.value];
    if (required) {
      const pos = required.indexOf(pickKey.value);
      pos >= 0 && required.splice(pos, 1);
      required.length === 0 && (delete props.parent.required);
    }
  }
  function _joinName() {
    return `field_${props.deep}_${countAdd.value++}`;
  }
  function onSetting() {
    modalVisible.value = true;
    advancedValue.value = { ...advanced.value.value };
    for (const k in advancedValue.value) {
      if (pickValue.value[k]) {
        advancedValue.value[k] = pickValue.value[k];
      }
    }
    parseCustomProps();
  }

  function handleOk() {
    modalVisible.value = false;
    for (const key in advancedValue.value) {
      if (isNull(advancedValue.value[key])) {
        delete pickValue.value[key];
      } else {
        pickValue.value[key] = advancedValue.value[key];
      }
    }
    const diffKey = _pickDiffKey();
    diffKey.forEach(key => delete pickValue.value[key]);
    for (const item of customProps.value) {
      pickValue.value[item.key] = item.value;
    }
  }
  function _pickDiffKey() {
    const keys = Object.keys(pickValue.value);
    return keys.filter(item => ownProps.value.indexOf(item) === -1);
  }
</script>
<style scoped>
  .json-schema-editor .row {
    display: flex;
    margin: 12px;
  }

  .json-schema-editor .row .ant-col-name {
    display: flex;
    align-items: center;
  }

  .json-schema-editor .row .ant-col-name .ant-col-name-c {
    display: flex;
    align-items: center;
  }

  .json-schema-editor .row .ant-col-name .ant-col-name-required {
    flex: 0 0 24px;
    text-align: center;
    padding-left: 5px;
  }

  .json-schema-editor .row .ant-col-type {
    width: 100%;
  }

  .json-schema-editor .row .ant-col-setting {
    display: inline-block;
  }

  .json-schema-editor .row .setting-icon {
    color: rgba(0, 0, 0, 0.45);
    border: none;
  }

  .json-schema-editor .row .plus-icon {
    border: none;
  }

  .json-schema-editor .row .close-icon {
    color: #888;
    border: none;
  }
</style>
<style>
  .json-schema-editor-advanced-modal {
    color: rgba(0, 0, 0, 0.65);
    min-width: 600px;
  }

  .json-schema-editor-advanced-modal pre {
    font-family: monospace;
    height: 100%;
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 12px;
    width: 50%;
  }

  .json-schema-editor-advanced-modal h3 {
    display: block;
    border-left: 3px solid #1890ff;
    padding: 0 8px;
  }

  .json-schema-editor-advanced-modal .ant-advanced-search-form .ant-form-item {
    display: flex;
  }

  .json-schema-editor-advanced-modal .ant-advanced-search-form .ant-form-item .ant-form-item-control-wrapper {
    flex: 1;
  }
</style>