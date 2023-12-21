"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const MovieRoutes_1 = __importDefault(require("./routes/MovieRoutes"));
const TvShowRoutes_1 = __importDefault(require("./routes/TvShowRoutes"));
const CommentRoutes_1 = __importDefault(require("./routes/CommentRoutes"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const initServer = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DATABASE_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(express_1.default.json());
            app.use("/comments", CommentRoutes_1.default);
            app.use("/posts", PostRoutes_1.default);
            app.use("/users", UserRoutes_1.default);
            app.use("/movies", MovieRoutes_1.default);
            app.use("/tv", TvShowRoutes_1.default);
            resolve(app);
        });
    });
    return promise;
};
exports.default = initServer;
//# sourceMappingURL=server.js.map