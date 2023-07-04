
<template>
  <n-form
    ref="formInstRef"
    :label-width="80"
    :model="formValue"
    :size="size"
    :label-placement="labelPlacement"
    :inline="inline"
  >
    <n-form-item
      v-for="(item, index) in props.formList"
      :key="`form-item-${item.key}-${index}`"
      :ref="(ref) => { formItemRef[item.key] = ref; }"
      :disabled="item.disabled"
      :validation-status="formStatus[item.key]"
      :label="item.label"
      :rule="item.rule"
      :path="item.key"
    >
      <n-input
        v-if="item.formType === 'input'"
        v-model:value="formValue[item.key]"
        :placeholder="item.placeholder"
        :type="item.type"
        show-password-on="click"
      />
      <n-switch
        v-else-if="item.formType === 'switch'"
        v-model:value="formValue[item.key]"
        :disabled="item.disabled"
        :rail-style="item['railStyle']"
        :checked-value="item['checkedValue']"
      >
        <template
          v-if="!!item.checkedContent"
          #checked
        >
          {{ item.checkedContent }}
        </template>
        <template
          v-if="!!item.uncheckedContent"
          #unchecked
        >
          {{ item.uncheckedContent }}
        </template>
      </n-switch>
      <!-- radio -->
      <n-radio-group
        v-if="item.formType === 'radio'"
        v-model:value="formValue[item.key]"
      >
        <n-space>
          <n-radio
            v-for="option in item.options"
            :key="option.value"
            :value="option.value"
            :default-value="item.value"
          >
            {{ option.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
      <!-- select -->
      <n-select
        v-if="item.formType === 'select'"
        v-model:value="formValue[item.key]"
        :placeholder="item.placeholder"
        :options="item.options"
        :multiple="item.multiple"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :virtual-scroll="item.virtualScroll"
      />
      <template v-if="item.formType === 'custom'">
        <component :is="item['render']({ formData: formValue, changeData, validate })" />
      </template>
    </n-form-item>
    <n-form-item>
      <n-button
        v-if="!!onSubmit"
        attr-type="button"
        @click="onFormSubmit"
      >
        {{ confirmText ? confirmText : '提交' }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang='ts'>
  import { FormInst, NForm, NFormItem, NInput, NButton, NSwitch, NRadio, NRadioGroup, FormValidationError, NSelect } from 'naive-ui';
  import { defineComponent, reactive, ref } from 'vue';
  import { FormFieldConfig } from './FormType';
  import { sendMessage } from '~/utils';

  const props = defineProps<{
    'formList': FormFieldConfig[],
    'size'?: 'small' | 'medium' | 'large',
    'confirmText'?: string,
    'onSubmit'?: (formValue: Record<string, any>) => void,
    'labelPlacement'?: 'left' | 'top';
    'inline'?: boolean;
  }>();


  console.log(props, 'formList');
  const formValue = ref(props.formList.reduce((acc, cur) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {
  } as Record<string, any>));
  const formStatus = ref(props.formList.reduce((acc, cur) => {
    acc[cur.key] = undefined;
    return acc;
  }, {
  } as Record<string, any>));

  const formInstRef = ref<FormInst | null>(null);
  const formItemRef = ref<{
    [key: string]: any;
  }>({
  });

  const getFormData = () => {
    return formValue.value;
  };

  const changeData = (value: any, key: string) => {
    formValue.value[key] = value;
    formInstRef.value?.validate();
    // validate();
    console.log(formValue.value, 'formValue', formItemRef);
  };

  const validate = async (keys?: string[]): Promise<boolean> => {
    if (keys) {
      let b = true;
      keys.forEach(async (key) => {
        if (!formItemRef.value[key]) b = false;
        try {
          await formItemRef.value[key].validate();
          console.log(key, 'item', formItemRef.value[key]);
        } catch (error) {
          b = false;
          console.log(key, 'item', 'dasads', error);
          const err = error as FormValidationError;
          sendMessage.error(err[0].message || '');
        }
      });
      return b;
    } else {
      formInstRef.value?.validate((errors) => {
        if (!errors) {
          sendMessage.success('验证成功');
          return true;
        } else {
          console.log(errors);
          sendMessage.error('验证失败');
          return false;
        }
      },);
      return true;
    }
  };
  console.log(formItemRef, 'formItemRef');
  const onFormSubmit = () => {
    console.log(formValue);

    formInstRef.value?.validate().then(() => {
      if (!props.onSubmit) return;
      console.log(formValue);
      props.onSubmit(formValue.value);
    }).catch(() => {
      console.log('error');
    });

  };

  defineExpose({
    validate,
    // eslint-disable-next-line vue/no-ref-object-destructure
    formData: formValue.value,
  });
</script>
