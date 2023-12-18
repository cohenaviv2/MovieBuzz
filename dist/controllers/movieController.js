"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularMovies = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const POSTER_URL = process.env.TMDB_POSTER_URL || "https://image.tmdb.org/t/p/w500";
function mapTmdbToMovie(tmdbMovie) {
    const { id, title, overview, release_date, genre_ids, original_language, first_air_date, original_name, } = tmdbMovie;
    const movieId = tmdbMovie.id;
    const movieTitle = tmdbMovie.original_name
        ? tmdbMovie.original_name
        : tmdbMovie.title;
    const moviePosterPath = String(POSTER_URL + tmdbMovie.poster_path);
    const movieOverview = tmdbMovie.overview;
    const movieYear = new Date(tmdbMovie.first_air_date ? tmdbMovie.first_air_date : tmdbMovie.release_date)
        .getFullYear()
        .toString();
    const movieGenreIds = tmdbMovie.genre_ids;
    const movieLanguage = tmdbMovie.original_language;
    // Map other properties as needed
    const mappedMovie = {
        id: movieId,
        title: movieTitle,
        poster_path: moviePosterPath, // Corrected this line
        overview: movieOverview,
        year: movieYear,
        genre_ids,
        language: movieLanguage,
    };
    return mappedMovie;
}
function getPopularMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/movie/popular`;
        const params = { api_key: API_KEY };
        const response = yield axios_1.default.get(url, {
            params,
        });
        const mappedMovies = response.data.results.map(mapTmdbToMovie);
        return mappedMovies;
    });
}
exports.getPopularMovies = getPopularMovies;
//# sourceMappingURL=movieController.js.map