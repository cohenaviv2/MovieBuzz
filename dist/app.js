"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieRouter_1 = __importDefault(require("./routers/movieRouter"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT || 5000;
app.use("/movies", movieRouter_1.default);
app.listen(port, () => {
    console.log(`\n\n* Server is running on http://localhost:${port} *\n\n`);
});
//# sourceMappingURL=app.js.map