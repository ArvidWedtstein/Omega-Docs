<template>
  <aside class="docs-sidebar border-end">
    <div id="docsSidebar" class="offcanvas-lg offcanvas-start" tabindex="-1">
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title" id="docsSidebarOffcanvasLabel">
          Browse docs
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          data-bs-target="#docsSidebar"
        ></button>
      </div>

      <div class="offcanvas-body">
        <nav class="w-100" aria-label="Docs navigation">
          <TreeList :treeData="vGroupedTabs" @tab-selected="selectTab" :selected-tab="vSelectedTab" />
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// TODO: add "W" before every win component
// TODO: sort alphabetically
import type { Tab } from "@/App.vue";
import { components } from "./../assets/Components.json";
import TreeList from "./TreeList.vue";
import { ref, onMounted, watch, onBeforeMount } from "vue";


export interface Category {
  treeId: string;
  name: string;
  items: (Tab | Category)[];
}

const assignUniqueIds = (data: Category[], parentId = ''): void => {
  data.forEach((category, index) => {
    const categoryId = parentId ? `${parentId}-${index}` : `${index}`;
    category.treeId = categoryId;
    if (category.items && category.items.length > 0) {
      assignUniqueIds(category.items as Category[], categoryId);
    }
  });
}

const groupByCategoryPath = (data: Tab[]): Category[] => {
  const groupedData: Category[] = [];

  data.forEach((item) => {
    const category = item?.category?.split('/') || [];
    let currentGroup: any = groupedData;

    category.forEach((category, i) => {
      // Find if the category already exists
      let existingCategory = currentGroup.find((c: any) => c.name === category);

      // If the category doesn't exist, create it
      if (!existingCategory) {
        existingCategory = { name: category, items: [] };
        currentGroup.push(existingCategory);
      }

      // Update currentGroup for the next iteration
      currentGroup = existingCategory.items as Category[];
    });

    currentGroup.push(item);
  });

  assignUniqueIds(groupedData);

  return groupedData;
}

const vGroupedTabs = ref();
const vSelectedTab = ref<number>(1);
const emit = defineEmits(["tabSelected"]);

// Emit event to parent component when tab is selected
const selectTab = (pTab_ID: Tab["id"]) => {
  vSelectedTab.value = pTab_ID;
  emit("tabSelected", pTab_ID);
};



onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTabParam = urlParams.get('tab');

  if (selectedTabParam) {
    const vSelectTab = components.find((vTab) => vTab.name.includes(selectedTabParam) || vTab.id === parseInt(selectedTabParam));
    
    if (vSelectTab) {
      vSelectedTab.value = vSelectTab.id

      emit("tabSelected", vSelectTab.id)
    }
  }

  vGroupedTabs.value = groupByCategoryPath(
    components.filter((t) => t.type !== "TEMPLATE") as Tab[]
  );
});

window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTabParam = urlParams.get('tab');
  if (selectedTabParam) {
    const vSelectTab = components.find((vTab) => vTab.name.includes(selectedTabParam) || vTab.id === parseInt(selectedTabParam));
    
    if (vSelectTab) {
      vSelectedTab.value = vSelectTab.id

      emit("tabSelected", vSelectTab.id);
    }
  }
});
</script>

<style scoped>
@media (min-width: 992px) {
  .docs-sidebar {
    position: sticky;
    top: 0;
    bottom: 0;
    display: block !important;
    height: calc(100vh - 3rem);
    padding-left: 0.25rem;
    margin-left: -0.25rem;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.docs-sidebar {
  grid-area: sidebar;
}
</style>
