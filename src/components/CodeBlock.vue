<template>
  <figure class="mb-0">
    <figcaption
      class="d-flex justify-content-between px-2 py-1 align-items-center bg-black text-light fw-semibold text-start"
      v-if="filename"
    >
      <span>{{ filename }}</span>

      <button
        class="btn d-inline-flex justify-content-center align-items-center text-light"
        style="width: 40px; height: 40px"
        type="button"
        @click="onCopy"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="currentColor"
        >
          <path
            d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
          />
        </svg>
      </button>
    </figcaption>

    <button
      class="btn d-inline-flex justify-content-center align-items-center text-light"
      style="
        width: 40px;
        height: 40px;
        position: absolute;
        right: 2px;
        top: 2px;
      "
      type="button"
      @click="onCopy"
      v-else
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        fill="currentColor"
      >
        <path
          d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
        />
      </svg>
    </button>

    <div class="d-flex p-3">
      <div v-if="linenumbers" class="line-numbers me-2">
        <div
          v-for="(vLine, vIndex) in vLines"
          :key="vIndex"
          class="line-number"
          style="user-select: none"
        >
          {{ vIndex + 1 }}
        </div>
      </div>
      <div class="text-start flex-grow-1" ref="vCodeRef">
        <slot name="code"></slot>
      </div>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const vProps = defineProps({
  filename: { type: String, required: false },
  linenumbers: { type: Boolean, required: false, default: false },
});

const vLines = computed(() => {
  return vCodeRef.value && vProps.linenumbers
    ? vCodeRef.value["children"][0]["children"][0].innerText.split("\n")
    : [];
});
const vCodeRef = ref();

const onCopy = () => {
  navigator.clipboard.writeText(
    vCodeRef.value["children"][0]["children"][0].innerText
  );
  console.log();
  alert("Copied!");
};
</script>

<style scoped>
/* Code Block*/
figure {
  position: relative;
  display: block;
  width: 100%;
  color: #f8f8f2;
  border: 1px solid #111;
  border-radius: 0.25rem;
  background: rgb(55, 55, 55);
}

.line-numbers {
  counter-reset: line;
  padding: 0 0.3rem 0 0;
  border-right: 1px solid #ddd;
}
.line-number {
  counter-increment: line;
  line-height: 1.7;
  font-size: 0.75rem;
}

pre code {
  font-family: "Courier New", Courier, monospace;
}
</style>
