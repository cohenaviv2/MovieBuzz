import axios, { AxiosResponse } from "axios";
import "dotenv/config";
import { fetchMultiplePages } from "./MovieController";

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

export interface ITvShowDetails extends ITvShow {
  backdrop_path?: string;
  created_by?: string;
  production_company?: string;
  logo_path?: string;
  seasons?: ITvShowSeason[];
}

interface ITvShowSeason {
  id: number;
  air_date: string;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

function mapToTvShow(tmdbTvShow: any): ITvShow {
  const { id, original_name, overview, first_air_date, genre_ids, original_language } = tmdbTvShow;

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

function mapToTvShowSeason(tmdbSeason: any): ITvShowSeason {
  return {
    id: tmdbSeason.id,
    air_date: tmdbSeason.air_date,
    episode_count: tmdbSeason.episode_count,
    name: tmdbSeason.name,
    overview: tmdbSeason.overview,
    poster_path: String(POSTER_URL + tmdbSeason.poster_path),
    season_number: tmdbSeason.season_number,
  };
}

export async function getTvShowById(tvShowId: number): Promise<ITvShowDetails> {
  const url = `${BASE_URL}/tv/${tvShowId}`;
  const params = { api_key: API_KEY };
  const response = await axios.get(url, { params });
  const showData = response.data;
  const tvShowDetails: ITvShowDetails = mapToTvShow(showData);
  tvShowDetails.genre_ids = showData.genres.map((genre:any)=>genre.name)
  tvShowDetails.backdrop_path = String(POSTER_URL + showData.backdrop_path);
  tvShowDetails.created_by = showData.created_by.map((creator: any) => creator.name).join(", ");
  const {name, logo_path} = showData.production_companies.map((company: any) => company)[0];
  tvShowDetails.production_company = name;
  tvShowDetails.logo_path = String(POSTER_URL + logo_path);
  tvShowDetails.seasons = response.data.seasons.map((season: any) => mapToTvShowSeason(season));
  return tvShowDetails;
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
  const params = { api_key: API_KEY };

  return fetchMultiplePages(url, params, page, mapToTvShow);
}

export async function getTopRatedTvShows(page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/tv/top_rated`;
  const params = { api_key: API_KEY };

  return fetchMultiplePages(url, params, page, mapToTvShow);
}

export async function getOnAirTvShows(page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/tv/on_the_air`;
  const params = { api_key: API_KEY };

  return fetchMultiplePages(url, params, page, mapToTvShow);
}

export async function getTvShowsByGenre(genreId: number, page: number = 1): Promise<ITvShow[]> {
  const url = `${BASE_URL}/discover/tv`;
  const params = { api_key: API_KEY, with_genres: genreId };

  return fetchMultiplePages(url, params, page, mapToTvShow);
}
