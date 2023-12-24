import request from "supertest";
import { Express } from "express";
import mongoose, { Types } from "mongoose";
import initServer from "../server";
import PostModel, { IPost } from "../models/PostModel";
import UserModel from "../models/UserModel";
import { testUser } from "./auth.test";

let app: Express;
let accessToken: string;

const testPost: IPost = {
  creatorId: new Types.ObjectId(),
  tmdbId: "123",
  text: "Test post",
  image: "test.jpg",
  rating: 5,
  comments: [],
};

beforeAll(async () => {
  app = await initServer();
  // login
  await UserModel.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  accessToken = response.body.accessToken;
});


describe("PostController", () => {
  let createdPostId: string;

  test("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "JWT " + accessToken)
      .send(testPost)
      .expect(201);

    expect(response.body.text).toBe("Test post");
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

    expect(response.body.text).toBe("Test post");
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
