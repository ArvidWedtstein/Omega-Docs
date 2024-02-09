<template>
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
          v-for="(vGroupContent, vGroupName, vIndex) in groupedTabs"
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
                  {{ vTab.title }}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: number;
  title: string;
  description: string;
  type?: string;
  category: string;
  slots?: Array<{
    name: string;
  }>;
  props?: Array<{
    name: string;
    type: string;
    default: string;
    description: string;
    required: boolean;
    example?: string;
  }>;
  content: string;
}

interface GroupedTabs {
  [category: string]: Tab[];
}
import { ref, defineEmits, defineProps } from "vue";

const { groupedTabs } = defineProps<{
  groupedTabs: GroupedTabs;
}>();

const emit = defineEmits(["tabSelected"]);

// Emit event to parent component when tab is selected
const selectTab = (pTab_ID: Tab["id"]) => {
  emit("tabSelected", pTab_ID);
};
</script>

<style scoped></style>
