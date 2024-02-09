<template>
  <div class="rounded border">
    <div class="row">
      <div class="col-auto flex-grow-1">
        <CodeBlock>
          <template #code>
            <pre
              class="mb-0"
            ><code contenteditable="false" tabindex="0" spellcheck="false">{{ `<${tab.title}

/>` }}</code></pre>
          </template>
        </CodeBlock>
      </div>
      <div class="col-4">
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
            class="list-group-item"
            v-for="(
              { name, description, example, type, default: defaultValue },
              vIndex
            ) in tab.props || []"
          >
            <input
              class="form-check-input me-1"
              type="checkbox"
              value=""
              :id="`checkbox-${name}`"
            />
            <label
              class="form-check-label stretched-link"
              :for="`checkbox-${name}`"
              >{{ name }}</label
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CodeBlock from "./CodeBlock.vue";

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

const { tab } = defineProps<{
  tab: Tab;
}>();

const vSelectedProps = ref([]);
</script>

<style scoped></style>
