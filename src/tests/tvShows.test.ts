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

describe("TV Show API tests", () => {
  const showId: number = 63770;

  test("Test get tv show by ID", async () => {
    const response = await request(app).get(`/tv/by-id/${showId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(showId);
  });

  test("Test search tv shows results", async () => {
    const response = await request(app).get("/tv/search").query({ query: "Breaking Bad" });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get popular tv shows", async () => {
    const response = await request(app).get("/tv/popular");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get top rated tv shows", async () => {
    const response = await request(app).get("/tv/top-rated");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get on-the-air tv shows", async () => {
    const response = await request(app).get("/tv/on-the-air");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get tv shows by genre ID", async () => {
    // * genreId 18 corresponds to the "Drama" genre *
    const response = await request(app).get("/tv/by-genre/18");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Tests for error scenarios
  test("Test tv show with invalid ID", async () => {
    const response = await request(app).get("/tv/by-id/invalidId");
    expect(response.status).toBe(404);
  });
});
