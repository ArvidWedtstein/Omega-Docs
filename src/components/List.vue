<template></template>

<script setup lang="ts">
import { ref, computed } from "vue";

const vProps = defineProps({
  filename: { type: String, required: false },
  linenumbers: { type: Boolean, required: false, default: false },
});
</script>

<style scoped></style>
