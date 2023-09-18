import axios, { AxiosResponse } from 'axios';
import { UserForm } from '../interfaces/user.interface';
import { loadAbort } from '../utilities';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const UserRegister = (userForm: UserForm) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.post(`${API_URL}/api/users/register`, userForm, {
        signal: controller.signal,
      });
    },
  };
};

export const UserSignIn = (userForm: UserForm) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.post(`${API_URL}/api/users/login`, userForm, {
        signal: controller.signal,
      });
    },
  };
};

export const SaveQueries = (
  authToken: string,
  searchQuery: string,
  UID: string
) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.post(
        `${API_URL}/api/users/search/save`,
        { searchQuery, UID },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        }
      );
    },
  };
};

export const GetQueries = (authToken: string) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.get(`${API_URL}/api/users/search/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        signal: controller.signal,
      });
    },
    controller,
  };
};
