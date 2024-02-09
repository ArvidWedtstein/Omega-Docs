<template>
  <div id="app" class="container-xxl mt-3 docs-layout">
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
                      @click="setSelectedTab(vTab.id)"
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
    </aside>

    <main class="docs-main order-1">
      <button
        class="navbar-toggler p-2 d-block d-sm-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#docsSidebar"
        aria-controls="docsSidebar"
        aria-label="Toggle docs navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          class="bi"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          ></path>
        </svg>

        <span class="d-none fs-6 pe-1">Browse</span>
      </button>

      <div class="" v-if="selectedTab_ID > 0">
        <div class="py-5 text-center">
          <h1 class="display-5 fw-bold">{{ getTab(selectedTab_ID)?.title }}</h1>
          <div class="col-lg-12 mx-auto text-start">
            <p class="lead mb-4">{{ getTab(selectedTab_ID)?.description }}</p>

            <section class="text-start">
              <h5>Import:</h5>

              <CodeBlock>
                <template #code>
                  <pre
                    class="mb-0"
                  ><code contenteditable="false" tabindex="0" spellcheck="false">Import insert component here from 'insert path here'</code></pre>
                </template>
              </CodeBlock>
            </section>

            <p class="h5">Props:</p>
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
                  <input class="form-control" id="search" type="text" />
                </div>
              </div>

              <div class="btn-group btn-group-sm col-auto">
                <button
                  type="button"
                  @click="vSelectedPropView = 'list'"
                  class="btn"
                  title="List view"
                  :class="[
                    vSelectedPropView === 'list'
                      ? 'btn-dark'
                      : 'btn-outline-dark',
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
                  @click="vSelectedPropView = 'table'"
                  class="btn"
                  :class="[
                    vSelectedPropView === 'table'
                      ? 'btn-dark'
                      : 'btn-outline-dark',
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

            <div
              class="mt-3 container"
              :id="`${getTab(selectedTab_ID)?.title}-prop-options`"
            >
              <div class="props-table" v-if="vSelectedPropView === 'table'">
                <div class="" role="rowheader">
                  <div class="row fw-bold">
                    <div class="col">Name</div>
                    <div class="col">Type</div>
                    <div class="col">Default</div>
                    <div class="col">Description</div>
                    <div class="col-1"></div>
                  </div>
                </div>
                <div class="" role="rowgroup">
                  <div
                    class="row"
                    role="row"
                    v-for="(vProp, vPropIndex) in getTab(selectedTab_ID)?.props"
                    :key="vPropIndex"
                  >
                    <div class="col">
                      <span class="text-start"
                        >{{ vProp.name }}{{ vProp.required ? "*" : "" }}</span
                      >
                    </div>
                    <div class="col">
                      <small
                        v-if="vProp.type"
                        class="d-inline-flex px-1 py-0.5 fw-semibold text-secondary bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2"
                      >
                        {{ vProp.type }}
                      </small>
                    </div>
                    <div class="col">
                      <span>
                        {{ vProp.default }}
                      </span>
                    </div>
                    <div class="col">
                      <p class="prop-table-description">
                        {{ vProp.description }}
                      </p>
                    </div>
                    <div class="col-1 d-flex justify-content-center">
                      <button
                        class="btn btn-secondary d-inline-flex justify-content-center align-items-center"
                        style="width: 32px; height: 32px"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#prop-${vPropIndex}-collapse`"
                        aria-expanded="false"
                        :aria-controls="`prop-${vPropIndex}-collapse`"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          class="text-light"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M32 64C14.3 64 0 49.7 0 32S14.3 0 32 0l96 0c53 0 96 43 96 96l0 306.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 402.7 160 96c0-17.7-14.3-32-32-32L32 64z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      class="collapse text-start"
                      :id="`prop-${vPropIndex}-collapse`"
                    >
                      <span class="mb-0">Example:</span>
                      <CodeBlock linenumbers>
                        <template #code>
                          <pre
                            class="mb-0"
                          ><code contenteditable="false" tabindex="0" spellcheck="false">{{ `<ODataGrid
  :${vProp.name}="${vProp.default}"
/>` }}</code></pre>
                        </template>
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="vSelectedPropView === 'list'">
                <div
                  class="accordion accordion-flush"
                  id="accordionPanelsStayOpenExample"
                >
                  <div
                    class="accordion-item"
                    v-for="(vProp, vPropIndex) in getTab(selectedTab_ID)?.props"
                    :key="vPropIndex"
                  >
                    <h2
                      class="accordion-header d-inline-flex w-100 justify-content-between align-items-center py-1"
                      :id="`collapse-panel-heading-${vPropIndex}`"
                    >
                      <span class="text-primary h6 mb-0">
                        {{ vProp.name }}
                      </span>

                      <button
                        class="btn d-inline-flex justify-content-center align-items-center"
                        style="width: 32px; height: 32px"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#collapse-panel-${vPropIndex}`"
                        aria-expanded="true"
                        :aria-controls="`collapse-panel-${vPropIndex}`"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M32 64C14.3 64 0 49.7 0 32S14.3 0 32 0l96 0c53 0 96 43 96 96l0 306.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 402.7 160 96c0-17.7-14.3-32-32-32L32 64z"
                          />
                        </svg>
                      </button>
                    </h2>
                    <div
                      :id="`collapse-panel-${vPropIndex}`"
                      class="accordion-collapse collapse show text-start"
                      :aria-labelledby="`collapse-panel-heading-${vPropIndex}`"
                    >
                      <div class="d-flex flex-column gap-1 pb-3">
                        <span>{{ vProp.description }}</span>
                        <span v-if="vProp.type">
                          Type:
                          <small
                            class="d-inline-flex px-1 py-0.5 fw-semibold text-secondary bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2"
                          >
                            {{ vProp.type }}
                          </small>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CodeBlock from "./components/CodeBlock.vue";

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

const selectedTab_ID = ref(2);
const vSelectedPropView = ref("list");
const groupedTabs = ref<GroupedTabs>({});
const tabs: Tab[] = [
  {
    id: 1,
    title: "Dataobject",
    description: "",
    type: "Class",
    category: "Data",
    props: [
      {
        name: "reshiftItem",
        type: "function",
        default: "",
        description: "Reshifts items to new position.",
        example: `dsWorkflows.reshiftItem(vIndexOfItem, vNewIndex)`,
        required: false,
      },
      {
        name: "fileUpload",
        type: "object",
        default: "",
        description: "",
        example: ``,
        required: false,
      },
    ],
    content: `<div>
        Dataobject description
        
        </div>`,
  },
  {
    id: 2,
    title: "DataGrid",
    description: "",
    type: "Element",
    category: "Grid",
    slots: [
      { name: "detailTab" },
      { name: "detailActions" },
      { name: "cardheader" },
      { name: "noRowsFound" },
      { name: "overlay" },
      { name: "contextmenuTop" },
      { name: "contextmenu" },
      { name: "contextmenuBottom" },
      { name: "statusbar" },
    ],
    props: [
      {
        name: "dataObject",
        type: "DataObject",
        default: "null",
        description: "The data object used in the grid",
        required: false,
      },
      {
        name: "columns",
        type: "array",
        default: "null",
        description: "Columns passed as an array instead of slots",
        required: false,
      },
      {
        name: "data",
        type: "array",
        default: "",
        description: "",
        required: false,
      },
      {
        name: "rowClass",
        type: "[Function, Object, String]",
        default: "null",
        description:
          "String, dynamic class object or function that will be bound to the row class property. The current row is provided to the function as an argument.",
        required: false,
      },
      {
        name: "rowStyle",
        type: "[Function, Object, String]",
        default: "null",
        description:
          "String, dynamic class object or function that will be bound to the row class property. The current row is provided to the function as an argument.",
        required: false,
      },
      {
        name: "headerTitle",
        type: "",
        default: "",
        description: "",
        required: false,
      },
      {
        name: "menuTabs",
        type: "Record<string, any>[]",
        default: "null",
        description:
          "An array of custom tab definitions for the grid sidemenu details tab. Example: [{ title: 'Custom Tab', id: 'tab1', iconClass: 'bi bi-1-square-fill', component: MyTabComponent]",
        required: false,
      },
      {
        name: "rowclickhandler",
        type: "Function",
        default: "null",
        description:
          "Override the row click handler, when provided will not set current index",
        required: false,
      },
      {
        name: "noHeader",
        type: "Boolean",
        default: "false",
        description: "When set to `true` will not render header.",
        required: false,
      },
      {
        name: "disableFilterRow",
        type: "Boolean",
        default: "false",
        description: "When set to `true` will not render filter row.",
        required: false,
      },
      {
        name: "detailIframe",
        type: "",
        default: "",
        description: "",
        required: false,
      },
      {
        name: "detailTabTitle",
        type: "",
        default: "",
        description: "",
        required: false,
      },
      {
        name: "multilineHeader",
        type: "Boolean",
        default: "false",
        description: "Enables word wrapping for header columns",
        required: false,
      },
      {
        name: "importData",
        type: "Boolean",
        default: "false",
        description: "When true, will show importData",
        required: false,
      },
      {
        name: "initialMenuWidth",
        type: "String",
        default: "400px",
        description:
          "Sets the initial width of the grid menu, accepts values either in 'px' or '%' ",
        required: false,
      },
      {
        name: "groupByFolders",
        type: "Boolean",
        default: "false",
        description: "Adds group by folders selector into right panel",
        required: false,
      },
      {
        name: "dynamicLoading",
        type: "Boolean",
        default: "true",
        description:
          "Enables dynamic loading for the grid. When set to false will set the inner height to loaded data length.",
        required: false,
      },
      {
        name: "disableNavigation",
        type: "Boolean",
        default: "false",
        description:
          "When set to `true` will disable grid navigation features.",
        required: false,
      },
      {
        name: "collapseGridMenu",
        type: "Boolean",
        default: "false",
        description:
          "When set to `true` the grid setup menu will be initially collapsed.",
        required: false,
      },
      {
        name: "hideGridMenu",
        type: "Boolean",
        default: "false",
        description: "When set to `true` will not render the grid setup menu.",
        required: false,
      },
      {
        name: "fieldFilters",
        type: "Array",
        default: "null",
        description:
          "An array of initial field filters. For example `['Title', {name:'StatusCode', distinct:'StatusCode'}]`",
        required: false,
      },
      {
        name: "disableDeleteConfirm",
        type: "Boolean",
        default: "false",
        description:
          "When true will disable confirm dialog on delete actions in grid.",
        required: false,
      },
      {
        name: "noRowsFound",
        type: "string | boolean",
        default: "'No rows found...'",
        description:
          "Then set to true, will show default message and enable for custom overriding via 'noRowsFound' slot. Can also be used to override default message.",
        required: false,
      },
      {
        name: "eagerGridControl",
        type: "Function",
        default: "null",
        description: "Returns grid control ref immediately after creation",
        required: false,
      },
      {
        name: "",
        type: "",
        default: "",
        description: "",
        required: false,
      },
    ],
    content: `<div>
        datagrid description
        
        </div>`,
  },
  {
    id: 3,
    title: "OColumn",
    description: "",
    type: "Element",
    category: "Grid",
    props: [
      {
        name: "pinned",
        type: "left | right",
        default: "",
        description: "",
        required: false,
      },
    ],
    content: `<div>
        datagrid description
        
        </div>`,
  },
];

const setSelectedTab = (pTab_ID: number) => {
  selectedTab_ID.value = pTab_ID;
};

const getTab = (pTab_ID: number): Tab | null => {
  const vTab = tabs.find((vTab) => vTab.id === pTab_ID);
  return vTab || null;
};

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

onMounted(() => {
  groupedTabs.value = groupBy(
    tabs.filter((t) => t.type === "Element" || !t.type),
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
@media (min-width: 992px) {
  .docs-layout {
    display: grid;
    grid-template-areas: "sidebar main";
    grid-template-columns: 1fr 5fr;
    gap: 1.5rem;
  }
}
@media (min-width: 992px) {
  .docs-main {
    grid-template-areas:
      "intro   toc"
      "content toc";
    grid-template-rows: auto 1fr;
    grid-template-columns: 4fr 1fr;
  }
}
@media (min-width: 768px) {
  .docs-main {
    display: grid;
    grid-template-areas:
      "intro  "
      "toc    "
      "content";
    grid-template-rows: auto auto 1fr;
    gap: inherit;
  }
}
.docs-main {
  grid-area: main;
}

:not(pre) > code {
  padding: 2px 4px;
  border: 1px solid;
  color: var(--bs-code-color, #fff);
  border-color: rgba(47, 58, 70, 0.6);
  background-color: var(--bs-gray-900, #1c2025);
  border-radius: 6px;
  font-size: 0.8125rem;
  direction: ltr;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  line-height: 1.6;
}
.props-table {
  --bs-table-color-type: initial;
  --bs-table-bg-type: initial;
  --bs-table-color-state: initial;
  --bs-table-bg-state: initial;
  --bs-table-color: var(--bs-emphasis-color);
  --bs-table-bg: var(--bs-body-bg);
  --bs-table-border-color: var(--bs-border-color);
  --bs-table-accent-bg: transparent;
  --bs-table-striped-color: var(--bs-emphasis-color);
  --bs-table-striped-bg: rgba(var(--bs-emphasis-color-rgb), 0.05);
  --bs-table-active-color: var(--bs-emphasis-color);
  --bs-table-active-bg: rgba(var(--bs-emphasis-color-rgb), 0.1);
  --bs-table-hover-color: var(--bs-emphasis-color);
  --bs-table-hover-bg: rgba(var(--bs-emphasis-color-rgb), 0.075);
}

.props-table > :not(caption) > * {
  border-bottom: var(--bs-border-width) solid rgba(0, 0, 0, 0.2);
  color: var(
    --bs-table-color-state,
    var(--bs-table-color-type, var(--bs-table-color))
  );
  background-color: var(--bs-table-bg);
}
.props-table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  box-shadow: inset 0 0 0 9999px
    var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
}
</style>
