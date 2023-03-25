import { defineStore, getActivePinia } from 'pinia';
import type { Pinia, Store } from 'pinia';

import { fetchWrapper } from '@/helpers';
import router from '@/router';
import type { AuthData } from '@/types';

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>;
}
export const $ResetPinia = () => {
  const pinia = getActivePinia() as ExtendedPinia;

  if (!pinia) {
    return
  }

  const resetStores: Record<string, () => void> = {};

  pinia._s.forEach((store, name) => {
    resetStores[name] = () => store.$reset();
  });

  resetStores.all = () => pinia._s.forEach((store) => store.$reset());
  return resetStores;
};

const baseUrl = `${import.meta.env.VITE_USERS_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')) as AuthData | null,
    returnUrl: null
  }),
  actions: {
    async register(email: string, password: string) {
      await fetchWrapper.post(`${baseUrl}/auth/register`, { email, password });
      router.push('/login');
    },
    async login(email: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/auth/login`, { email, password });
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      $ResetPinia()?.all();
      router.push('/login');
    }
  }
});
