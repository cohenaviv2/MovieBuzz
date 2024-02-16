import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initServer from "../server";

let app: Express;

beforeAll(async () => {
  [app] = await initServer();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Movie API tests", () => {
  const movieId: number = 787699;

  test("Test get movie by ID", async () => {
    const response = await request(app).get(`/movies/by-id/${movieId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(movieId);
  });

  test("Test search movies results", async () => {
    const response = await request(app).get("/movies/search?query=avengers");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get popular movies", async () => {
    const response = await request(app).get("/movies/popular");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get now-playing movies", async () => {
    const response = await request(app).get("/movies/now-playing");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get upcoming movies", async () => {
    const response = await request(app).get("/movies/upcoming");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get movies by genre ID", async () => {
    // * genreId 28 corresponds to the "Action" genre *
    const response = await request(app).get("/movies/by-genre/28");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Tests for error scenarios
  test("Test get movie with invalid ID", async () => {
    const response = await request(app).get("/movies/by-id/invalidId");
    expect(response.status).toBe(404);
  });

});
