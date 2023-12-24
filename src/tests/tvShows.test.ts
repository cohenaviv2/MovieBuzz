import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initServer from "../server";
import TvShowsRouter from "../routes/TvShowRoute";

let app: Express;

beforeAll(async () => {
  app = await initServer();
  app.use("/tv-shows", TvShowsRouter); // Adjust the route path accordingly
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("TV Shows Routes", () => {
  const showId: number = 63770;

  test("GET /tv-shows/by-id/:showId should return a TV show by ID", async () => {
    const response = await request(app).get(`/tv-shows/by-id/${showId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(showId);
  });

  test("GET /tv-shows/search should return search results", async () => {
    const response = await request(app).get("/tv-shows/search").query({ query: "Breaking Bad" });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv-shows/popular should return popular TV shows", async () => {
    const response = await request(app).get("/tv-shows/popular");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv-shows/top_rated should return top-rated TV shows", async () => {
    const response = await request(app).get("/tv-shows/top_rated");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv-shows/on_the_air should return on-the-air TV shows", async () => {
    const response = await request(app).get("/tv-shows/on_the_air");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv-shows/by-genre/:genreId should return TV shows by genre", async () => {
    // Assuming genreId 18 corresponds to the "Drama" genre
    const response = await request(app).get("/tv-shows/by-genre/18");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Tests for error scenarios
  test("GET /tv-shows/by-id/:invalidId should return 404 for an invalid TV show ID", async () => {
    const response = await request(app).get("/tv-shows/by-id/invalidId");
    // console.log(response.body); // Log the response body for further investigation
    expect(response.status).toBe(404);
  });
});
