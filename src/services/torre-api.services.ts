import axios, { AxiosResponse } from 'axios';
import { loadAbort } from '../utilities';

const TORRE_URL = `${process.env.NEXT_PUBLIC_TORRE_URL}`;

interface NameSuggestionsData {
  query: string;
  offset: number;
  limit: number;
}

export const UserSearchs = (
  authToken: string,
  query: string,
  offset: number,
  pageSize: number
) => {
  const controller = loadAbort();

  return {
    call: async (): Promise<AxiosResponse> => {
      const nameSuggestionsData: NameSuggestionsData = {
        query,
        offset,
        limit: pageSize,
      };

      return await axios.get(`${TORRE_URL}/api/suite/people/name-suggestions`, {
        params: nameSuggestionsData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        signal: controller.signal,
      });
    },
    controller,
  };
};
