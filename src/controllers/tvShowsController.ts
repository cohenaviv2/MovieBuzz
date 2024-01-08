import axios, { AxiosResponse } from "axios";
import "dotenv/config";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;
const POSTER_URL = process.env.TMDB_POSTER_URL;

export interface ITvShow {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  year: string;
  genre_ids: { id: number }[];
  language: string;
}

function mapToTvShow(tmdbTvShow: any): ITvShow {
  const { id, original_name, poster_path, overview, first_air_date, genre_ids, original_language } = tmdbTvShow;

  const mappedTvShow: ITvShow = {
    id: id as number,
    title: original_name as string,
    poster_path: String(POSTER_URL + poster_path),
    overview: overview as string,
    year: new Date(first_air_date).getFullYear().toString(),
    genre_ids: genre_ids as { id: number }[],
    language: original_language as string,
  };

  return mappedTvShow;
}

export async function getTvShowById(tvShowId: number): Promise<ITvShow> {
  const url = `${BASE_URL}/tv/${tvShowId}`;
  const params = { api_key: API_KEY };
  const response = await axios.get(url, { params });
  ``;
  const tvShow = mapToTvShow(response.data);
  return tvShow;
}

export async function searchTvShows(query: string, page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/search/tv`;
  const params = { api_key: API_KEY, query, page };
  const response = await axios.get(url, { params });
  const mappedShows = response.data.results.map(mapToTvShow);
  return mappedShows;
}

export async function getPopularTvShows(page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/tv/popular`;
  const params = { api_key: API_KEY, page };
  const response = await axios.get(url, { params });
  const mappedShows = response.data.results.map(mapToTvShow);
  return mappedShows;
}

export async function getTopRatedTvShows(page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/tv/top_rated`;
  const params = { api_key: API_KEY, page };
  const response = await axios.get(url, { params });
  const mappedShows = response.data.results.map(mapToTvShow);
  return mappedShows;
}

export async function getOnAirTvShows(page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/tv/on_the_air`;
  const params = { api_key: API_KEY, page };
  const response = await axios.get(url, { params });
  const mappedShows = response.data.results.map(mapToTvShow);
  return mappedShows;
}

export async function getTvShowsByGenre(genreId: number): Promise<ITvShow[]> {
  const url = `${BASE_URL}/discover/tv`;
  const params = { api_key: API_KEY, with_genres: genreId };
  const response = await axios.get(url, {
    params,
  });
  const mappedShows = response.data.results.map(mapToTvShow);
  return mappedShows;
}
