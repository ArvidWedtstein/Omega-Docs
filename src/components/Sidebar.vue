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
          <TreeList :treeData="groupByCategoryPath(jsonData)" @select-tab="(pTab_ID) => console.log('Aaaaa', pTab_ID)" :selected-tab="vSelectedTab" />
          <ul
            class="nav flex-column mb-0 pb-3 pb-md-2 pe-lg-2"
            v-for="(vGroupContent, vGroupName, vIndex) in vGroupedTabs"
            :key="vIndex"
          >
            <li class="nav-item d-block">
              <strong class="d-flex w-100 align-items-center fw-semibold">
                {{ vGroupName }}
              </strong>

              <ul class="nav flex-column fw-normal pb-2 small">
                <li
                  class="nav-item text-truncate"
                  v-for="(vTab, vTabIndex) in vGroupContent"
                  :key="vTabIndex"
                >
                  <button
                    type="button"
                    class="btn d-inline-block rounded text-truncate"
                    :class="{ 'fw-bold': vSelectedTab === vTab.id }"
                    @click="selectTab(vTab.id)"
                  >
                    {{ vTab.name }}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
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
import { ref, onMounted } from "vue";

interface GroupedTabs {
  [category: string]: Tab[];
}

const groupBy = <T extends Tab, K extends keyof T>(
  array: T[],
  key: K,
): GroupedTabs => {
  return array.reduce((rv, x) => {
    const keyValue = x[key] as string;
    (rv[keyValue] = rv[keyValue] || []).push(x);
    return rv;
  }, {} as GroupedTabs);
};


interface Item {
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  items: (Item | Category)[];
}
const jsonData = ref([
  { name: 'item1', category: 'Data/Lookup/Column' },
  { name: 'item2', category: 'Data/Lookup/Row' },
  { name: 'item3', category: 'Data/Filter' },
  { name: 'item4', category: 'Data/Lookup/Column' },
  { name: 'item5', category: 'Data/Lookup/Row' },
  { name: 'item6', category: 'Data/Lookup/Column/Cell' },
  { name: 'item7', category: 'Data/Lookup/Row' },
  { name: 'item7', category: 'Data/Lookup/Column/Cell/Input' },
])
function assignUniqueIds(data: Category[], parentId = ''): void {
  data.forEach((category, index) => {
    const categoryId = parentId ? `${parentId}-${index}` : `${index}`;
    category.id = categoryId;
    if (category.items && category.items.length > 0) {
      assignUniqueIds(category.items as Category[], categoryId);
    }
  });
}

const groupByCategoryPath = (data: Item[]): Category[] => {
  const groupedData: Category[] = [];

  data.forEach((item, index) => {
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

const vGroupedTabs = ref<GroupedTabs>();
const vSelectedTab = ref(1);
const emit = defineEmits(["tabSelected"]);

// Emit event to parent component when tab is selected
const selectTab = (pTab_ID: Tab["id"]) => {
  vSelectedTab.value = pTab_ID;

  console.log(pTab_ID)
  emit("tabSelected", pTab_ID);
};



onMounted(() => {
  vGroupedTabs.value = groupBy(
    components as Tab[],
    // .filter((t) => t.type === "Component" || !t.type),
    "category",
  );
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
