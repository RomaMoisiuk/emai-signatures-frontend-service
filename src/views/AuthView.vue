<script lang="ts" setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { useAuthStore } from '@/stores';
import { AuthType } from '@/types';

const props = defineProps<{
  authType: AuthType;
}>()

const schema = Yup.object().shape({
  email: Yup.string().email('Please provide valid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

//@ts-ignore
const onSubmit = (values, { setErrors }) => {
  const { login, register } = useAuthStore();
  const { email, password } = values;

  if (props.authType === AuthType.login) {
    return login(email, password)
      .catch((error) => setErrors({ apiError: error }));
  }

  return register(email, password)
    .catch((error) => setErrors({ apiError: error }));
}
</script>

<template>
  <div>
    <div>
      <router-link class="nav-link" v-if="authType === AuthType.login" to="/register">{{ AuthType.register
      }}</router-link>
      <router-link class="nav-link" v-else to="/login">{{ AuthType.login }}</router-link>
    </div>
    <h2>{{ authType }}</h2>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <div class="form-group">
        <label>Email</label>
        <Field name="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <div class="form-group">
        <label>Password</label>
        <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="isSubmitting">
          <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
          {{ authType }}
        </button>
      </div>
      <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{ errors.apiError }}</div>
    </Form>
  </div>
</template>

<style>
.nav-link {
  cursor: pointer;
  padding: 10px;
}

.btn {
  cursor: pointer;
}
</style>
