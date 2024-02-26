<template>
  <ul class="nav nav-underline flex-column mb-0 pb-3 pt-1 pb-md-2 pe-lg-2 gap-0 overflow-hidden">
    <li v-for="(itemOrCategory, index) in treeData" :key="index" class="nav-item">
      <template v-if="isItem(itemOrCategory)">
        <button
          type="button"
          class="btn w-100 text-start text-truncate"
          :class="{ 'fw-bold': itemOrCategory.id === selectedTab }"
          @click="() => selectTab(itemOrCategory.id)"
        >
          {{ itemOrCategory.name }}
        </button>
      </template>

      <template v-else-if="itemOrCategory.items.length > 0">
        <a class="nav-link link-secondary text-truncate fw-semibold" :class="{'collapsed': !itemOrCategory.items.some((vItem) => isItem(vItem) && vItem.id === selectedTab)}" data-bs-toggle="collapse" :href="`#collapse-${itemOrCategory.treeId}`" role="button" aria-expanded="false" :aria-controls="`collapse-${itemOrCategory.treeId}`">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="none" stroke="rgba(0,0,0,.5)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14l6-6-6-6"/></svg>
          <span class="">{{ itemOrCategory.name }}</span>
        </a>
        
        <TreeList :treeData="itemOrCategory.items" class="ps-4 collapse" :class="{'show': itemOrCategory.items.some((vItem) => isItem(vItem) && vItem.id === selectedTab)}" :id="`collapse-${itemOrCategory.treeId}`" :selectedTab="selectedTab" @tab-selected="selectTab" />
      </template>
    </li>
  </ul>
</template>
  

<script lang="ts" setup>
import type { PropType } from 'vue';
import TreeList from './TreeList.vue'
import type { Category } from './Sidebar.vue';
import type { Tab } from '@/App.vue';


defineProps({
  treeData: {
    type: Array as PropType<(Tab | Category)[]>,
    required: true
  },
  selectedTab: {
    type: Number,
    required: true
  }
})


const emit = defineEmits(['tabSelected']);


const isItem = (itemOrCategory: Tab | Category): itemOrCategory is Tab => {
  return 'category' in itemOrCategory;
}

const selectTab = (vTab_ID: number) => {
  try {
    emit("tabSelected", vTab_ID)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>

.nav-link[data-bs-toggle="collapse"].collapsed svg {
  transform: rotate(0deg);
}
.nav-link[data-bs-toggle="collapse"] svg {
	/* width: 0.85em; */
  margin-right: 0.5rem;
	line-height: 0;
	/* content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e"); */
	transition: transform 0.35s ease;
	transform-origin: .5em 50%;
  transform: rotate(90deg);
}
</style>