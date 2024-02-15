<template>
  <section class="border-bottom py-3 border-dark">
    <p class="h5">{{ vProps.title }}</p>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

export interface Props {
  title: string;
}
const vProps = withDefaults(defineProps<Props>(), {
  title: "",
});
</script>

<style scoped></style>
