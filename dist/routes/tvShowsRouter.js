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
const tvShowsController_1 = require("../controllers/tvShowsController");
const router = express_1.default.Router();
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
    }
    const results = yield (0, tvShowsController_1.searchTvShows)(query);
    res.json(results);
}));
router.get("/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Parse page parameter from query string
        const popularShows = yield (0, tvShowsController_1.getPopularShows)(page);
        res.json(popularShows);
    }
    catch (error) {
        console.error("Error fetching popular Shows:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/top_rated", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Parse page parameter from query string
        const topRatedShows = yield (0, tvShowsController_1.getTopRatedShows)(page);
        res.json(topRatedShows);
    }
    catch (error) {
        console.error("Error fetching popular Shows:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/on_the_air", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Parse page parameter from query string
        const onAirShows = yield (0, tvShowsController_1.getOnTheAirShows)(page);
        res.json(onAirShows);
    }
    catch (error) {
        console.error("Error fetching popular Shows:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/by-genre/:genreId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genreId = Number(req.params.genreId);
    const Shows = yield (0, tvShowsController_1.getShowsByGenre)(genreId);
    res.json(Shows);
}));
exports.default = router;
//# sourceMappingURL=tvShowsRouter.js.map