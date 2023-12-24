import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initServer from "../server";

let app: Express;

beforeAll(async () => {
  app = await initServer();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("TV Show API tests", () => {
  const showId: number = 63770;

  test("GET /tv/by-id/:showId should return a TV show by ID", async () => {
    const response = await request(app).get(`/tv/by-id/${showId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(showId);
  });

  test("GET /tv/search should return search results", async () => {
    const response = await request(app).get("/tv/search").query({ query: "Breaking Bad" });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv/popular should return popular TV shows", async () => {
    const response = await request(app).get("/tv/popular");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv/top_rated should return top-rated TV shows", async () => {
    const response = await request(app).get("/tv/top_rated");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv/on_the_air should return on-the-air TV shows", async () => {
    const response = await request(app).get("/tv/on_the_air");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /tv/by-genre/:genreId should return TV shows by genre", async () => {
    // * genreId 18 corresponds to the "Drama" genre *
    const response = await request(app).get("/tv/by-genre/18");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Tests for error scenarios
  test("GET /tv/by-id/:invalidId should return 404 for an invalid TV show ID", async () => {
    const response = await request(app).get("/tv/by-id/invalidId");
    expect(response.status).toBe(404);
  });
});
