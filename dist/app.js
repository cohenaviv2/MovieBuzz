"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieRouter_1 = __importDefault(require("./routes/movieRouter"));
const tvShowsRouter_1 = __importDefault(require("./routes/tvShowsRouter"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT || 5000;
app.use("/movies", movieRouter_1.default);
app.use("/tv", tvShowsRouter_1.default);
app.use('/api', commentRoutes_1.default);
app.use('/api', postRoutes_1.default);
app.use('/api', userRoutes_1.default);
app.listen(port, () => {
    console.log(`\n\nServer is running on http://localhost:${port}\n\nMovies:\n
http://localhost:5000/movies/search\n
http://localhost:5000/movies/popular\n
http://localhost:5000/movies/now_playing\n
http://localhost:5000/movies/upcoming\n
http://localhost:5000/movies/by-genre/:genreId\n
Tv Shows:\n
http://localhost:5000/tv/search\n
http://localhost:5000/tv/popular\n
http://localhost:5000/tv/top_rated\n
http://localhost:5000/tv/on_the_air\n
http://localhost:5000/tv/by-genre/:genreId`);
});
//# sourceMappingURL=app.js.map