export interface User {
  username: string;
  name: string;
  picture: string;
  professionalHeadline: string;
  verified: boolean;
  isUserInFavorites: boolean;
  favoriteId: string | null;
}

export interface UserForm {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
}

export interface SearchQuery {
  query: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignInErrors {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}
