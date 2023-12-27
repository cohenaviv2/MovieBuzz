import request from "supertest";
import { Express } from "express";
import mongoose, { Types } from "mongoose";
import initServer from "../server";
import PostModel, { IPost } from "../models/PostModel";
import UserModel, { IUser } from "../models/UserModel";

let app: Express;
let accessToken: string;

const testPost: IPost = {
  ownerId: "GOING_TO_BE_REPLACED_ID",
  tmdbId: "123",
  text: "This is a test post",
  image: "test.jpg",
  rating: 5,
  comments: [],
};

const testUser: IUser = {
  firstName: "Test",
  lastName: "test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  passwordConfirm: "1234567890",
  image: "img.jpg",
  tokens: [],
  posts: []
};

beforeAll(async () => {
  app = await initServer();
  // register
  await UserModel.deleteMany({ email: testUser.email });
  const res1 = await request(app).post("/auth/register").send(testUser);
  testUser._id = res1.body._id;
  const res2 = await request(app).post("/auth/login").send(testUser);
  accessToken = res2.body.accessToken;
});

describe("Post tests", () => {
  let createdPostId: string;

  test("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .send(testPost)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);

    expect(response.body.text).toBe(testPost.text);
    createdPostId = response.body._id;
  });

  test("should get all posts", async () => {
    const response = await request(app).get("/posts").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should get a post by ID", async () => {
    const response = await request(app)
      .get(`/posts/${createdPostId}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(200);

    expect(response.body.text).toBe(testPost.text);
  });

  test("should update a post by ID", async () => {
    const updatedData: Partial<IPost> = {
      text: "Updated post",
    };

    await request(app)
      .put(`/posts/${createdPostId}`)
      .send(updatedData)
      .set("Authorization", "JWT " + accessToken)
      .expect(200);

    const updatedPost = await PostModel.findById(createdPostId);
    expect(updatedPost?.text).toBe("Updated post");
  });

  test("should delete a post by ID", async () => {
    await request(app)
      .delete(`/posts/${createdPostId}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(204);

    // Verify that the post is deleted
    const deletedPost = await PostModel.findById(createdPostId);
    expect(deletedPost).toBeNull();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
