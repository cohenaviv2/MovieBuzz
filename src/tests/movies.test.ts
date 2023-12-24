import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initServer from "../server"; // Adjust the import path based on your project structure

let app: Express;

beforeAll(async () => {
  app = await initServer();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Movie Routes", () => {
  const movieId: number = 787699;

  test("GET /movies/by-id/:movieId should return a movie by ID", async () => {
    // Fetch a movie to get a valid ID
    const response = await request(app).get(`/movies/by-id/${movieId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(movieId);
  });

  test("GET /movies/search should return search results", async () => {
    const response = await request(app).get("/movies/search?query=avengers");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /movies/popular should return popular movies", async () => {
    const response = await request(app).get("/movies/popular");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /movies/now_playing should return now playing movies", async () => {
    const response = await request(app).get("/movies/now_playing");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /movies/upcoming should return upcoming movies", async () => {
    const response = await request(app).get("/movies/upcoming");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /movies/by-genre/:genreId should return movies by genre", async () => {
    // Assuming genreId 28 corresponds to the "Action" genre
    const response = await request(app).get("/movies/by-genre/28");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Tests for error scenarios
  test("GET /movies/by-id/:invalidId should return 404 for an invalid movie ID", async () => {
    const response = await request(app).get("/movies/by-id/invalidId");
    // console.log(response.body); // Log the response body for further investigation
    expect(response.status).toBe(404);
  });
  
});
