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
          <ul
            class="nav flex-column mb-0 pb-3 pb-md-2 pe-lg-2"
            v-for="(vGroupContent, vGroupName, vIndex) in vGroupedTabs"
            :key="vIndex"
          >
            <li class="nav-item py-2 d-block">
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
          <!-- {{ sidebar }} -->
          <!-- <ul
            class="nav flex-column mb-0 pb-3 pb-md-2 pe-lg-2"
            v-for="(vGroup, vIndex) in vTabs"
            :key="vIndex"
          >
            <li class="nav-item py-2 d-block">
              <strong class="d-flex w-100 align-items-center fw-semibold">
                {{ vGroup.category }}
              </strong>

              <ul
                class="nav flex-column fw-normal pb-2 small"
                v-if="vGroup.children"
              >
                <li
                  class="nav-item text-truncate py-2 d-block"
                  v-for="(vTab, vTabIndex) in vGroup.children"
                  :key="vTabIndex"
                >
                  <strong
                    v-if="vTab?.children"
                    class="d-flex w-100 align-items-center fw-semibold"
                  >
                    {{ vTab.category }}
                  </strong>

                  <ul
                    class="nav flex-column fw-normal pb-2 small"
                    v-if="vTab?.children"
                  >
                    <li
                      class="nav-item text-truncate"
                      v-for="(vTabChild, vTabChildIndex) in vTab.children"
                      :key="vTabChildIndex"
                    >
                      <button
                        type="button"
                        class="btn d-inline-block rounded text-truncate"
                        :class="{ 'fw-bold': vSelectedTab === vTab.id }"
                        @click="selectTab(vTab.id)"
                      >
                        {{ vTabChild.name }}
                      </button>
                    </li>
                  </ul>

                  <button
                    v-else
                    type="button"
                    class="btn d-inline-block rounded text-truncate"
                    :class="{ 'fw-bold': vSelectedTab === vTab.id }"
                    @click="selectTab(vTab.id)"
                  >
                    {{ vTab.name }}
                  </button>
                </li>
              </ul>

              <button
                v-else
                type="button"
                class="btn d-inline-block rounded text-truncate"
                :class="{ 'fw-bold': vSelectedTab === vGroup.id }"
                @click="selectTab(vGroup.id)"
              >
                {{ vGroup.name }}
              </button>
            </li>
          </ul> -->
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// TODO: Add folder support for category
// TODO: add "W" before every win component
import type { Tab } from "@/App.vue";
import { components } from "./../assets/Components.json";
import { ref, defineEmits, onMounted, h, computed } from "vue";
import useSidebarRenderer from "./useSidebarRenderer";
interface GroupedTabs {
  [category: string]: Tab[];
}
// const { sidebar } = useSidebarRenderer(
//   components.map((p, id) => ({ id, ...p })) as Tab[]
// );

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
const vTabs = ref<Record<string, any>[]>();
const vSelectedTab = ref();
const emit = defineEmits(["tabSelected"]);

// Emit event to parent component when tab is selected
const selectTab = (pTab_ID: Tab["id"]) => {
  vSelectedTab.value = pTab_ID;
  emit("tabSelected", pTab_ID);
};

onMounted(() => {
  vGroupedTabs.value = groupBy(
    components.map((p, id) => ({ id, ...p })) as Tab[],
    // .filter((t) => t.type === "Component" || !t.type),
    "category"
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
