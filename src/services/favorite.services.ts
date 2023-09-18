import axios, { AxiosResponse } from 'axios';
import { loadAbort } from '../utilities';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface FavoriteData {
  name: string;
  picture: string;
  professionalHeadline: string;
  username: string;
  verified: boolean;
}

export const GetFavorites = (
  authToken: string,
  currentPage: number,
  pageSize: number
) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.get(
        `${API_URL}/api/favorites/getFavorites?page=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          signal: controller.signal,
        }
      );
    },
    controller,
  };
};

export const AddFavorite = (authToken: string, favoriteData: FavoriteData) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.post(
        `${API_URL}/api/favorites/addFavorite`,
        favoriteData,
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

export const RemoveFavorite = (authToken: string, favoriteId: string) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      return await axios.post(
        `${API_URL}/api/favorites/removeFavorite/${favoriteId}`,
        null,
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
