import { Express } from "express";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import initServer from "../server";
import PostModel, { IPost } from "../models/PostModel";
import createController from "../controllers/BaseController";

let app: Express;

beforeAll(async () => {
  app = await initServer();
});

const testData: IPost = {
  creatorId: new Types.ObjectId(),
  tmdbId: "123",
  text: "Test post",
  image: "test.jpg",
  rating: 5,
  comments: [],
};

describe("PostController", () => {
  // Create an instance of BaseController for PostModel
  const postController = createController<IPost>(PostModel);
  let createdPostId: string;

  test("should create a new post", async () => {
    const response = await request(app)
      .post("/posts/create")
      .send(testData)
      .expect(201);

    expect(response.body.text).toBe("Test post");
    createdPostId = response.body._id;
  });

  test("should get all posts", async () => {
    const response = await request(app).get("/posts/getAll").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should get a post by ID", async () => {
    const response = await request(app)
      .get(`/posts/get/${createdPostId}`)
      .expect(200);

    expect(response.body.text).toBe("Test post");
  });

  test("should update a post by ID", async () => {
    const updatedData: Partial<IPost> = {
      text: "Updated post",
    };

    await request(app)
      .put(`/posts/update/${createdPostId}`)
      .send(updatedData)
      .expect(200);

    const updatedPost = await PostModel.findById(createdPostId);
    expect(updatedPost?.text).toBe("Updated post");
  });

  test("should delete a post by ID", async () => {
    await request(app).delete(`/posts/delete/${createdPostId}`).expect(204);

    // Verify that the post is deleted
    const deletedPost = await PostModel.findById(createdPostId);
    expect(deletedPost).toBeNull();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
