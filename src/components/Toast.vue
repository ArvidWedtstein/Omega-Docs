<template>
    <button class="btn btn-outline-primary" @click="showToast('Hello, world!')">
      <slot></slot>
    </button>

    <div v-if="toastMessage" class="toast-container position-fixed p-3" :class="[toastPosition]">
      <div id="liveToast" class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
          <strong class="me-auto"></strong>
          <!-- <small>11 mins ago</small> -->
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import useToast from './../useToast'; // Import the custom toast handler

const { toastMessage, toastPosition, showToast } = useToast();

</script>
