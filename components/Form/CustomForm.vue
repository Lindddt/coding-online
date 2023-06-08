<template>
  <n-form
    ref="formRef"
    :label-width="80"
    :model="formValue"
    :size="size"
    :label-placement="labelPlacement"
    :inline="inline"
  >
    <n-form-item
      v-for="(item, index) in props.formList"
      :key="`form-item-${item.key}-${index}`"
      :disabled="item.disabled"
      :validation-status="formStatus[item.key]"
      :label="item.label"
    >
      <n-input
        v-if="item.formType === 'input'"
        v-model:value="formValue[item.key]"
        :placeholder="item.placeholder"
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

  const props = defineProps<{
    'formList': FormFieldConfig[],
    'size'?: 'small' | 'medium' | 'large',
    'confirmText'?: string,
    'onSubmit'?: (formValue: Record<string, any>) => void,
    'labelPlacement'?: 'left' | 'top';
    'inline'?: boolean;
  }>();
  console.log(props,'formList');
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
  const onFormSubmit = () => {
    formInstRef.value?.validate().then(() => {
      if (!props.onSubmit) return;
      props.onSubmit(formValue.value);
    }).catch(() => {
      console.log('error');
    });
  };

</script>
