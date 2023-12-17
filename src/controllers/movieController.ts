import axios, { AxiosResponse } from "axios";
import "dotenv/config";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const POSTER_URL = process.env.TMDB_POSTER_URL || "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  year: string;
  genre_ids: { id: number }[];
  language: string;
}

function mapToMovie(tmdbMovie: any): Movie {
  const { id, title, overview, release_date, genre_ids, original_language } =
    tmdbMovie;


  const mappedMovie: Movie = {
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

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/popular`;
  const params = { api_key: API_KEY, page };
  const response= await axios.get(url, {params,});
  const mappedMovies = response.data.results.map(mapToMovie);
  return mappedMovies;
}

export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/now_playing`;
  const params = { api_key: API_KEY, page };
  const response = await axios.get(url, { params });
  const mappedMovies = response.data.results.map(mapToMovie);
  return mappedMovies;
}

export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/upcoming`;
  const params = { api_key: API_KEY, page };
  const response = await axios.get(url, { params });
  const mappedMovies = response.data.results.map(mapToMovie);
  return mappedMovies;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const url = `${BASE_URL}/search/movie`;
  const params = { api_key: API_KEY, query };
  const response = await axios.get(url, {params});
  const mappedMovies = response.data.results.map(mapToMovie);
  return mappedMovies;
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const url = `${BASE_URL}/discover/movie`;
  const params = { api_key: API_KEY, with_genres: genreId };
  const response = await axios.get(url, {
    params,
  });
  const mappedMovies = response.data.results.map(mapToMovie);
  return mappedMovies;
}
