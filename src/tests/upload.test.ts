import request from "supertest";
import initServer from "../server";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { Express } from "express";
import { IUser } from "../models/UserModel";
import UserModel from "../models/UserModel";
import PostModel, { IPost } from "../models/PostModel";

let app: Express;
let accessToken: string;
let postImageUrl: string;
let userImageUrl: string;
let targetFolder: string;

let testUser: IUser = {
  fullName: "Test test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  imageUrl: "img.jpg",
  tokens: [],
};

beforeAll(async () => {
  app = await initServer();
  await UserModel.deleteMany({ email: testUser.email });
  const res1 = await request(app).post("/auth/register").send(testUser);
  testUser._id = res1.body._id;
  const res2 = await request(app).post("/auth/login").send(testUser);
  accessToken = res2.body.accessToken;
});

afterAll(async () => {
  await UserModel.deleteMany({ email: testUser.email });
  await PostModel.deleteMany();
  await mongoose.connection.close();
});

describe("Image Upload Test", () => {
  test("Test upload image for post", async () => {
    const filePath = path.resolve(__dirname, "test-files", "test.png");
    const fileBuffer = fs.readFileSync(filePath);
    targetFolder = "posts";

    const response = await request(app)
      .post(`/image/upload/${targetFolder}`)
      .set("Authorization", "JWT " + accessToken)
      .attach("image", filePath);

    expect(response.status).toBe(201);
    postImageUrl = response.body.imageUrl;
    expect(postImageUrl).toBeTruthy();
  });

  test("Test upload image for user profile", async () => {
    const filePath = path.resolve(__dirname, "test-files", "photo.png");
    const fileBuffer = fs.readFileSync(filePath);
    targetFolder = "users";

    const response = await request(app)
      .post(`/image/upload/${targetFolder}`)
      .set("Authorization", "JWT " + accessToken)
      .attach("image", filePath);

    expect(response.status).toBe(201);
    userImageUrl = response.body.imageUrl;
    expect(userImageUrl).toBeTruthy();
  });

  test("Test upload non-image for post", async () => {
    const filePath = path.resolve(__dirname, "test-files", "test.txt");
    const fileBuffer = fs.readFileSync(filePath);
    targetFolder = "posts";

    const response = await request(app)
      .post(`/image/upload/${targetFolder}`)
      .set("Authorization", "JWT " + accessToken)
      .attach("image", filePath);

    expect(response.status).toBe(500);
  });

  test("Test upload image to wrong target folder", async () => {
    const filePath = path.resolve(__dirname, "test-files", "test.txt");
    const fileBuffer = fs.readFileSync(filePath);
    targetFolder = "wrong";

    const response = await request(app)
      .post(`/image/upload/${targetFolder}`)
      .set("Authorization", "JWT " + accessToken)
      .attach("image", filePath);

    expect(response.status).toBe(500);
  });

  test("Test upload image and post", async () => {
    const filePath = path.resolve(__dirname, "test-files", "frozen-post.jpg");
    const fileBuffer = fs.readFileSync(filePath);
    targetFolder = "posts";

    const response = await request(app)
      .post(`/image/upload/${targetFolder}`)
      .set("Authorization", "JWT " + accessToken)
      .attach("image", filePath);

    expect(response.status).toBe(201);
    postImageUrl = response.body.imageUrl;
    expect(postImageUrl).toBeTruthy();

    const newPost: IPost = {
      ownerId: "...",
      tmdbId: "109445",
      tmdbTitle: "title",
      tmdbImageUrl: "ioggg.ggg",
      text: "Best movie I've seen in my life!",
      rating: 5,
      imageUrl: postImageUrl,
    };

    const response2 = await request(app)
      .post("/posts")
      .send(newPost)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);

    expect(response2.body.imageUrl).toBe(postImageUrl);
  });

  test("Test upload image and user", async () => {
    const filePath = path.resolve(__dirname, "test-files", "photo.png");
    const fileBuffer = fs.readFileSync(filePath);
    targetFolder = "users";

    const response = await request(app)
      .post(`/image/upload/${targetFolder}`)
      .set("Authorization", "JWT " + accessToken)
      .attach("image", filePath);

    expect(response.status).toBe(201);
    userImageUrl = response.body.imageUrl;
    expect(userImageUrl).toBeTruthy();

    let newUser: IUser = {
      fullName: "New User",
      email: "newUser@test.com",
      role: "user",
      password: "1234567890",
      imageUrl: userImageUrl,
      tokens: [],
    };

    const response2 = await request(app).post("/auth/register").send(newUser).expect(201);

    const userId = response2.body._id;
    const user = await UserModel.findById(userId);
    expect(user).not.toBe(null);
    expect(user.imageUrl).toBe(userImageUrl);
    await UserModel.deleteOne({ email: user.email });
  });
});
