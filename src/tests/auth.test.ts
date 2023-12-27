import request from "supertest";
import initServer from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models//UserModel";

let app: Express;

const testUser = {
  firstName: "Test",
  lastName: "test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  passwordConfirm: "1234567890",
  image: "img.jpg",
  comments: [],
};

beforeAll(async () => {
  app = await initServer();
  await User.deleteMany({ email: testUser.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(testUser);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(testUser);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(testUser);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  test("Timeout access", async () => {
    jest.setTimeout(10000);
    await new Promise((r) => setTimeout(() => r("done"), 3 * 1000));
    const response = await request(app)
      .get("/comments")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toEqual(200);
  });

  test("Refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken);
    expect(response.statusCode).toBe(200);
    let newAccessToken = response.body.accessToken;
    let newRefreshToken = response.body.refreshToken;
    expect(newAccessToken).toBeDefined();
    expect(newRefreshToken).toBeDefined();

    // const response2 = await request(app)
    //   .get("/comments")
    //   .set("Authorization", "JWT " + newAccessToken);
    // expect(response2.statusCode).toBe(200);
  });
});
