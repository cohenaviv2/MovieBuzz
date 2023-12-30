import request from "supertest";
import initServer from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import UserModel, { IUser } from "../models/UserModel";
import CommentModel, { IComment } from "../models/CommentModel";

let app: Express;
let accessToken: string;
let refreshToken: string;
let newAccessToken: string;
let newRefreshToken: string;

const testUser: IUser = {
  fullName: "Test test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  image: "img.jpg",
  tokens: [],
};

const testComment: IComment = {
  ownerId: "GOING_TO_BE_REPLACED_ID",
  postId: "132456789",
  text: "Test comment",
};

beforeAll(async () => {
  app = await initServer();
  await UserModel.deleteMany({ email: testUser.email });
  await CommentModel.deleteMany();
});

afterAll(async () => {
  await UserModel.deleteMany({ email: testUser.email });
  await mongoose.connection.close();
});

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
    const response = await request(app).post("/comments").send(testComment);
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .post("/comments")
      .send(testComment)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(201);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .post("/comments")
      .send(testComment)
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  test("Test timeout access", async () => {
    jest.setTimeout(10000);
    await new Promise((r) => setTimeout(() => r("done"), 3 * 1000));
    const response = await request(app)
      .post("/comments")
      .send(testComment)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toEqual(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken);
    expect(response.statusCode).toBe(200);
    // *Get new tokens*
    newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;
    expect(newAccessToken).toBeDefined();
    expect(newRefreshToken).toBeDefined();

    testComment.text = testComment.text + " 1";
    const response2 = await request(app)
      .post("/comments")
      .send(testComment)
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(201);
  });

  test("Test logout", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + newRefreshToken);
    expect(response.statusCode).toEqual(200);
  });
});
