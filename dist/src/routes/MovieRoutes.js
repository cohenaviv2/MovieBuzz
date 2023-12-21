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
const express_1 = __importDefault(require("express"));
const MovieController_1 = require("../controllers/MovieController");
const router = express_1.default.Router();
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
    }
    const results = yield (0, MovieController_1.searchMovies)(query, page);
    res.json(results);
}));
router.get("/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Parse page parameter from query string
        const popularMovies = yield (0, MovieController_1.getPopularMovies)(page);
        res.json(popularMovies);
    }
    catch (error) {
        console.error("Error fetching popular movies:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/now_playing", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Parse page parameter from query string
        const nowPlayingMovies = yield (0, MovieController_1.getNowPlayingMovies)(page);
        res.json(nowPlayingMovies);
    }
    catch (error) {
        console.error("Error fetching popular movies:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/upcoming", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Parse page parameter from query string
        const upcomingMovies = yield (0, MovieController_1.getUpcomingMovies)(page);
        res.json(upcomingMovies);
    }
    catch (error) {
        console.error("Error fetching popular movies:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/by-genre/:genreId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genreId = Number(req.params.genreId);
    const movies = yield (0, MovieController_1.getMoviesByGenre)(genreId);
    res.json(movies);
}));
exports.default = router;
//# sourceMappingURL=MovieRoutes.js.map