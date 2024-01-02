import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initServer from "../server";
import UserModel, { IUser } from "../models/UserModel";

let app: Express;
let userAccessToken: string;
let adminAccessToken: string;
let userId: string;
let adminId: string;

const testUser: IUser = {
  fullName: "Test test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  imageUrl: "img.jpg",
  tokens: [],
};

const testAdmin: IUser = {
  fullName: "Admin admin",
  email: "testAdmin@test.com",
  role: "admin",
  password: "1234567890",
  imageUrl: "img.jpg",
  tokens: [],
};

beforeAll(async () => {
  app = await initServer();
  // User
  await UserModel.deleteMany({ email: testUser.email });
  const res1 = await request(app).post("/auth/register").send(testUser);
  testUser._id = res1.body._id;
  userId = res1.body._id;
  const res2 = await request(app).post("/auth/login").send(testUser);
  userAccessToken = res2.body.accessToken;
  // Admin
  await UserModel.deleteMany({ email: testAdmin.email });
  const res3 = await request(app).post("/auth/register").send(testAdmin);
  testAdmin._id = res3.body._id;
  adminId = res3.body._id;
  const res4 = await request(app).post("/auth/login").send(testAdmin);
  adminAccessToken = res4.body.accessToken;
});

afterAll(async () => {
  await UserModel.deleteMany({ email: testUser.email });
  await UserModel.deleteMany({ email: testAdmin.email });
  await mongoose.connection.close();
});

describe("Post tests", () => {
  test("Test get user profile", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", "JWT " + adminAccessToken);
    expect(200);
  });

  test("Test get user profile with invalid token", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", "JWT 1" + adminAccessToken);
    expect(401);
  });

  test("Test get user profile without access token", async () => {
    const response = await request(app).get("/user/profile");
    expect(401);
  });

  test("Test get all user with admin access", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + adminAccessToken);
    expect(200);
  });

  test("Test get all user with invalid access (user)", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + userAccessToken);
    expect(403);
  });

  test("Test update user profile", async () => {
    const updatedUser = testUser;
    updatedUser.fullName = "Updated";

    const response = await request(app)
      .put("/user/profile")
      .send(updatedUser)
      .set("Authorization", "JWT " + userAccessToken)
      .expect(200);
    expect(response.body.fullName).toBe(testUser.fullName);
    const updatedUserDb = await UserModel.findById(userId);
    expect(updatedUserDb?.fullName).toBe(updatedUser.fullName);
  });

  test("Test delete user without admin access", async () => {
    await request(app)
      .delete(`/user/${adminId}`)
      .set("Authorization", "JWT " + userAccessToken)
      .expect(403);
  });

  test("Test delete user with admin access", async () => {
    await request(app)
      .delete(`/user/${userId}`)
      .set("Authorization", "JWT " + adminAccessToken)
      .expect(204);
    // Verify that the post is deleted
    const deletedPost = await UserModel.findById(userId);
    expect(deletedPost).toBeNull();
  });
});
