<template>
  <div id="app" class="container-fluid mt-3 docs-layout h-100">
    <Sidebar @tab-selected="setSelectedTab" />

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
          <h1 class="display-5 fw-bold">{{ selectedTab?.name }}</h1>
          <CodeBuilder
            v-if="selectedTab?.type !== 'Function'"
            :tab="selectedTab as Tab"
            class="h-100"
          />

          <div class="col-lg-12 mx-auto text-start">
            <p class="lead mb-4">{{ selectedTab?.description }}</p>
            
            <pre><code class="language-javascript">
  // code here for example
  function hello(){
     console.log(Hello World)
  } 
</code></pre>

            <Section v-if="selectedTab?.params?.length" title="Syntax">
              <CodeBlock
                class="h-100"
                linenumbers
                :code="`${selectedTab?.name}(\n${selectedTab?.params.map((pParam) => `  ${pParam?.name}: ${pParam?.type}`).join(',\n')}\n)`"
              >
                <template #code>
                  <pre
                    class="mb-0"
                  ><code contenteditable="false" tabindex="0" spellcheck="false">{{ `${selectedTab?.name}(\n${selectedTab?.params.map((pParam) => `  ${pParam?.name}: ${pParam?.type}`).join(',\n')}\n)` }}</code></pre>
                </template>
              </CodeBlock>
            </Section>

            <Section v-if="selectedTab?.path" title="Import">
              <CodeBlock class="h-100">
                <template #code>
                  <pre
                    class="mb-0"
                  ><code contenteditable="false" tabindex="0" spellcheck="false">Import {{ selectedTab?.name }} from '{{ `${getTab(selectedTab_ID)?.path}` }}'</code></pre>
                </template>
              </CodeBlock>
            </Section>

            <Section v-if="selectedTab?.snippets?.length" title="Snippets">
              <PropSelector class="mb-3" @search="" />

              <div
                class="accordion accordion-flush"
                id="accordionPanelsStayOpenExample"
              >
                <div
                  class="accordion-item"
                  v-for="(vSnippet, vSnippetIndex) in selectedTab?.snippets"
                  :key="vSnippetIndex"
                >
                  <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      {{ vSnippet.title }}
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingOne"
                  >
                    <div class="" v-if="vSnippet.code">
                      <CodeBlock>
                        <template #code>
                          <pre
                            class="mb-0"
                          ><code contenteditable="false" tabindex="0" spellcheck="false">{{ vSnippet.code }}</code></pre>
                        </template>
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section v-if="selectedTab?.props?.length" title="Props">
              <PropSelector
                @search="onSearchChange"
                @view-change="(view) => (vSelectedPropView = view)"
              />

              <div
                class="mt-3 container"
                :id="`${selectedTab?.name}-prop-options`"
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
                      v-for="(vProp, vPropIndex) in vSearchItems"
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
                          class="btn d-inline-flex justify-content-center align-items-center"
                          style="width: 36px; height: 36px"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="`#prop-${vPropIndex}-collapse`"
                          aria-expanded="false"
                          :aria-controls="`prop-${vPropIndex}-collapse`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            fill="currentColor"
                            width="30"
                            height="30"
                          >
                            <path
                              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
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
                  <div class="accordion accordion-flush">
                    <div
                      class="accordion-item"
                      v-for="(vProp, vPropIndex) in vSearchItems"
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
                          style="width: 36px; height: 36px"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="`#collapse-panel-${vPropIndex}`"
                          aria-expanded="true"
                          :aria-controls="`collapse-panel-${vPropIndex}`"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            fill="currentColor"
                            width="30"
                            height="30"
                          >
                            <path
                              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
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

                          <CodeBlock linenumbers v-if="vProp.example">
                            <template #code>
                              <pre
                                class="mb-0"
                              ><code contenteditable="false" tabindex="0" spellcheck="false">{{ `<ODataGrid
  ${vProp.example}
/>` }}</code></pre>
                            </template>
                          </CodeBlock>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// TODO: update lookup snippets
// TODO: make view for snippets, exposes, events, params
// TODO: make dynamic snippets. Replace {COMPONENT} with componentname and so on
import components from "./assets/Components.json";
import { ref, watch, onMounted } from "vue";
import CodeBlock from "./components/CodeBlock.vue";
import Sidebar from "./components/Sidebar.vue";
import CodeBuilder from "./components/CodeBuilder.vue";
import PropSelector from "./components/PropSelector.vue";
import Section from "./components/Section.vue";

interface Event {
  name?: string | undefined;
  description?: string | undefined;
  syntax?: string | undefined;
}
interface Slot {
  name?: string | undefined;
  description?: string | undefined;
  template?: string | undefined;
}
interface Expose {
  name?: string | undefined;
  description?: string | undefined;
}
interface Snippet {
  title?: string | undefined;
  content?: string | undefined;
  code?: string | undefined;
}
interface Param {
  name?: string | undefined;
  type?: string | undefined;
  default?: string | undefined;
}
interface Property {
  name?: string | undefined;
  type?: string | undefined;
  default?: string | undefined;
  description?: string | undefined;
  required?: boolean | undefined;
  template?: string | undefined;
  example?: string | undefined;
  params?: Array<Record<string, any>> | undefined;
}
export interface Tab {
  id: number;
  name: string;
  description?: string;
  template?: string | undefined;
  example?: string | undefined;
  type?: string;
  category: string;
  path?: string;
  params?: Array<Partial<Param>> | undefined;
  slots?: Array<Partial<Slot>> | undefined;
  events?: Array<Partial<Event>> | undefined;
  props?: Array<Partial<Property>> | undefined;
  snippets?: Array<Partial<Snippet>> | undefined;
  exposes?: Array<Partial<Expose>> | undefined;
}

function checkForDuplicates(component: Tab): void {
  function findDuplicates(
    array: Partial<{ name: string; title: string }>[],
    prop: string = "name",
  ): string[] {
    const names = array.map((item: any) => item[prop]);
    const uniqueNames = new Set(names);
    const duplicates: string[] = [];

    uniqueNames.forEach((name) => {
      const count = names.filter((n) => n === name).length;
      if (count > 1 && name) {
        duplicates.push(name);
      }
    });

    return duplicates;
  }

  const duplicateProps = component.props ? findDuplicates(component.props) : [];
  const duplicateSnippets = component.snippets
    ? findDuplicates(component.snippets, "title")
    : [];
  const duplicateExposes = component.exposes
    ? findDuplicates(component.exposes)
    : [];
  const duplicateSlots = component.slots ? findDuplicates(component.slots) : [];
  const duplicateEvents = component.events
    ? findDuplicates(component.events)
    : [];
  const duplicateParams = component.params
    ? findDuplicates(component.params)
    : [];

  if (duplicateProps.length > 0) {
    console.error(
      `Duplicate props found in component: ${
        component.name
      }\nDuplicate prop names: ${duplicateProps.join(", ")}`,
    );
  }

  if (duplicateSnippets.length > 0) {
    console.error(
      `Duplicate snippets found in component: ${
        component.name
      }\nDuplicate snippet names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateExposes.length > 0) {
    console.error(
      `Duplicate exposes found in component: ${
        component.name
      }\nDuplicate expose names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateSlots.length > 0) {
    console.error(
      `Duplicate slots found in component: ${
        component.name
      }\nDuplicate slot names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateEvents.length > 0) {
    console.error(
      `Duplicate events found in component: ${
        component.name
      }\nDuplicate event names: ${duplicateEvents.join(", ")}`,
    );
  }

  if (duplicateParams.length > 0) {
    console.error(
      `Duplicate params found in component: ${
        component.name
      }\nDuplicate param names: ${duplicateParams.join(", ")}`,
    );
  }
}

const selectedTab_ID = ref();
const selectedTab = ref<Tab>();
const vSelectedPropView = ref("list");
const vSearchItems = ref<Tab["props"]>([]);

watch(selectedTab_ID, async (newTab_ID, oldTab_ID) => {
  vSearchItems.value = getTab(newTab_ID)?.props || [];
});

const vTabs = ref<Partial<Tab[]>>([]);

const onSearchChange = (pSearchValue: String) => {
  vSearchItems.value = getTab(selectedTab_ID.value)?.props?.filter((vProp) =>
    vProp.name?.toLowerCase().includes(pSearchValue.toLowerCase()),
  );
};

const setSelectedTab = (pTab_ID: number) => {
  selectedTab_ID.value = pTab_ID;

  let vTab = getTab(pTab_ID);

  if (vTab) {
    selectedTab.value = vTab;
  }
};

const getTab = (pTab_ID: number): Tab | null => {
  const vTab = vTabs.value.find((vTab) => vTab?.id === pTab_ID);
  return vTab || null;
};

onMounted(() => {
  const vComponents = components.components.map((pComponent) => {
    checkForDuplicates(pComponent as Tab);

    return {
      ...pComponent,
      snippets: pComponent?.snippets?.map((pSnippet: Snippet) => {
        if (pSnippet.code) {
          pSnippet.code = pSnippet.code.replace(
            /{COMPONENT}/g,
            pComponent.name,
          );
        }
        return pSnippet;
      }),
    };
  });

  // console.log(vComponents);
  vTabs.value = vComponents as Tab[];

  setSelectedTab(1);
});
</script>

<style scoped>
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

.btn svg {
  transition: 0.3s transform ease-in-out;
}
.btn.collapsed svg {
  transform: rotate(180deg);
}
</style>
