<template>
  <div class="space-y-4">
    <Input
      v-model="email.value"
      placeholder="Email"
      :error="email.state.errors[0]"
      :touched="email.state.isTouched"
      @blur="email.setTouched()"
    />
    
    <Input
      v-model="password.value"
      type="password"
      placeholder="Password"
      :error="password.state.errors[0]"
      :touched="password.state.isTouched"
      @blur="password.setTouched()"
    />
  </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input';
import { useFieldValidation } from '~/composables/useFieldValidation';
import { rules } from '~/utils/validators';

// Email field with validation
const email = useFieldValidation('', [
  rules.required('Email is required'),
  rules.email('Please enter a valid email address')
]);

// Password field with validation
const password = useFieldValidation('', [
  rules.required('Password is required'),
  rules.password()
]);
</script>