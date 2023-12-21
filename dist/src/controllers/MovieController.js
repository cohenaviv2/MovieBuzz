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
exports.getMoviesByGenre = exports.getUpcomingMovies = exports.getNowPlayingMovies = exports.getPopularMovies = exports.searchMovies = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const POSTER_URL = process.env.TMDB_POSTER_URL || "https://image.tmdb.org/t/p/w500";
function mapToMovie(tmdbMovie) {
    const { id, title, overview, release_date, genre_ids, original_language } = tmdbMovie;
    const mappedMovie = {
        id: tmdbMovie.id,
        title: tmdbMovie.title,
        poster_path: String(POSTER_URL + tmdbMovie.poster_path),
        overview: tmdbMovie.overview,
        year: new Date(tmdbMovie.release_date).getFullYear().toString(),
        genre_ids: tmdbMovie.genre_ids,
        language: tmdbMovie.original_language,
    };
    return mappedMovie;
}
function searchMovies(query, page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/search/movie`;
        const params = { api_key: API_KEY, query, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedMovies = response.data.results.map(mapToMovie);
        return mappedMovies;
    });
}
exports.searchMovies = searchMovies;
function getPopularMovies(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/movie/popular`;
        const params = { api_key: API_KEY, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedMovies = response.data.results.map(mapToMovie);
        return mappedMovies;
    });
}
exports.getPopularMovies = getPopularMovies;
function getNowPlayingMovies(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/movie/now_playing`;
        const params = { api_key: API_KEY, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedMovies = response.data.results.map(mapToMovie);
        return mappedMovies;
    });
}
exports.getNowPlayingMovies = getNowPlayingMovies;
function getUpcomingMovies(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/movie/upcoming`;
        const params = { api_key: API_KEY, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedMovies = response.data.results.map(mapToMovie);
        return mappedMovies;
    });
}
exports.getUpcomingMovies = getUpcomingMovies;
function getMoviesByGenre(genreId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/discover/movie`;
        const params = { api_key: API_KEY, with_genres: genreId };
        const response = yield axios_1.default.get(url, {
            params,
        });
        const mappedMovies = response.data.results.map(mapToMovie);
        return mappedMovies;
    });
}
exports.getMoviesByGenre = getMoviesByGenre;
//# sourceMappingURL=MovieController.js.map