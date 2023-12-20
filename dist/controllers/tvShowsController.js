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
exports.getShowsByGenre = exports.searchTvShows = exports.getOnTheAirShows = exports.getTopRatedShows = exports.getPopularShows = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const POSTER_URL = process.env.TMDB_POSTER_URL || "https://image.tmdb.org/t/p/w500";
function mapToTvShow(tmdbTvShow) {
    const { id, original_name, overview, first_air_date, genre_ids, original_language, } = tmdbTvShow;
    const mappedTvShow = {
        id: tmdbTvShow.id,
        title: tmdbTvShow.original_name,
        poster_path: String(POSTER_URL + tmdbTvShow.poster_path),
        overview: tmdbTvShow.overview,
        year: new Date(tmdbTvShow.first_air_date).getFullYear().toString(),
        genre_ids: tmdbTvShow.genre_ids,
        language: tmdbTvShow.original_language,
    };
    return mappedTvShow;
}
function getPopularShows(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/tv/popular`;
        const params = { api_key: API_KEY, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedShows = response.data.results.map(mapToTvShow);
        return mappedShows;
    });
}
exports.getPopularShows = getPopularShows;
function getTopRatedShows(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/tv/top_rated`;
        const params = { api_key: API_KEY, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedShows = response.data.results.map(mapToTvShow);
        return mappedShows;
    });
}
exports.getTopRatedShows = getTopRatedShows;
function getOnTheAirShows(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/tv/on_the_air`;
        const params = { api_key: API_KEY, page };
        const response = yield axios_1.default.get(url, { params });
        const mappedShows = response.data.results.map(mapToTvShow);
        return mappedShows;
    });
}
exports.getOnTheAirShows = getOnTheAirShows;
function searchTvShows(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/search/tv`;
        const params = { api_key: API_KEY, query };
        const response = yield axios_1.default.get(url, { params });
        const mappedShows = response.data.results.map(mapToTvShow);
        return mappedShows;
    });
}
exports.searchTvShows = searchTvShows;
function getShowsByGenre(genreId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}/discover/tv`;
        const params = { api_key: API_KEY, with_genres: genreId };
        const response = yield axios_1.default.get(url, {
            params,
        });
        const mappedShows = response.data.results.map(mapToTvShow);
        return mappedShows;
    });
}
exports.getShowsByGenre = getShowsByGenre;
//# sourceMappingURL=tvShowsController.js.map