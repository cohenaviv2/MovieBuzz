import express from "express";
import movieRouter from "./routes/movieRouter";
import tvShowsRouter from "./routes/tvShowsRouter"
import "dotenv/config";

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use("/movies", movieRouter);
app.use("/tv",tvShowsRouter);

app.listen(port, () => {
  console.log(`\n\n* Server is running on http://localhost:${port} *\n\n`);
});
