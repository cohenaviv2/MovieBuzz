import express from 'express';
import 'dotenv/config';
import connectDB from "./db"
import movieRouter from './routes/movieRouter';
import tvShowsRouter from './routes/tvShowsRouter'
import commentRoutes from './routes/commentRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

connectDB()
  .then(() => {
    app.use(express.json());
    app.use('/api', commentRoutes);
    app.use('/api', postRoutes);
    app.use('/api', userRoutes);
    
    app.use("/movies", movieRouter);
    app.use("/tv",tvShowsRouter);
    
    const PORT = process.env.SERVER_PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n\nServer is running on http://localhost:${PORT}\n\nMovies:\n
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
  })
  .catch(() => {
    process.exit(1);
  });
