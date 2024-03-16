import { ref, computed, onMounted, onBeforeUnmount, type ComputedRef, type Ref } from "vue";

type UseControlledOptions<T> = {
    controlled?: T | undefined;
    default?: T;
    name?: string;
    state?: string;
};
  
type UseControlledReturnValue<T> = [ComputedRef<T>, (newValue: T) => void];

export const useControlled = <T extends unknown>({
    controlled,
    default: defaultProp,
    name = "",
    state = "value"
}: UseControlledOptions<T>): UseControlledReturnValue<T> => {
    const isControlled: Ref<boolean> = ref(controlled !== undefined);
    const valueState: Ref<T | unknown> = ref(defaultProp);
    const value: ComputedRef<T> = computed(() => isControlled.value ? controlled as T : valueState.value as T);


    const setValueIfUncontrolled = (newValue: T) => {
        if (!isControlled.value) {
            valueState.value = newValue;
        }
    };
    
    return [value, setValueIfUncontrolled];
}