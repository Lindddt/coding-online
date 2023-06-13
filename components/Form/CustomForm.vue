
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
        :value="formValue[item.key]"
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
  import { FormInst, NForm, NFormItem, NInput, NButton, NSwitch } from 'naive-ui';
  import { defineComponent, reactive, ref } from 'vue';
  import { FormFieldConfig } from './FormType';
  import { sendMessage, Message } from '~/utils';

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
    validate();
    console.log(formValue.value, 'formValue', formItemRef);
  };

  const validate = async (keys?: string[]): Promise<boolean> => {
    if (keys) {
      let b = true;
      keys.forEach((key) => {
        if (!formItemRef.value[key]) b = false;
        formItemRef.value[key].validate();
        console.log(key, 'item', formItemRef.value[key].validate());
      });
      return b;
    } else {
      formInstRef.value?.validate((errors) => {
        if (!errors) {
          Message.success('验证成功');
          return true;
        } else {
          console.log(errors);
          Message.error('验证失败');
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

</script>
