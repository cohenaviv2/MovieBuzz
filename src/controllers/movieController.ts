import axios, { AxiosResponse } from "axios";
import "dotenv/config";
import { ITvShow } from "./TvShowsController";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;
const POSTER_URL = process.env.TMDB_POSTER_URL;

export interface IMovie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  year: string;
  genre_ids: { id: number }[];
  language: string;
}

export interface IMovieDetails extends IMovie {
  backdrop_path?: string;
  genres?: string[];
  tagline?: string;
}

function mapToMovie(tmdbMovie: any): IMovie {
  const { id, title, overview, release_date, genre_ids, original_language } = tmdbMovie;

  const mappedMovie: IMovie = {
    id: tmdbMovie.id as number,
    title: tmdbMovie.title as string,
    poster_path: String(POSTER_URL + tmdbMovie.poster_path),
    overview: tmdbMovie.overview as string,
    year: new Date(tmdbMovie.release_date).getFullYear().toString(),
    genre_ids: tmdbMovie.genre_ids as { id: number }[],
    language: tmdbMovie.original_language as string,
  };

  return mappedMovie;
}

export async function getMovieById(movieId: number): Promise<IMovieDetails> {
  const url = `${BASE_URL}/movie/${movieId}`;
  const params = { api_key: API_KEY };
  const response = await axios.get(url, { params });
  const tmdbMovie = response.data;
  const movieDetails: IMovieDetails = mapToMovie(tmdbMovie);
  movieDetails.backdrop_path = String(POSTER_URL + tmdbMovie.backdrop_path);
  movieDetails.genre_ids = tmdbMovie.genres.map((genre) => genre.name);
  movieDetails.tagline = tmdbMovie.tagline;
  return movieDetails;
}

export async function searchMovies(query: string, page: number = 1): Promise<IMovie[]> {
  const url = `${BASE_URL}/search/movie`;
  const params = { api_key: API_KEY, query, page };
  const response = await axios.get(url, { params });
  const mappedMovies = response.data.results.map(mapToMovie);
  return mappedMovies;
}

export async function getPopularMovies(page: number = 1): Promise<IMovie[]> {
  const url = `${BASE_URL}/movie/popular`;
  const params = { api_key: API_KEY }; 

   return fetchMultiplePages(url, params, page, mapToMovie);
}

export async function getNowPlayingMovies(page: number = 1): Promise<IMovie[]> {
  const url = `${BASE_URL}/movie/now_playing`;
  const params = { api_key: API_KEY };

   return fetchMultiplePages(url, params, page, mapToMovie);
}

export async function getUpcomingMovies(page: number = 1): Promise<IMovie[]> {
  const url = `${BASE_URL}/movie/upcoming`;
  const params = { api_key: API_KEY };

   return fetchMultiplePages(url, params, page, mapToMovie);
}


export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<IMovie[]> {
  const url = `${BASE_URL}/discover/movie`;
  const params = { api_key: API_KEY, with_genres: genreId };

   return fetchMultiplePages(url, params, page,mapToMovie);
}

export async function fetchMultiplePages(url: string, params: any,page:number,mapper:(tmdbData:any)=>IMovie|ITvShow): Promise<IMovie[]> {
    const startPage = (page - 1) * 3 + 1;
    const nextPage = startPage + 1;
    const thirdPage = startPage + 2;

    const firstPageResponse = await axios.get(url, { params: { ...params, page: startPage } });
    const firstPageData = firstPageResponse.data.results;
    const secondPageResponse = await axios.get(url, { params: { ...params, page: nextPage } });
    const secondPageData = secondPageResponse.data.results;
    const thirdPageResponse = await axios.get(url, { params: { ...params, page: thirdPage } });
    const thirdPageData = thirdPageResponse.data.results;

    const allMovies = firstPageData.concat(secondPageData, thirdPageData);
    const mappedMovies = allMovies.map(mapper);

    return mappedMovies;
}
