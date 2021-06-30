import { SearchResult, SingleMovie } from '~/types/omdbapi';

const APIKEY = 'fa4205f4';

const API = `https://www.omdbapi.com/?apikey=${APIKEY}&`;

export const omdbApiSearch = async (term: string) => {
  try {
    const res = await fetch(`${API}s=${term}`);
    const json: SearchResult = await res.json();
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const omdbApiSingle = async (id: string) => {
  try {
    const res = await fetch(`${API}i=${id}&plot=full`);
    const json: SingleMovie = await res.json();
    if (json.Response === 'False') {
      return null;
    }
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
};
