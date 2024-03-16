<template>
  <div class="position-relative autocomplete d-flex flex-column">
    <div class="position-relative d-inline-flex align-items-center flex-wrap border border-secondary rounded-1 p-1" @mouseover="handleClearVisible" @mouseleave="handleMouseLeave">
      <div v-if="multiple" v-for="(selectedItem, index) in vSelectedItems" :key="index" class="badge rounded-pill d-inline-flex align-items-center text-bg-secondary">
        {{ getOptionLabel?.(selectedItem) || selectedItem[field] }}
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
        @keydown.enter.prevent="selectHighlightedItem"
        @keydown.delete="removeLastSelectedItem"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <button class="btn position-absolute end-0 px-2" v-show="vClearIsVisisble" @click="clearSelection">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
      </button>

      <button class="btn position-absolute start-100 px-2" @click="toggleOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
        </svg>
      </button>
    </div>
    
    <div v-show="vShowDropdown" class="list-group list-group-flush bg-body-secondary border border-secondary rounded-1 mt-1 overflow-auto shadow autocomplete-container">
      <button
        class="list-group-item list-group-item-action text-start"
        v-for="(item, index) in vFilteredOptions"
        :key="index"
        :class="{ 'list-group-item-light': index === vHighlightedIndex && !vSelectedItems.includes(item), 'list-group-item-primary': vSelectedItems.includes(item) }"
        @click="toggleSelectedItem(item)"
      >
        {{ getOptionLabel?.(item) || item[field] }}
      </button>
      <p class="list-group-item mb-0" v-if="vFilteredOptions.length == 0">No items found</p>
    </div>
  </div>
</template>
    
<script setup lang="ts">
import { useControlled } from '@/hooks/useControlled';
import { computed, nextTick, ref, onMounted, watch } from 'vue';

type DataObject = any;
type ItemModel = any;

 // TODO: implement
export type AutoCompleteProps = {
  modelValue?: any;
  value?: any;
  searchText?: string;
  defaultValue?: any;
  dataObject?: DataObject,
  getData?: () => Promise<ItemModel>
  getOptionLabel?: (pOption: Record<string, any>) => string;
  field: string;
  filterSelectedOptions?: boolean;
  filterOperator?: 'beginswith' | 'contains' | 'endswith';
  multiple?: boolean;
  freeSolo?: boolean
  clearOnBlur: boolean;
  open?: boolean;
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
  multiple: false,
  freeSolo: false,
  clearOnBlur: false,
})

const vInputRef = ref<HTMLInputElement>();

const vUserInput = ref<string>('')
const vClearIsVisisble = ref(false)
const vShowDropdown = ref(false)
const vIsFocused = ref(false);
const vSelectedItems = ref<Record<string, any>[]>([]);
const vOptions = ref<Record<string, any>[]>([]);
const vHighlightedIndex = ref<number>(-1);

const vEmit = defineEmits<{
  (e: 'update:modelValue', pValue: any): void;
  (e: 'enter:input', pEvent: KeyboardEvent, pValue: any): void;
  (e: 'blur:noSelection', pEvent: FocusEvent, pInputValue: any, pFocusedValue: any): void;
}>();


const [value, setValueState] = useControlled({
  controlled: vProps.value,
  default: vProps.multiple && Array.isArray(vProps.defaultValue) 
    ? vOptions.value.filter((option: any) => vProps.defaultValue.some((value: any) => value === option[vProps.field])) 
    : vOptions.value.find((option: any) => option[vProps.field] === vProps.defaultValue) || null,
  name: 'Autocomplete'
});

const [inputValue, setInputValueState] = useControlled({
  controlled: vProps.searchText,
  default: "",
  name: 'Search',
  state: 'inputValue'
});

const resetInputvalue = (event: any, newValue: any) => {
  const isOptionselected = vProps.multiple && Array.isArray(vProps.value)
    ? vProps.value.length < newValue.length
    : newValue !== null;

  if (isOptionselected && !vProps.clearOnBlur) {
    return;
  }

  let newInputValue;
  if (vProps.multiple || newValue == null) {
    newInputValue = '';
  } else {
    const optionLabel = vProps.getOptionLabel?.(newValue) || newValue[vProps.field];
    newInputValue = typeof optionLabel === 'string' ? optionLabel : '';
  }

  if (inputValue === newInputValue) {
    return;
  }

  setInputValueState(newInputValue);

  vEmit('update:modelValue', newInputValue);
};

// Watch for changes in inputValue and trigger onInputChange event if available
watch([inputValue], (newValue, oldValue) => {
  if (newValue !== oldValue) {
    vEmit('update:modelValue', newValue);
  }
});

const [open, setOpenState] = useControlled({
  controlled: vProps.open,
  default: false,
  state: 'open'
});

const inputValueIsSelectedValue = 
  !vProps.multiple &&
  !Array.isArray(value) &&
  value != null &&
  inputValue === (vProps.getOptionLabel?.(value) || value[vProps.field]) as string

const vInternalValue = computed({
  get() {
    return vIsFocused.value 
      ? typeof vUserInput.value === 'string' ? vUserInput.value : vUserInput.value[vProps.field]
      : vProps.modelValue ? vProps.modelValue[vProps.field] : vProps.value ? vProps.value[vProps.field] : ''
  },
  set(pValue: string) {
    

    vUserInput.value = typeof pValue === 'string' ? pValue : pValue[vProps.field];
    vEmit('update:modelValue', pValue);
  }
});

const vFilteredOptions = computed(() => {
  return vOptions.value.filter((item: Record<string, any>) => {
    switch (vProps.filterOperator) {
      case 'beginswith': 
        return item[vProps.field].toString().toLowerCase().startsWith(vUserInput.value?.toLowerCase())
      case 'contains': 
        return item[vProps.field].toString().toLowerCase().includes(vUserInput.value.toLowerCase())
      case 'endswith':
        return item[vProps.field].toString().toLowerCase().endsWith(vUserInput.value.toLowerCase())
    }
  });
});

onMounted(async () => {
  if (vProps?.getData) {
    const vResult = await vProps.getData();

    vOptions.value.splice(0, vOptions.value.length, ...vResult);
  }

  if (vProps.dataObject) {
    const vFilterItem = vProps.dataObject.filterObject.getItem(vProps.field);

    if (!vFilterItem) { 
      return console.warn(`Autocomplete: Could not get filter item for ${vProps.field}`);
    }

    if (vUserInput.value) {
      vFilterItem.selectedValue = vUserInput.value;
      vFilterItem.operator = vProps.filterOperator;

      await vProps.dataObject.filterObject.apply();

      vOptions.value.splice(0, 0, ...vProps.dataObject.data);
    } else {
      await vProps.dataObject.filterObject.clear();
    }
  }
});

watch(vIsFocused, () => {
  vClearIsVisisble.value = (vIsFocused.value && vSelectedItems.value.length > 0)
})


const handleFocus = () => {
  vIsFocused.value = true;
  vShowDropdown.value = true;

  console.log('focus')

  // vUserInput.value = vProps.modelValue ?? vProps.value ?? ""
}

const toggleOpen = () => {
  vShowDropdown.value = !vShowDropdown.value; 
}


const handleBlur = async (pEvent: FocusEvent) => {
  vIsFocused.value = false;

  await nextTick();

  console.log('blur')


  const vSkipClose = (pEvent?.relatedTarget as HTMLInputElement)?.closest('.autocomplete-container') != null;
  if (!vSkipClose && vSelectedItems.value.length === 0) {
    vEmit('blur:noSelection', pEvent, vInternalValue.value, vUserInput.value);
  }

  if (!vSkipClose && vShowDropdown.value && !vProps.disableCloseOnSelect) {
    vShowDropdown.value = false;
  }
}

const handleInput = async () => {
  vHighlightedIndex.value = vProps.autoHighlight ? 0 : -1;

  vIsFocused.value = true;
  vShowDropdown.value = true;
}

const toggleSelectedItem = (item: Record<string, any>) => {
  vInputRef.value?.focus();
  if (!vSelectedItems.value.includes(item)) {
    if (vProps.multiple) {
      vSelectedItems.value.push(item);
    } else {
      vSelectedItems.value = [item];
    }

    vEmit('update:modelValue', item);


    if (!vProps.disableCloseOnSelect) {
      window.requestAnimationFrame(() => {
        vShowDropdown.value = false;
          
        // vUserInput.value = vProps.multiple ? "" : vInternalValue.value;
      })
    }
  } else if (!vProps.multiple) {
    removeSelectedItem(vSelectedItems.value.indexOf(item));
  }
}

const selectHighlightedItem = (pEvent: KeyboardEvent) => {
  if (vHighlightedIndex.value !== -1) {
    toggleSelectedItem(vFilteredOptions.value[vHighlightedIndex.value]);

    vEmit('enter:input', pEvent, vInternalValue.value);

    if (!vProps.disableCloseOnSelect) {
      window.requestAnimationFrame(() => {
        vShowDropdown.value = false;
          
        vUserInput.value = vProps.multiple ? "" : vInternalValue.value;
      })
    }
  } else if (vProps.freeSolo) {
    let vFreeSoloObject = Object.create({});
    vFreeSoloObject[vProps.field] = vUserInput.value
    toggleSelectedItem(vFreeSoloObject);

    vOptions.value.splice(0, 0, vFreeSoloObject);
    
    if (!vProps.disableCloseOnSelect) {
      window.requestAnimationFrame(() => {
        vShowDropdown.value = false;
          
        // vUserInput.value = vProps.multiple ? "" : vInternalValue.value;
      })
    }
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
  if (vHighlightedIndex.value < vFilteredOptions.value.length - 1) {
    vHighlightedIndex.value++;
  }
}

const clearSelection = () => {
  vSelectedItems.value = [];

  vInternalValue.value = "";
}

const handleClearVisible = (pEvent: MouseEvent) => {
  if (vSelectedItems.value.length > 0) {
    vClearIsVisisble.value = true;
  }
}

const handleMouseLeave = (pEvent: MouseEvent) => {
  if (!vIsFocused.value) {
    vClearIsVisisble.value = false;
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