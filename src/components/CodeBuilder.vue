<template>
  <div class="rounded border">
    <div class="row h-100 overflow-hidden" style="height: 300px;">
      <div class="col pe-0 flex-grow-1 h-100 overflow-y-auto">
        <CodeBlock style="height: 300px" language="html" filename="test.js" :code="vGeneratedCode">
          <template #toolbar>
            <div class="dropdown" v-if="component.codebuilder_shortcuts" data-bs-theme="dark">
              <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Shortcuts
              </button>
              <ul class="dropdown-menu">
                <template v-for="(vShortcut) in component.codebuilder_shortcuts">
                  <li>
                    <button type="button" class="dropdown-item">
                      <span v-for="(vKey, vKeyIndex) in vShortcut.keys">
                        <kbd class="text-capitalize">{{ vKey }}</kbd>
                        <span v-if="vKeyIndex !== vShortcut.keys.length -1"> + </span>
                      </span>
                      <span> = new <strong>{{ Components.find(({ id }) => id === vShortcut.component_id)?.name }}</strong></span>
                    </button>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                </template>
              </ul>
            </div>
          </template>
        </CodeBlock>
      </div>
      <div class="col-4 ps-0">
        <div class="accordion overflow-y-auto accordion-flush" id="codebuilder" style="
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          max-height: 300px;
        ">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProps" aria-expanded="true" aria-controls="collapseProps">
                Props
              </button>
            </h2>
            <div id="collapseProps" class="accordion-collapse collapse show" data-bs-parent="#codebuilder">
              <ul
              class="list-group rounded-0 text-start rounded-start-none overflow-x-hidden"
            >
              <li
                class="list-group-item d-flex align-items-center"
                v-for="(
                  {
                    name,
                    description,
                    example,
                    type,
                    default: defaultValue,
                    ...other
                  },
                  vIndex
                ) in vSelectableProps"
                :key="vIndex"
              >
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  :value="name"
                  @change="
                    toggleSelection('props', {
                      name,
                      description,
                      type,
                      example,
                      default: defaultValue,
                      ...other,
                    })
                  "
                  :id="`checkbox-props-${name}`"
                />
                <label
                  class="form-check-label flex-grow-1"
                  :for="`checkbox-props-${name}`"
                  >{{ name }}</label
                >
              </li>
            </ul>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSlots" aria-expanded="false" aria-controls="collapseSlots">
                Slots
              </button>
            </h2>
            <div id="collapseSlots" class="accordion-collapse collapse" data-bs-parent="#codebuilder">
              <ul
                class="list-group rounded-0 text-start rounded-start-none overflow-x-hidden"
              >
                <li
                  class="list-group-item d-flex align-items-center"
                  v-for="(
                    {
                      name,
                      description,
                      template,
                    },
                    vIndex
                  ) in vSelectableSlots"
                  :key="vIndex"
                >
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    :value="name"
                    @change="
                      toggleSelection('slots', {
                        name,
                        description,
                        template
                      })
                    "
                    :id="`checkbox-slot-${name}`"
                  />
                  <label
                    class="form-check-label flex-grow-1"
                    :for="`checkbox-slot-${name}`"
                    >{{ name }}</label
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEvents" aria-expanded="false" aria-controls="collapseEvents">
                Events
              </button>
            </h2>
            <div id="collapseEvents" class="accordion-collapse collapse" data-bs-parent="#codebuilder">
              <ul
                class="list-group rounded-0 text-start rounded-start-none overflow-x-hidden"
              >
                <li
                  class="list-group-item d-flex align-items-center"
                  v-for="(
                    {
                      name,
                      description,
                      syntax
                    },
                    vIndex
                  ) in vSelectableEvents"
                  :key="vIndex"
                >
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    :value="name"
                    @change="
                      toggleSelection('events', {
                        name,
                        description,
                        syntax
                      })
                    "
                    :id="`checkbox-events-${name}`"
                  />
                  <label
                    class="form-check-label flex-grow-1"
                    :for="`checkbox-events-${name}`"
                    >{{ name }}</label
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onBeforeUnmount } from "vue";
import CodeBlock from "./CodeBlock.vue";
import Components, { type Tab, type CodeBuilderShortcuts } from "@/components";

// TODO: fix code rerendering on tab change
/**
 * Converts array type to single type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const vProps = defineProps<{
  component: NonNullable<Tab>;
}>();

const vSelectableProps = ref<Tab["props"]>([]);
const vSelectableSlots = ref<Tab["slots"]>([]);
const vSelectableEvents = ref<Tab["events"]>([]);
const vSelectedElements = ref<Array<any>>([]);
const vGeneratedCode = ref<string>("");

const toggleSelection = (pType: 'slots' | 'props' | 'events', pElement: ArrayElement<NonNullable<Tab["props"]>> | ArrayElement<NonNullable<Tab["slots"]>> | ArrayElement<NonNullable<Tab["events"]>>) => {
  const vElementIndex = vSelectedElements.value.findIndex(pSelectedElement => pSelectedElement.name === pElement.name);
  if (vElementIndex !== -1) {
    vSelectedElements.value.splice(vElementIndex, 1); // Remove prop if already selected
  } else {
    vSelectedElements.value.push({
      elementType: pType,
      ...pElement
    }); // Add prop if not selected
  }
};

watch(() => vProps.component.id, () => {
  vSelectedElements.value = [];

  const vIsComponent = vProps.component.type === 'Component';
  
  vSelectableProps.value = vIsComponent
                    ? vProps.component.props 
                    : vProps.component.params || []
  vSelectableSlots.value = vProps.component.slots;
  vSelectableEvents.value = vProps.component.events;
}, { deep: true });


const handleShortCut = (pEvent: KeyboardEvent) => {
  vProps.component.codebuilder_shortcuts?.forEach((vShortcut) => {
    const vCriteria: boolean[] = vShortcut.keys.map((vKey) => {
      if (vKey === 'alt') {
        return pEvent.altKey;
      } else {
        return pEvent.key === vKey.toLowerCase();
      }
    });

    if (vCriteria.every((pCriteria) => pCriteria === true)) {
      const vComponent = Components.find((pComponent) => pComponent.id === vShortcut.component_id);
      const vProps = vShortcut.props?.map((pPropName) => {
        const vProp = vComponent?.props.find((pProp) => pProp.name === pPropName);

        return `${pPropName}${vProp?.type !== 'Boolean' ? '=""' : ''}`
      })
      vSelectedElements.value.push({
        elementType: 'nodes',
        element: `<${vComponent?.name} ${vProps?.join(' ')} />`
      })
    }
  })
}


watch(() => vSelectedElements, () => {
  const vSelectedProps: NonNullable<Tab["props"]> = vSelectedElements.value.filter(pElement => pElement.elementType === 'props').sort((a,b) => (a?.name || "").localeCompare(b.name || "")) || [];
  const vSelectedSlots: NonNullable<Tab["slots"]> = vSelectedElements.value.filter(pElement => pElement.elementType === 'slots').sort((a,b) => (a?.name || "").localeCompare(b.name || "")) || [];
  const vSelectedEvents: NonNullable<Tab["events"]> = vSelectedElements.value.filter(pElement => pElement.elementType === 'events').sort((a,b) => (a?.name || "").localeCompare(b.name || "")) || [];
  const vSelectedNodes: string[] = vSelectedElements.value.filter(pElement => pElement.elementType === 'nodes').map(pNode => pNode.element) || [];
  
  vGeneratedCode.value = `<${vProps.component.name}\n${vSelectedProps.map((prop) => ` ${prop.type === 'Boolean' && (prop.default?.toLowerCase() === 'true' || prop.default?.toLowerCase() === 'false') ? ':' : ''}${prop.name}="${prop.default !== "null" ? prop.default : ""}"`).join(" ")} ${vSelectedEvents.map((pEvent) => pEvent.syntax).join(' ')} ${vSelectedSlots.length > 0 || vSelectedNodes.length > 0 ? `>${vSelectedSlots.map((pSlot) => `<template ${pSlot.template}></template>`).join('')}${vSelectedNodes.join(' ')}</${vProps.component.name}>` : ' />'}`;
}, { deep: true });

onMounted(() => {
  vSelectedElements.value = [];

  vSelectableProps.value = vProps.component.type === 'Component' 
                    ? vProps.component.props 
                    : []
  
  vSelectableSlots.value = vProps.component.slots;
  vSelectableEvents.value = vProps.component.events;

  if ((vProps.component.codebuilder_shortcuts || []).length > 0) {
    document.addEventListener('keyup', handleShortCut);
  }
});

onBeforeUnmount(() => {
  if ((vProps.component.codebuilder_shortcuts || []).length > 0) {
    document.removeEventListener('keyup', handleShortCut)
  }
})
</script>

<style scoped></style>
