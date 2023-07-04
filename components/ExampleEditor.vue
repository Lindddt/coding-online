<template>
  <ClientOnly
    fallback-tag="span"
    fallback="Loading Markdown..."
  >
    <v-md-editor
      v-model="markdown"
      height="400px"
      @change="changeDataInner"
    />
  </ClientOnly>
</template>

<script setup lang='ts'>
  import { ref } from 'vue';

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

<style lang='less' scoped>
.verification-code {
  display: flex;
  flex: 1;
}
</style>