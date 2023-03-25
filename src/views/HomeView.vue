<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { computed, onMounted } from 'vue';

import { useSignatureStore } from '@/stores';

const templates = [
  { id: 1, name: 'first', layout: '' },
  { id: 2, name: 'second', layout: '' },
]

const signatureStore = useSignatureStore();
const { setFormData, getFormData, getSignature } = signatureStore;

onMounted(async () => {
  await getFormData();
  await getSignature();
});

const formData = computed(() => signatureStore.formData);
const signature = computed(() => signatureStore.signature);
const template = computed(() => formData.value.template?.templateId || null);

const onSubmit = (values: any, { setErrors }: any) => {
  const { fullName, company, title, email, phone, address, template } = values;

  return setFormData({ fullName, company, title, email, phone, address, template })
    .catch((error) => setErrors({ apiError: error }));
}

const schema = Yup.object().shape({
  email: Yup.string().email('Please provide valid email').required('Email is required'),
  fullName: Yup.string().required('Full name is required'),
  company: Yup.string().required('Company is required'),
  title: Yup.string().required('Title is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  template: Yup.number().required('Layout is required'),
});
</script>

<template>
  <main>
    <h2>Your Data</h2>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <div class="form-group">
        <label>Full Name</label>
        <Field name="fullName" type="text" v-model="formData.fullName" class="form-control"
          :class="{ 'is-invalid': errors.fullName }" />
        <div class="invalid-feedback">{{ errors.fullName }}</div>
      </div>
      <div class="form-group">
        <label>Email</label>
        <Field name="email" type="text" v-model="formData.email" class="form-control"
          :class="{ 'is-invalid': errors.email }" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <div class="form-group">
        <label>Company</label>
        <Field name="company" type="text" v-model="formData.company" class="form-control"
          :class="{ 'is-invalid': errors.company }" />
        <div class="invalid-feedback">{{ errors.company }}</div>
      </div>
      <div class="form-group">
        <label>Title</label>
        <Field name="title" type="text" v-model="formData.title" class="form-control"
          :class="{ 'is-invalid': errors.title }" />
        <div class="invalid-feedback">{{ errors.title }}</div>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <Field name="phone" type="text" v-model="formData.phone" class="form-control"
          :class="{ 'is-invalid': errors.phone }" />
        <div class="invalid-feedback">{{ errors.phone }}</div>
      </div>
      <div class="form-group">
        <label>Address</label>
        <Field name="address" type="text" v-model="formData.address" class="form-control"
          :class="{ 'is-invalid': errors.address }" />
        <div class="invalid-feedback">{{ errors.address }}</div>
      </div>
      <div class="form-group">
        <label>Layout</label>
        <Field name="template" as="select" v-model="template" class="form-control"
          :class="{ 'is-invalid': errors.templateId }">
          <option value="" disabled>Select a layout</option>
          <option v-for="temp in templates" :key="temp.name" :value="temp.id"
            :selected="temp.name.includes(formData.template?.name || '')">{{ temp.name }}</option>
        </Field>
        <div class="invalid-feedback">{{ errors.templateId }}</div>
      </div>
      <div class="form-group">
        <button class="btn" :disabled="isSubmitting || Object.keys(errors).length > 0">
          <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
          Submit
        </button>
      </div>
      <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{ errors.apiError }}</div>
    </Form>
    <div v-if="signature.html" class="signature-container">
      <h3>Your Signature</h3>
      <div class="signature" v-html="signature.html"></div>
    </div>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  place-items: center;
}

.invalid-feedback {
  color: crimson;
}

.form-group {
  padding: 5px;
  font-size: medium;
}

.form-group>label {
  display: block;
}

.form-group input {
  height: 30px;
  width: 256px;
  border-radius: 10px;
}

.btn {
  padding: 15px 40px;
}

.signature-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  place-items: center;
}

.signature {
  border: grey 1px solid;
  padding: 15px;
}
</style>
