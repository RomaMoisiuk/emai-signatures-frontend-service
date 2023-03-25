interface Template {
  templateId: number;
  name: string;
  layout: string;
}

interface UserData {
  fullName: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  template: Template;
}

interface UserCreds {
  email: string;
  password: string;
}

interface AuthData {
  email: string;
  access_token: string;
}

enum AuthType {
  login = 'Login',
  register = 'Register',
}

export { AuthType };
export type { UserData, UserCreds, Template, AuthData };
