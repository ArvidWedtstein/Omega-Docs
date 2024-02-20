<template>
  <ul class="nav flex-column mb-0 pb-2 pb-md-2 pe-lg-2">
    <li v-for="(itemOrCategory, index) in treeData" :key="index" class="nav-item">
      <template v-if="isItem(itemOrCategory)">
        <button
          type="button"
          class="btn d-block rounded text-truncate"
          @click="() => selectTab(1)"
        >
          {{ itemOrCategory.name }}
        </button>
        <!-- :class="{ 'fw-bold': vSelectedTab === vTab.id }"
          @click="selectTab(vTab.id)" -->
      </template>

      <template v-else-if="itemOrCategory.items.length > 0">
        <a class="nav-link d-inline-block rounded text-truncate fw-semibold" data-bs-toggle="collapse" :href="`#collapse-${itemOrCategory.id}`" role="button" aria-expanded="false" :aria-controls="`collapse-${itemOrCategory.id}`">
          <span class="">{{ itemOrCategory.name }}</span>
        </a>
        
        <TreeList :treeData="itemOrCategory.items" class="ms-4 collapse" :id="`collapse-${itemOrCategory.id}`" :selectedTab="selectedTab" />
      </template>
    </li>
  </ul>
</template>
  

<script lang="ts" setup>
import type { PropType } from 'vue';
import TreeList from './TreeList.vue'

interface Item {
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  items: (Item | Category)[];
}
defineProps({
  treeData: {
    type: Array as PropType<(Item | Category)[]>,
    required: true
  },
  selectedTab: {
    type: Number,
    required: true
  }
})

const vEmits = defineEmits<{
  (e: 'selectTab', pTab_ID: number): void
}>()

const isItem = (itemOrCategory: Item | Category): itemOrCategory is Item => {
  return 'category' in itemOrCategory;
}

const selectTab = (vTab_ID: number) => {
  console.log('select tab. ready to emit', vTab_ID)
  vEmits("selectTab", vTab_ID)
}


</script>

<style scoped>
.nav-link[data-bs-toggle="collapse"][aria-expanded="true"]::before {
	transform: rotate(90deg);
}
.nav-link[data-bs-toggle="collapse"]::before {
	width: 0.85em;
  margin-right: 0.5rem;
	line-height: 0;
	content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
	transition: transform 0.35s ease;
	transform-origin: .5em 50%;
}
</style>