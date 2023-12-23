import axios, { AxiosResponse } from "axios";
import "dotenv/config";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const POSTER_URL =
  process.env.TMDB_POSTER_URL || "https://image.tmdb.org/t/p/w500";

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
  const {
    id,
    original_name,
    overview,
    first_air_date,
    genre_ids,
    original_language,
  } = tmdbTvShow;

  const mappedTvShow: ITvShow = {
    id: tmdbTvShow.id as number,
    title: tmdbTvShow.original_name as string,
    poster_path: String(POSTER_URL + tmdbTvShow.poster_path),
    overview: tmdbTvShow.overview as string,
    year: new Date(tmdbTvShow.first_air_date).getFullYear().toString(),
    genre_ids: tmdbTvShow.genre_ids as { id: number }[],
    language: tmdbTvShow.original_language as string,
  };

  return mappedTvShow;
}

export async function getTvShowById(tvShowId: number): Promise<ITvShow> {
  const url = `${BASE_URL}/tv/${tvShowId}`;
  const params = { api_key: API_KEY };
  const response = await axios.get(url, { params });
  const tvShow = mapToTvShow(response.data);
  return tvShow;
}

export async function searchTvShows(query: string, page: number =1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/search/tv`;
  const params = { api_key: API_KEY, query,page };
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
