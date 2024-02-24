<template>
  <section class="border-bottom py-4 border-dark">
    <slot name="title"></slot>
    <p class="h5" v-if="!$slots.title">{{ vProps.title }}</p>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">

export interface Props {
  title: string;
}
const vProps = withDefaults(defineProps<Props>(), {
  title: "",
});
</script>

<style scoped></style>
