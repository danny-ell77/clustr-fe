import { ref, computed } from "vue";
import type { ValidationRule, ValidationState } from "~/types/validation";
import { validateField } from "~/utils/validators";

export function useFieldValidation<T>(
  initialValue: T,
  rules: ValidationRule[] = []
) {
  const value = ref<T>(initialValue);
  const isDirty = ref(false);
  const isTouched = ref(false);
  const errors = ref<string[]>([]);

  // Core validation state
  const state = computed<ValidationState>(() => ({
    isValid: errors.value.length === 0,
    isDirty: isDirty.value,
    isTouched: isTouched.value,
    errors: errors.value,
  }));

  // Update and validate value
  const setValue = (newValue: any) => {
    value.value = newValue;
    isDirty.value = true;
    validate();
  };

  // Mark as touched (e.g. on blur)
  const setTouched = () => {
    isTouched.value = true;
    validate();
  };

  // Run validation
  const validate = () => {
    errors.value = validateField(value.value, rules);
    return errors.value.length === 0;
  };

  // Reset field state
  const reset = () => {
    value.value = initialValue;
    isDirty.value = false;
    isTouched.value = false;
    errors.value = [];
  };

  return {
    // Core state
    value: value.value as T,
    state: state.value,

    // Methods
    setValue,
    setTouched,
    validate,
    reset,

    // Individual state pieces if needed
    errors: computed(() => errors.value).value,
    isValid: computed(() => errors.value.length === 0).value,
    isDirty: computed(() => isDirty.value).value,
    isTouched: computed(() => isTouched.value).value,
  };
}
