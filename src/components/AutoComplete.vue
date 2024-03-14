<template>
  <div class="position-relative autocomplete d-flex flex-column">
    <div class="d-inline-flex align-items-center flex-wrap border border-secondary rounded-1 p-1">
      <div v-for="(selectedItem, index) in vSelectedItems" :key="index" class="badge rounded-pill d-inline-flex align-items-center text-bg-secondary">
        {{ selectedItem }}
        <button type="button" class="btn btn-sm p-0 text-bg-secondary" @click="removeSelectedItem(index)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </button>
      </div>
      <input
        type="text"
        class="border-transparent h-100 d-block border-0 flex-grow-1"
        style="box-sizing: content-box;"
        v-model="vInternalValue"
        ref="vInputRef"
        @input="handleInput"
        @keydown.down="highlightNext"
        @keydown.up="highlightPrevious"
        @keydown.enter="selectHighlightedItem"
        @keydown.delete="removeLastSelectedItem"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    
    <div v-if="vShowDropdown" class="list-group list-group-sm list-group-flush bg-body-secondary border border-secondary rounded-1 mt-1 overflow-auto shadow autocomplete-container">
      <button
        class="list-group-item list-group-item-action text-start"
        v-for="(item, index) in vFilteredOptions"
        :key="index"
        :class="{ 'list-group-item-light': index === vHighlightedIndex && !vSelectedItems.includes(item), 'list-group-item-primary': vSelectedItems.includes(item) }"
        @click="toggleSelectedItem(item)"
      >
        {{ item }}
      </button>
      <p class="list-group-item mb-0" v-if="vFilteredOptions.length == 0">No items found</p>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

type DataObject = any;
type ItemModel = any;

 // TODO: implement
export type AutoCompleteProps = {
  modelValue?: any;
  value?: any;
  dataObject?: DataObject,
  getData?: (pValue: string) => Promise<ItemModel>
  getOptionLabel?: (pOption: string) => string;
  field: string;
  filterSelectedOptions?: boolean;
  filterOperator?: 'beginswith' | 'contains' | 'endswith';
  multiple?: boolean;
  freeSolo?: boolean
  disableCloseOnSelect?: boolean;
  /**
   * The first option is automatically highlighted
   */
  autoHighlight?: boolean;
}

const vProps = withDefaults(defineProps<AutoCompleteProps>(), {
  filterOperator: 'beginswith',
  disableCloseOnSelect: false,
  value: null,
  modelValue: null,
  field: ''
})

const vInputRef = ref<HTMLInputElement>();

const vUserInput = ref('')
const vShowDropdown = ref(false)
const vIsFocused = ref(false);
let items: any = ["test", "test1", "test2", "test3"];
let filteredItems: any = [];
const vSelectedItems = ref<string[]>([]);
const vHighlightedIndex = ref<number>(-1)

const vEmit = defineEmits<{
  (e: 'update:modelValue', pValue: any): void;
  (e: 'enter:input', pEvent: KeyboardEvent, pValue: any): void;
  (e: 'blur:noSelection', pEvent: FocusEvent, pInputValue: any, pFocusedValue: any): void;
}>();

const vInternalValue = computed({
  get() {
    return vIsFocused.value 
      ? vUserInput.value
      : vProps.modelValue ?? vProps.value
  },
  set(pValue) {
    vUserInput.value = pValue;
    vEmit('update:modelValue', pValue);
  }
});

const vFilteredOptions = computed(() => {
  return items.filter((item: string) => {
    return item.toLowerCase().includes(vUserInput.value.toLowerCase())
  });
});

const handleFocus = () => {
  vIsFocused.value = true;
  vShowDropdown.value = true;
}

const handleBlur = async (pEvent: FocusEvent) => {
  vIsFocused.value = false;

  await nextTick();

  const vSkipClose = (pEvent?.relatedTarget as HTMLInputElement)?.closest('.autocomplete-container') != null;
  if (!vSkipClose && vSelectedItems.value.length === 0) {
    vEmit('blur:noSelection', pEvent, vInternalValue.value, vUserInput.value);
  }

  if (!vSkipClose && vShowDropdown.value && !vProps.disableCloseOnSelect) {
    vShowDropdown.value = false;
  }
}

const handleInput = () => {
  vShowDropdown.value = true;
  vHighlightedIndex.value = vProps.autoHighlight ? 0 : -1;
}


const toggleSelectedItem = (item: string) => {
  if (!vSelectedItems.value.includes(item)) {
    vSelectedItems.value.push(item);
    vUserInput.value = "";

    vInputRef.value?.focus();

    if (!vProps.disableCloseOnSelect) {
      vShowDropdown.value = false;
    }
  } else if (!vProps.multiple) {
    removeSelectedItem(vSelectedItems.value.indexOf(item));
  }
}
const selectHighlightedItem = () => {
  if (vHighlightedIndex.value !== -1) {
    toggleSelectedItem(filteredItems[vHighlightedIndex.value]);
    vUserInput.value = "";
    vShowDropdown.value = false;
  }
}
const removeLastSelectedItem = () => {
  if (vUserInput.value === "" && vSelectedItems.value.length > 0) {
    vSelectedItems.value.pop();
  }
}
const removeSelectedItem = (index: number) => {
  vSelectedItems.value.splice(index, 1);
}

const highlightPrevious = () => {
  if (vHighlightedIndex.value > 0) {
    vHighlightedIndex.value--;
  }
}
const highlightNext = () => {
  console.log(vHighlightedIndex.value)
  if (vHighlightedIndex.value < filteredItems.length - 1) {
    vHighlightedIndex.value++;
  }
}

    
</script>
    
    
<style scoped>
input {
  appearance: none !important;
  -moz-appearance: none !important;
  -webkit-appearance: none !important;
  outline: none;
}
.autocomplete {
  width: 600px; /* adjust width as needed */
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.selected-item {

  padding: 2px 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
}

.selected-item span {
  margin-left: 5px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  border: 1px solid #ccc;
  background-color: #fff;
}

.dropdown div {
  padding: 5px;
  cursor: pointer;
}

.highlighted {
  background-color: #f0f0f0;
}
</style>