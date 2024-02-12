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
        <nav class="w-100" id="bd-docs-nav" aria-label="Docs navigation">
          <ul
            class="nav flex-column mb-0 pb-3 pb-md-2 pe-lg-2"
            v-for="(vGroupContent, vGroupName, vIndex) in vGroupedTabs"
            :key="vIndex"
          >
            <li class="nav-item py-2">
              <strong class="d-flex w-100 align-items-center fw-semibold">
                {{ vGroupName }}
              </strong>

              <ul class="nav flex-column fw-normal pb-2 small">
                <li
                  class="nav-item"
                  v-for="(vTab, vTabIndex) in vGroupContent"
                  :key="vTabIndex"
                >
                  <button
                    type="button"
                    class="btn btn-link d-inline-block rounded"
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
import type { Tab } from "@/App.vue";
import { components } from "./../assets/Components.json";
import { ref, defineEmits, onMounted } from "vue";

interface GroupedTabs {
  [category: string]: Tab[];
}
const groupBy = <T extends Tab, K extends keyof T>(
  array: T[],
  key: K
): GroupedTabs => {
  return array.reduce((rv, x) => {
    const keyValue = x[key] as string;
    (rv[keyValue] = rv[keyValue] || []).push(x);
    return rv;
  }, {} as GroupedTabs);
};

const vGroupedTabs = ref<GroupedTabs>();
const emit = defineEmits(["tabSelected"]);

// Emit event to parent component when tab is selected
const selectTab = (pTab_ID: Tab["id"]) => {
  emit("tabSelected", pTab_ID);
};

onMounted(() => {
  vGroupedTabs.value = groupBy(
    components.map((p, id) => ({ id, ...p })),
    // .filter((t) => t.type === "Component" || !t.type),
    "category"
  );
});
</script>

<style scoped>
@media (min-width: 992px) {
  .docs-sidebar {
    position: sticky;
    top: 5rem;
    display: block !important;
    height: calc(100vh - 6rem);
    padding-left: 0.25rem;
    margin-left: -0.25rem;
    overflow-y: auto;
  }
}
.docs-sidebar {
  grid-area: sidebar;
}
</style>
