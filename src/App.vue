<template>
  <div id="app" class="container-fluid mt-3 docs-layout h-100">
    <Sidebar @tab-selected="setSelectedTab" />

    <main class="docs-main order-1">
      <button class="navbar-toggler p-2 d-block d-sm-none" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#docsSidebar" aria-controls="docsSidebar" aria-label="Toggle docs navigation">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
        </svg>

        <span class="d-none fs-6 pe-1">Browse</span>
      </button>

      <div v-if="selectedTab">
        <div class="py-5 text-center">
          <h1 class="display-5 fw-bold">{{ selectedTab?.name }}</h1>
          <CodeBuilder
            v-if="(selectedTab?.props?.length || selectedTab?.params?.length) && selectedTab?.type !== 'Function' && selectedTab?.type !== 'Class'"
            :tab="selectedTab" class="h-100 mb-2" />

          <div class="col-lg-12 mx-auto text-start">
            <p class="lead mb-4">{{ selectedTab?.description }}</p>

            <Section v-if="selectedTab?.path" title="Import">
              <CodeBlock disable-code-formatting language="javascript" :code="`import ${selectedTab.pathtype === 'Object' ? `{ ${selectedTab.name} }` : selectedTab?.name} from '${selectedTab?.path}';`" />
            </Section>
            
            <Section v-if="selectedTab?.params?.length" title="Syntax">
              <CodeBlock class="h-100" disable-copy language="javascript" :code="formatParams()" />
            </Section>
            
            <Section v-if="selectedTab?.snippets?.length" title="Snippets">
              <template #title>
                <a class="h5 d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#snippets" type="button" role="button" aria-expanded="false" aria-controls="snippets">
                  Snippets
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="chevron"
                    fill="currentColor"
                    stroke-width="0"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
                    />
                  </svg>
                </a>
              </template>

              <PropSelector class="my-3 collapse" @search="" id="snippets" input-id="snippetsinput">
                <template #list>
                  <ul class="list-group">
                    <li class="list-group-item" v-for="({ title, content, code}, vSnippetIndex) in selectedTab?.snippets" :key="vSnippetIndex">
                      <div class="card bg-transparent border-0">
                        <a class="card-header border-0 bg-transparent d-flex justify-content-between align-items-center" role="button" :href="`#snippet-collapse-${vSnippetIndex}`" data-bs-toggle="collapse" :aria-expanded="selectedTab?.snippets.length < 2" :aria-controls="`snippet-collapse-${vSnippetIndex}`">
                          {{ title }}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="chevron"
                            fill="currentColor"
                            stroke-width="0"
                            width="20"
                            height="20"
                          >
                            <path
                              d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
                            />
                          </svg>
                        </a>
                        <div class="collapse border-top" :id="`snippet-collapse-${vSnippetIndex}`" :class="{ 'show': selectedTab?.snippets.length < 2}">
                          <div class="card-body" v-if="content">
                            <p class="card-text">{{ content }}</p>
                          </div>
                          <CodeBlock v-if="code" language="html" :code="code" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </template>

                <template #table>
                  <div class="row row-cols-1 row-cols-sm-1 row-cols-md-2 g-3">
                    <div class="col" v-for="({ title, content, code}, vSnippetIndex) in selectedTab?.snippets" :key="vSnippetIndex">
                      <div class="card shadow-sm">
                        <CodeBlock class="card-img-top" v-if="code" language="html" :code="code" />
                        <div class="card-body">
                          <h5 class="card-title">{{ title }}</h5>
                          <p class="card-text">{{ content }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </PropSelector>
            </Section>


            <Section v-if="selectedTab?.props?.length" title="Props">
              <template #title>
                <a class="h5 d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#props" role="button" aria-expanded="false" aria-controls="props">
                  Props
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="chevron"
                    fill="currentColor"
                    stroke-width="0"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
                    />
                  </svg>
                </a>
              </template>
              
              <PropSelector
                input-id="props-input"
                class="my-3 collapse"
                id="props"
                @search="searchValue => onSearchChange(searchValue, 'props')"
              >
                <template #list>
                  <div class="accordion accordion-flush">
                    <div
                      class="accordion-item"
                      v-for="(vProp, vPropIndex) in vSearchProps"
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
                        class="accordion-collapse collapse text-start show"
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
                          
                          <div class="mt-3" v-if="vProp.example || vProp.template">
                            <span>Example:</span>
                            <CodeBlock :code="vProp.example || vProp.template" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template #table>
                  <div class="props-table">
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
                        v-for="(vProp, vPropIndex) in vSearchProps"
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
                            class="btn d-inline-flex justify-content-center align-items-center collapsed"
                            v-if="vProp.example || vProp.template"
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
                          v-if="vProp.example || vProp.template"
                          class="collapse text-start"
                          :id="`prop-${vPropIndex}-collapse`"
                        >
                          <span class="mb-0">Example:</span>
                          <CodeBlock :code="vProp.example || vProp.template" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </PropSelector>
            </Section>

            <Section v-if="selectedTab?.events?.length" title="Events">
              <template #title>
                <a class="h5 d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#events" role="button" aria-expanded="false" aria-controls="events">
                  Events
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="chevron"
                    fill="currentColor"
                    stroke-width="0"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
                    />
                  </svg>
                </a>
              </template>

              <PropSelector
                input-id="events-input"
                class="my-3 collapse"
                id="events"
                @search="searchValue => onSearchChange(searchValue, 'events')"
              >
                <template #list>
                  <div class="accordion accordion-flush">
                    <div
                      class="accordion-item"
                      v-for="(vEvent, vEventIndex) in vSearchEvents"
                      :key="vEventIndex"
                    >
                      <h2
                        class="accordion-header d-inline-flex w-100 justify-content-between align-items-center py-1"
                        :id="`collapse-panel-heading-${vEventIndex}`"
                      >
                        <span class="text-primary h6 mb-0">
                          {{ vEvent.name }}
                        </span>

                        <button
                          class="btn d-inline-flex justify-content-center align-items-center"
                          style="width: 36px; height: 36px"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="`#event-collapse-panel-${vEventIndex}`"
                          aria-expanded="true"
                          :aria-controls="`event-collapse-panel-${vEventIndex}`"
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
                        :id="`event-collapse-panel-${vEventIndex}`"
                        class="accordion-collapse collapse text-start show"
                        :aria-labelledby="`event-collapse-panel-heading-${vEventIndex}`"
                      >
                        <div class="d-flex flex-column gap-1 pb-3">
                          <span>{{ vEvent.description }}</span>
                          
                          <div class="" v-if="vEvent.syntax">
                            <span>Example:</span>
                            <CodeBlock :code="vEvent.syntax" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template #table>
                  <div class="props-table">
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
                        v-for="(vEvent, vEventIndex) in vSearchEvents"
                        :key="vEventIndex"
                      >
                        <div class="col">
                          <span class="text-start"
                            >{{ vEvent.name }}</span>
                        </div>

                        <div class="col">
                          <p class="prop-table-description">
                            {{ vEvent.description }}
                          </p>
                        </div>
                        <div class="col-1 d-flex justify-content-center">
                          <button
                            class="btn d-inline-flex justify-content-center align-items-center collapsed"
                            v-if="vEvent.syntax"
                            style="width: 36px; height: 36px"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#prop-${vEventIndex}-collapse`"
                            aria-expanded="false"
                            :aria-controls="`prop-${vEventIndex}-collapse`"
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
                          v-if="vEvent.syntax"
                          class="collapse text-start"
                          :id="`prop-${vEventIndex}-collapse`"
                        >
                          <span class="mb-0">Example:</span>
                          <CodeBlock :code="vEvent.syntax" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </PropSelector>
            </Section>

            <Section v-if="selectedTab?.exposes?.length" title="Exposes">
              <template #title>
                <a class="h5 d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#exposes" role="button" aria-expanded="false" aria-controls="exposes">
                  Exposes
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="chevron"
                    fill="currentColor"
                    stroke-width="0"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
                    />
                  </svg>
                </a>
              </template>

              <PropSelector
                input-id="exposes-input"
                class="my-3 collapse"
                id="exposes"
                @search="searchValue => onSearchChange(searchValue, 'exposes')"
              >
                <template #list>
                  <div class="accordion accordion-flush">
                    <div
                      class="accordion-item"
                      v-for="(vExpose, vExposeIndex) in vSearchExposes"
                      :key="vExposeIndex"
                    >
                      <h2
                        class="accordion-header d-inline-flex w-100 justify-content-between align-items-center py-1"
                        :id="`collapse-panel-heading-${vExposeIndex}`"
                      >
                        <span class="text-primary h6 mb-0">
                          {{ vExpose.name }}
                        </span>

                        <button
                          class="btn d-inline-flex justify-content-center align-items-center"
                          style="width: 36px; height: 36px"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="`#expose-collapse-panel-${vExposeIndex}`"
                          aria-expanded="true"
                          :aria-controls="`expose-collapse-panel-${vExposeIndex}`"
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
                        :id="`expose-collapse-panel-${vExposeIndex}`"
                        class="accordion-collapse collapse text-start show"
                        :aria-labelledby="`expose-collapse-panel-heading-${vExposeIndex}`"
                      >
                        <div class="d-flex flex-column gap-1 pb-3">
                          <span>{{ vExpose.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template #table>
                  <div class="props-table">
                    <div class="" role="rowheader">
                      <div class="row fw-bold">
                        <div class="col">Name</div>
                        <div class="col">Description</div>
                        <div class="col-1"></div>
                      </div>
                    </div>
                    <div class="" role="rowgroup">
                      <div
                        class="row"
                        role="row"
                        v-for="(vExpose, vExposeIndex) in vSearchExposes"
                        :key="vExposeIndex"
                      >
                        <div class="col">
                          <span class="text-start"
                            >{{ vExpose.name }}</span>
                        </div>

                        <div class="col">
                          <p class="prop-table-description">
                            {{ vExpose.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </PropSelector>
            </Section>

            <Section v-if="selectedTab?.slots?.length" title="Slots">
              <template #title>
                <a class="h5 d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#slots" role="button" aria-expanded="false" aria-controls="slots">
                  Slots
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="chevron"
                    fill="currentColor"
                    stroke-width="0"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
                    />
                  </svg>
                </a>
              </template>

              <PropSelector
                input-id="slots-input"
                class="my-3 collapse"
                id="slots"
                @search="searchValue => onSearchChange(searchValue, 'slots')"
              >
                <template #list>
                  <div class="accordion accordion-flush">
                    <div
                      class="accordion-item"
                      v-for="(vSlot, vSlotIndex) in vSearchSlots"
                      :key="vSlotIndex"
                    >
                      <h2
                        class="accordion-header d-inline-flex w-100 justify-content-between align-items-center py-1"
                        :id="`collapse-panel-heading-${vSlotIndex}`"
                      >
                        <span class="text-primary h6 mb-0">
                          {{ vSlot.name }}
                        </span>

                        <button
                          class="btn d-inline-flex justify-content-center align-items-center"
                          style="width: 36px; height: 36px"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="`#slot-collapse-panel-${vSlotIndex}`"
                          aria-expanded="true"
                          :aria-controls="`slot-collapse-panel-${vSlotIndex}`"
                          v-if="vSlot.template || vSlot.description"
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
                        :id="`slot-collapse-panel-${vSlotIndex}`"
                        class="accordion-collapse collapse text-start show"
                        :aria-labelledby="`slot-collapse-panel-heading-${vSlotIndex}`"
                        v-if="vSlot.template || vSlot.description"
                      >
                        <div class="d-flex flex-column gap-1 pb-3">
                          <span>{{ vSlot.description }}</span>

                          <div class="mt-3" v-if="vSlot.template">
                            <span>Example:</span>
                            <CodeBlock :code="`<template ${vSlot.template}></template>`" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template #table>
                  <div class="props-table">
                    <div class="" role="rowheader">
                      <div class="row fw-bold">
                        <div class="col">Name</div>
                        <div class="col">Description</div>
                        <div class="col-1"></div>
                      </div>
                    </div>
                    <div class="" role="rowgroup">
                      <div
                        class="row"
                        role="row"
                        v-for="(vSlot, vSlotIndex) in vSearchSlots"
                        :key="vSlotIndex"
                      >
                        <div class="col">
                          <span class="text-start"
                            >{{ vSlot.name }}</span>
                        </div>

                        <div class="col">
                          <p class="prop-table-description">
                            {{ vSlot.description }}
                          </p>
                        </div>
                        <div class="col-1 d-flex justify-content-center">
                          <button
                            class="btn d-inline-flex justify-content-center align-items-center collapsed"
                            v-if="vSlot.template"
                            style="width: 36px; height: 36px"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#slot-${vSlotIndex}-collapse`"
                            aria-expanded="false"
                            :aria-controls="`slot-${vSlotIndex}-collapse`"
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
                          v-if="vSlot.template"
                          class="collapse text-start"
                          :id="`slot-${vSlotIndex}-collapse`"
                        >
                          <span class="mb-0">Example:</span>
                          <CodeBlock :code="`<template ${vSlot.template}></template>`" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </PropSelector>
            </Section>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup lang="ts">
// TODO: adjust import for functions with import {}
// TODO: update lookup snippets
// TODO: make view for exposes, params, slots, props params
import components from "./assets/Components.json";
import { ref, onBeforeMount } from "vue";
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
  params?: Param[] | undefined;
}
interface Property {
  name: string;
  type?: string | undefined;
  default?: string | undefined;
  description?: string | undefined;
  required?: boolean | undefined;
  template?: string | undefined;
  example?: string | undefined;
  params?: Array<Partial<Param>> | undefined;
}
export type Tab = {
  id: number;
  name: string;
  description?: string;
  template?: string | undefined;
  example?: string | undefined;
  type: string;
  category: string;
  path: string;
  pathtype?: string;
  params?: Array<Partial<Param>>;
  slots?: Array<Partial<Slot>> | undefined;
  events?: Array<Partial<Event>> | undefined;
  props: Array<Partial<Property>>;
  snippets?: Array<Partial<Snippet>> | undefined;
  exposes?: Array<Partial<Expose>> | undefined;
};


const checkForDuplicates = (component: Tab): void => {
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
    ? findDuplicates(component?.snippets, "title")
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
      `Duplicate props found in component: ${component.name
      }\nDuplicate prop names: ${duplicateProps.join(", ")}`,
    );
  }

  if (duplicateSnippets.length > 0) {
    console.error(
      `Duplicate snippets found in component: ${component.name
      }\nDuplicate snippet names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateExposes.length > 0) {
    console.error(
      `Duplicate exposes found in component: ${component.name
      }\nDuplicate expose names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateSlots.length > 0) {
    console.error(
      `Duplicate slots found in component: ${component.name
      }\nDuplicate slot names: ${duplicateSlots.join(", ")}`,
    );
  }

  if (duplicateEvents.length > 0) {
    console.error(
      `Duplicate events found in component: ${component.name
      }\nDuplicate event names: ${duplicateEvents.join(", ")}`,
    );
  }

  if (duplicateParams.length > 0) {
    console.error(
      `Duplicate params found in component: ${component.name
      }\nDuplicate param names: ${duplicateParams.join(", ")}`,
    );
  }
}

const selectedTab_ID = ref(0);
const selectedTab = ref<Tab>();
const vSearchProps = ref<Tab["props"]>([]);
const vSearchSnippets = ref<Tab["snippets"]>([]);
const vSearchSlots = ref<Tab["slots"]>([]);
const vSearchEvents = ref<Tab["events"]>([]);
const vSearchParams = ref<Tab["params"]>([]);
const vSearchExposes = ref<Tab["exposes"]>([]);

const vTabs = ref<Partial<Tab[]>>([]);

const onSearchChange = (pSearchValue: string, pType: 'props' | 'events' | 'params' | 'slots' | 'exposes' | 'snippets') => {
  if (selectedTab?.value) {
    switch (pType) {
      case 'events':
        vSearchEvents.value = selectedTab.value.events?.filter((pEvent) =>
          pEvent.name?.toLowerCase().includes(pSearchValue.toLowerCase()),
        );
        break;
      case 'exposes':
        vSearchExposes.value = selectedTab.value.exposes?.filter((pExpose) =>
          pExpose.name?.toLowerCase().includes(pSearchValue.toLowerCase()),
        );
        break;
      case 'params':
        vSearchParams.value = selectedTab.value.params?.filter((pParam) =>
          pParam.name?.toLowerCase().includes(pSearchValue.toLowerCase()),
        );
        break;
      case 'props':
        vSearchProps.value = selectedTab.value.props?.filter((pProp) =>
          pProp.name?.toLowerCase().includes(pSearchValue.toLowerCase()),
        );
        break;
      case 'slots':
        vSearchSlots.value = selectedTab.value.slots?.filter((pSlot) =>
          pSlot.name?.toLowerCase().includes(pSearchValue.toLowerCase()),
        );
        break;
      case 'snippets':
        vSearchSnippets.value = selectedTab.value.snippets?.filter((pSnippet) =>
          pSnippet.title?.toLowerCase().includes(pSearchValue.toLowerCase()),
        );
        break;
    }
  }
};

const setSelectedTab = (pTab_ID: number) => {

  selectedTab_ID.value = pTab_ID;
  const vTab = vTabs.value.find((vTab) => vTab?.id === pTab_ID);

  if (vTab) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tab', vTab.name.toString());
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newUrl);


    selectedTab.value = vTab;

    vSearchProps.value = vTab.props || [];
    vSearchSnippets.value = vTab.snippets || [];
    vSearchSlots.value = vTab.slots || [];
    vSearchEvents.value = vTab.events || [];
    vSearchParams.value = vTab.params || [];
    vSearchExposes.value = vTab.exposes || [];
  }
};

const RefactorComponent = (component: Tab) => {
  return JSON.parse(JSON.stringify(component)
    .replace(/\{COMPONENT\}/g, component.name)
    .replace(/\{COMPONENT=(\d+)\}/g, (match, id) => {
      const referencedComponent = components.components.find(c => c.id === parseInt(id));
      return referencedComponent ? referencedComponent.name : match;
    }));
}


onBeforeMount(() => {
  const vComponents = components.components.map((pComponent) => {
    checkForDuplicates(pComponent as Tab);
    return RefactorComponent(pComponent as Tab);
  });
  vTabs.value = vComponents as Tab[];
});

const formatParams = (indentation: string = '\t'): string => {
    if (!selectedTab.value || !selectedTab.value.name || !selectedTab.value.params) return '';

    const indent = (level: number) => indentation.repeat(level);

    const formattedParams = selectedTab.value.params.map(pParam => {
        if (!pParam.params || pParam.params.length === 0) {
            return `${pParam.name}: ${pParam.type}`;
        } else {
            const nestedParams = pParam.params.map(ppParam => `${ppParam.name}: ${ppParam.type}`).join(',\n' + indent(2));
            return `${pParam.name}: ${pParam.type === 'Object' ? '{' : '['}\n${indent(2)}${nestedParams}\n${indent(1)}${pParam.type === 'Object' ? '}' : ']'}`;
        }
    }).join(',\n' + indent(1));

    return `${selectedTab.value.name}(\n${indent(1)}${formattedParams}\n)`;
}


</script>


<style scoped>
.docs-layout {
  display: grid;
  grid-template-areas: "sidebar main";
  grid-template-columns: 1fr 5fr;
  gap: 1rem;
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

:not(pre)>code {
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

.props-table> :not(caption)>* {
  border-bottom: var(--bs-border-width) solid rgba(0, 0, 0, 0.2);
  color: var(--bs-table-color-state,
      var(--bs-table-color-type, var(--bs-table-color)));
  background-color: var(--bs-table-bg);
}

.props-table> :not(caption)>*>* {
  padding: 0.5rem 0.5rem;
  box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
}

.btn svg,
svg.chevron {
  transition: 0.3s transform ease-in-out;
}

.btn.collapsed svg {
  transform: rotate(180deg);
}

[data-bs-toggle="collapse"][aria-expanded="true"] svg.chevron {
  transform: rotate(0deg);
}
[data-bs-toggle="collapse"][aria-expanded="false"] svg.chevron {
  transform: rotate(180deg);
}

</style>
