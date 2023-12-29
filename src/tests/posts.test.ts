import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initServer from "../server";
import UserModel, { IUser } from "../models/UserModel";
import PostModel, { IPost } from "../models/PostModel";

let app: Express;
let accessToken: string;
let db_post_id: string;

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
  posts: [],
};

beforeAll(async () => {
  app = await initServer();
  await UserModel.deleteMany({ email: testUser.email });
  await PostModel.deleteMany();
  const res1 = await request(app).post("/auth/register").send(testUser);
  testUser._id = res1.body._id;
  const res2 = await request(app).post("/auth/login").send(testUser);
  accessToken = res2.body.accessToken;
});

describe("Post tests", () => {
  test("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .send(testPost)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    expect(response.body.text).toBe(testPost.text);
    expect(response.body.ownerId).toBe(testUser._id);
    db_post_id = response.body._id;
  });

  test("should get all posts", async () => {
    const response = await request(app).get("/posts").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should get a post by ID", async () => {
    const response = await request(app).get(`/posts/${db_post_id}`).expect(200);
    expect(response.body.text).toBe(testPost.text);
  });

  test("Test Get All posts with one post in DB", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const rc = response.body[0];
    expect(rc.text).toBe(testPost.text);
    expect(rc.image).toBe(testPost.image);
    expect(rc.ownerId).toBe(testUser._id);
  });

  test("should update a post by ID", async () => {
    const updatedData: Partial<IPost> = {
      text: "Updated post",
    };
    const response = await request(app)
      .put(`/posts/${db_post_id}`)
      .send(updatedData)
      .set("Authorization", "JWT " + accessToken)
      .expect(200);
    expect(response.body.ownerId).toBe(testUser._id);
    const updatedPost = await PostModel.findById(db_post_id);
    expect(updatedPost?.text).toBe(updatedData.text);
  });

  test("should delete a post by ID", async () => {
    await request(app)
      .delete(`/posts/${db_post_id}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(204);
    // Verify that the post is deleted
    const deletedPost = await PostModel.findById(db_post_id);
    expect(deletedPost).toBeNull();
  });

  test("should get all 2 user posts", async () => {
    // Post 1 request
    const post1 = testPost;
    post1.text = "Text post 1";
    const res1 = await request(app)
      .post("/posts")
      .send(post1)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    // Post 2 request
    const post2 = testPost;
    post2.text = "Text post 2";
    const res2 = await request(app)
      .post("/posts")
      .send(post2)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);

    const response = await request(app)
      .get("/posts/find")
      .set("Authorization", "JWT " + accessToken);
    expect(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].ownerId).toBe(testUser._id);
    expect(response.body[0].text).toBe("Text post 1");
    expect(response.body[1].ownerId).toBe(testUser._id);
    expect(response.body[1].text).toBe("Text post 2");
  });

  afterAll(async () => {
    await PostModel.deleteMany();
    await mongoose.connection.close();
  });
});
