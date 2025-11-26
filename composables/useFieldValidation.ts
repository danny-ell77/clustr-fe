import { ref, computed, watch } from "vue";
import type { ValidationRule } from "~/types/validation";
import { validateField } from "~/utils/validators";

export function useFieldValidation<T>(
  initialValue: T,
  rules: ValidationRule[] = []
) {
  const value = ref<T>(initialValue);
  const isDirty = ref(false);
  const isTouched = ref(false);
  const errors = ref<string[]>([]);

  const validate = () => {
    errors.value = validateField(value.value, rules);
    return errors.value.length === 0;
  };

  const isValid = computed(() => errors.value.length === 0);

  watch(value, () => {
    isDirty.value = true;
    validate();
  }, { immediate: true });

  const setValue = (newValue: any) => {
    value.value = newValue;
  };

  const setTouched = () => {
    isTouched.value = true;
    validate();
  };

  const reset = () => {
    value.value = initialValue;
    isDirty.value = false;
    isTouched.value = false;
    errors.value = [];
  };

  validate();

  return {
    value,
    errors,
    isValid,
    isDirty,
    isTouched,
    setValue,
    setTouched,
    validate,
    reset,
  };
}
