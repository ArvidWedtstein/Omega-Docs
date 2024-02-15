<template>
  <div class="rounded border">
    <div class="row h-100">
      <div class="col-auto pe-0 flex-grow-1 h-100">
        <CodeBlock>
          <template #code>
            <pre
              class="mb-0"
              style="margin-top: 0;"
            ><code contenteditable="true" class="language-html" tabindex="0" spellcheck="false">{{ generateCode }}</code></pre>
          </template>
        </CodeBlock>
      </div>
      <div class="col-4 ps-0">
        <ul
          v-if="tab"
          class="overflow-y-auto list-group text-start rounded-start-none"
          style="
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            max-height: 300px;
          "
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
            ) in tab.props || []"
            :key="vIndex"
          >
            <input
              class="form-check-input me-2"
              type="checkbox"
              :value="name"
              @change="
                checkProp({
                  name,
                  description,
                  type,
                  example,
                  default: defaultValue,
                  ...other,
                })
              "
              :id="`checkbox-${name}`"
            />
            <label
              class="form-check-label flex-grow-1"
              :for="`checkbox-${name}`"
              >{{ name }}</label
            >
            <button
              class="btn btn-sm btn-outline-secondary align-self-end"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="20"
                fill="currenntColor"
              >
                <path
                  d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CodeBlock from "./CodeBlock.vue";
import type { Tab } from "@/App.vue";

/**
 * Converts array type to single type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const { tab } = defineProps<{
  tab: NonNullable<Tab>;
}>();

const vSelectedProps = ref<NonNullable<Tab["props"]>>([]);

const checkProp = (pProp: ArrayElement<NonNullable<Tab["props"]>>) => {
  if (vSelectedProps.value?.some(({ name }) => name === pProp.name)) {
    vSelectedProps.value = vSelectedProps.value.filter(
      ({ name }) => name !== pProp.name,
    );
  } else {
    vSelectedProps.value?.push(pProp);
  }
};

const generateCode = computed(() => {
  if (!tab || !vSelectedProps.value) return "";
  return `<${tab.name}
${vSelectedProps.value
  .map(
    (prop) => `  ${prop.name}="${prop.default !== "null" ? prop.default : ""}"`,
  )
  .join("\n")}
/>`;
});
</script>

<style scoped></style>
