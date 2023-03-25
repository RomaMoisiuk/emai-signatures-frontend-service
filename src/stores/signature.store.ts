import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import type { Template } from '@/types';


const baseUrl = `${import.meta.env.VITE_SIGNATURES_API_URL}`;

export const useSignatureStore = defineStore({
  id: 'signature',
  state: () => ({
    signature: {
      html: '',
      error: null as any,
    },
    formData: {
      fullName: '',
      company: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      template: null as Template | null,
      error: null as any,
    },
  }),
  actions: {
    async getSignature() {
      try {
        const signature = await fetchWrapper.get(`${baseUrl}/signatures`);
        this.signature = { ...this.signature, ...signature };
      } catch (error) {
        this.signature.error = error;
        this.formData.error = error;
      }
    },
    async setSignature() {
      try {
        const signature = await fetchWrapper.post(`${baseUrl}/signatures`);
        this.signature = { ...this.signature, ...signature };
      } catch (error) {
        this.signature.error = error;
      }
    },
    async getFormData() {
      try {
        const formData = await fetchWrapper.get(`${baseUrl}/user-data`);
        this.formData = { ...this.formData, ...formData };
      } catch (error) {
        this.formData.error = error;
      }
    },
    async setFormData(data: any) {
      try {
        const formData = await fetchWrapper.post(`${baseUrl}/user-data`, data);
        this.formData = { ...this.formData, ...formData };
        setTimeout(async () => await this.setSignature(), 100);
      } catch (error) {
        this.formData.error = error;
      }
    },
  }
});