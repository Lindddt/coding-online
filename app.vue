<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '~/store';
  import { onMounted } from 'vue';
  onMounted(() => {
    console.log('app.vue mounted');
    const store = useStore();
    store.checkLoginStatus();
  });

  // import { useMessage } from 'naive-ui';
  console.log('app.vue');

        // content
        // window.$message = useMessage();

</script>