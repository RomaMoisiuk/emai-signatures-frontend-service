import { useAuthStore } from '@/stores';

const request: any = (method: typeof fetchWrapper) => {
  return (url: string, body = undefined as Record<any, any> | undefined) => {
    const requestOptions: any = {
      method,
      headers: authHeader(url),
    };

    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }

    return fetch(url, requestOptions).then(handleResponse);
  }
}

const authHeader = (url: string) => {
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.access_token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_USERS_API_URL) || url.startsWith(import.meta.env.VITE_SIGNATURES_API_URL);

  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.access_token}` };
  } else {
    return {};
  }
}

const handleResponse = (response: any) => {
  return response.text().then((text = undefined as string | undefined) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const { user, logout } = useAuthStore();

      if ([401, 403].includes(response.status) && user) {
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
};
