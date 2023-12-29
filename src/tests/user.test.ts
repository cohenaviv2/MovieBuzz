import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initServer from "../server";
import UserModel, { IUser } from "../models/UserModel";

let app: Express;
let userAccessToken: string;
let adminAccessToken: string;
let userId:string;
let adminId:string;

const testUser: IUser = {
  firstName: "Test",
  lastName: "test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  passwordConfirm: "1234567890",
  image: "img.jpg",
  tokens: [],
  postIds: [],
};

const testAdmin: IUser = {
  firstName: "Admin",
  lastName: "admin",
  email: "testAdmin@test.com",
  role: "admin",
  password: "1234567890",
  passwordConfirm: "1234567890",
  image: "img.jpg",
  tokens: [],
  postIds: [],
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
  test("Get user profile", async () => {
    const response = await request(app)
      .get(`/user/${userId}`)
      .set("Authorization", "JWT " + adminAccessToken);
    expect(200);
  });

  test("Get user profile with invalid id", async () => {
    const invalidId = userId + "123";
    const response = await request(app)
      .get(`/user/${invalidId}`)
      .set("Authorization", "JWT " + adminAccessToken);
    expect(403);
  });

  test("Get user profile without access token", async () => {
    const response = await request(app).get(`/user/${userId}`);
    expect(401);
  });

  test("Get all user with admin access", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + adminAccessToken);
    expect(200);
  });

  test("Get all user with invalid access", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + userAccessToken);
    expect(403);
  });

  test("Update user profile", async () => {
    const updatedUser = testUser;
    updatedUser.firstName = "Updated";

    const response = await request(app)
      .put(`/user/${userId}`)
      .send(updatedUser)
      .set("Authorization", "JWT " + userAccessToken)
      .expect(200);
    expect(response.body.firstName).toBe(testUser.firstName);
    const updatedUserDb = await UserModel.findById(userId);
    expect(updatedUserDb?.firstName).toBe(updatedUser.firstName);
  });

    test("Delete user without admin access", async () => {
      await request(app)
        .delete(`/user/${adminId}`)
        .set("Authorization", "JWT " + userAccessToken)
        .expect(403);
    });

  test("Delete user with admin access", async () => {
    await request(app)
      .delete(`/user/${userId}`)
      .set("Authorization", "JWT " + adminAccessToken)
      .expect(204);
    // Verify that the post is deleted
    const deletedPost = await UserModel.findById(userId);
    expect(deletedPost).toBeNull();
  });
});
