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
      const signature = await fetchWrapper.post(`${baseUrl}/signatures`);
      this.signature = { ...this.signature, ...signature };
    },
    async getFormData() {
      const formData = await fetchWrapper.get(`${baseUrl}/user-data`);
      this.formData = { ...this.formData, ...formData };
    },
    async setFormData(data: any) {
      const formData = await fetchWrapper.post(`${baseUrl}/user-data`, data);
      this.formData = { ...this.formData, ...formData };
      setTimeout(async () => await this.setSignature(), 200);
    },
  }
});