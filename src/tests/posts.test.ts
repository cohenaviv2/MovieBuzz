import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initServer from "../server";
import UserModel, { IUser } from "../models/UserModel";
import PostModel, { IPost } from "../models/PostModel";
import { IComment } from "../models/CommentModel";

let app: Express;
let accessToken: string;
let db_post_id: string;
let post1_id: string;
let post2_id: string;

let testPost: IPost = {
  ownerId: "GOING_TO_BE_REPLACED_ID",
  tmdbId: "1029575",
  tmdbTitle:"title",
  tmdbImageUrl: "ioggg.ggg",
  text: "post",
  rating: 5,
  imageUrl: "img.jpg",
  createdAt: new Date(Date.now()),
};

const testUser: IUser = {
  fullName: "Test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  imageUrl: "img.jpg",
  tokens: [],
  socketId: "",
};

beforeAll(async () => {
  [app] = await initServer();
  await UserModel.deleteMany({ email: testUser.email });
  await PostModel.deleteMany();
  const res1 = await request(app).post("/auth/register").send(testUser);
  testUser._id = res1.body._id;
  const res2 = await request(app).post("/auth/login").send(testUser);
  accessToken = res2.body.accessToken;
});

afterAll(async () => {
  await PostModel.deleteMany();
  await mongoose.connection.close();
});

describe("Post tests", () => {
  test("Test create new post", async () => {
    const response = await request(app)
      .post("/posts")
      .send(testPost)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    expect(response.body.text).toBe(testPost.text);
    expect(response.body.ownerId).toBe(testUser._id);
    db_post_id = response.body._id;
  });

  test("Test get all posts", async () => {
    const response = await request(app).get("/posts").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get post by ID", async () => {
    const response = await request(app).get(`/posts/${db_post_id}`).expect(200);
    expect(response.body.text).toBe(testPost.text);
  });

  test("Test Get All posts with one post in DB", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const rc = response.body[0];
    expect(rc.text).toBe(testPost.text);
    expect(rc.ownerId).toBe(testUser._id);
  });

  test("Test update post by ID", async () => {
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

  test("Test delete post by ID", async () => {
    await request(app)
      .delete(`/posts/${db_post_id}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(204);
    // Verify that the post is deleted
    const deletedPost = await PostModel.findById(db_post_id);
    expect(deletedPost).toBeNull();
  });

  test("Test get all 2 user posts", async () => {
    // Post 1 request
    const post1 = testPost;
    post1.text = "Text post 1";
    post1.tmdbId = "897087"; // Unique
    const res1 = await request(app)
      .post("/posts")
      .send(post1)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    // Post 2 request
    const post2 = testPost;
    post2.text = "Text post 2";
    post2.tmdbId = "891699"; // Unique
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

  test("Test get posts by recency", async () => {
    await PostModel.deleteMany();

    let testPost1: IPost = {
      ownerId: "...",
      tmdbId: "891699",
      tmdbTitle: "title",
      tmdbImageUrl: "ioggg.ggg",
      text: "post 1",
      rating: 5,
      imageUrl: "img.jpg",
    };
    let testPost2: IPost = {
      ownerId: "...",
      tmdbId: "897087",
      tmdbTitle: "title",
      tmdbImageUrl: "ioggg.ggg",
      text: "post 2",
      rating: 3,
      imageUrl: "img.jpg",
    };
    const res1 = await request(app)
      .post("/posts")
      .send(testPost1)
      .set("Authorization", "JWT " + accessToken);
    post1_id = res1.body._id;

    await new Promise((r) => setTimeout(r, 1000));

    const res2 = await request(app)
      .post("/posts")
      .send(testPost2)
      .set("Authorization", "JWT " + accessToken);
    post2_id = res2.body._id;
    const response = await request(app).get("/posts/recent").expect(200);
    expect(response.body[0].text).toBe("post 2");
    expect(response.body[1].text).toBe("post 1");
  });

  test("Test get posts by most-commented", async () => {
    let testComment1: IComment = {
      ownerId: "...",
      postId: post1_id,
      text: "comment 1",
    };
    let testComment2: IComment = {
      ownerId: "...",
      postId: post2_id,
      text: "comment 2",
    };

    await request(app)
      .post("/comments")
      .send(testComment1)
      .set("Authorization", "JWT " + accessToken);
    testComment1.text = "comment 1.1";
    await request(app)
      .post("/comments")
      .send(testComment1)
      .set("Authorization", "JWT " + accessToken);
    await request(app)
      .post("/comments")
      .send(testComment2)
      .set("Authorization", "JWT " + accessToken);

    const response = await request(app).get("/posts/most-commented").expect(200);
    expect(response.body[0]._id).toBe(post1_id);
    expect(response.body[1]._id).toBe(post2_id);
  });

  test("Test get posts by top-rated", async () => {
    let testPost3: IPost = {
      ownerId: "...",
      tmdbId: "520758",
      tmdbTitle: "title",
      tmdbImageUrl: "ioggg.ggg",
      text: "post 3",
      rating: 1,
      imageUrl: "img.jpg",
      createdAt: new Date(Date.now()),
    };

    const res1 = await request(app)
      .post("/posts")
      .send(testPost3)
      .set("Authorization", "JWT " + accessToken);
    let post3_id = res1.body._id;

    const response = await request(app).get("/posts/top-rated").expect(200);
    expect(response.body[0]._id).toBe(post1_id);
    expect(response.body[1]._id).toBe(post2_id);
    expect(response.body[2]._id).toBe(post3_id);
  });
});
