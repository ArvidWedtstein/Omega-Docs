<template>
  <div class="row align-items-center g-3">
    <div class="col-auto flex-grow-1">
      <div class="input-group">
        <label for="search" class="input-group-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            height="20"
            fill="currentColor"
          >
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            />
          </svg>
        </label>
        <input
          class="form-control"
          id="search"
          type="text"
          v-model="vSearch"
          @input="onSearchChange"
        />
      </div>
    </div>

    <div class="btn-group btn-group-sm col-auto">
      <button
        type="button"
        @click="vSelectedView = 'list'"
        class="btn"
        title="List view"
        :class="[
          vSelectedView === 'list' ? 'btn-secondary' : 'btn-outline-secondary',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          width="20"
          height="28"
        >
          <path
            d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"
          />
        </svg>
      </button>
      <button
        type="button"
        @click="vSelectedView = 'table'"
        class="btn"
        :class="[
          vSelectedView === 'table' ? 'btn-secondary' : 'btn-outline-secondary',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          width="20"
        >
          <path
            d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, onMounted, watch } from "vue";

const vSelectedView = ref("list");
const vSearch = ref("");

const emit = defineEmits<{
  "view-change": [new_view: string, old_view: string];
  search: [value: string];
}>();

watch(vSelectedView, async (newView, oldView) => {
  emit("view-change", newView, oldView);
});

const vProps = defineProps({
  initialView: { type: String, required: false, default: "list" },
});

const onSearchChange = (pSearchEvent: Event) => {
  emit("search", vSearch.value);
};

onMounted(() => {
  vSelectedView.value = vProps.initialView;
});
</script>

<style scoped></style>
