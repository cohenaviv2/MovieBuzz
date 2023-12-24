import request from "supertest";
import initServer from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models//UserModel";

let app: Express;

export const testUser = {
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
      expect(accessToken).toBeDefined();
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
});
