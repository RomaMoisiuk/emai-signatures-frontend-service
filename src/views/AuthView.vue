<script lang="ts" setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { useAuthStore } from '@/stores';
import { AuthType } from '@/types';
import { computed } from 'vue';
import router from '@/router';

const props = defineProps<{
  authType: AuthType;
}>()

const authStore = useAuthStore();
const user = computed(() => authStore.user);

if (user.value) {
  router.push('/')
}

const schema = Yup.object().shape({
  email: Yup.string().email('Please provide valid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

//@ts-ignore
const onSubmit = (values, { setErrors }) => {
  const { login, register } = authStore;
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
      <div v-if="errors.apiError" class="error">{{ errors.apiError }}</div>
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

.error {
  color: crimson;
}
</style>
