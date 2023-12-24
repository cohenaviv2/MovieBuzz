import request from "supertest";
import { Express } from "express";
import mongoose, { Types } from "mongoose";
import initServer from "../server";
import UserModel from "../models/UserModel";
import CommentModel, { IComment } from "../models/CommentModel";

let app: Express;
let accessToken: string;

const testUser = {
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
  // login
  await UserModel.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  accessToken = response.body.accessToken;
});

const testData: IComment = {
  creatorId: new Types.ObjectId(),
  text: "Test comment",
};

describe("Comment tests", () => {
  let createdCommentId: string;

  test("should create a new comment", async () => {
    const response = await request(app)
      .post("/comments")
      .send(testData)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);

    expect(response.body.text).toBe("Test comment");
    createdCommentId = response.body._id;
  });

  test("should get all comments", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Authorization", "JWT " + accessToken)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should get a comment by ID", async () => {
    const response = await request(app)
      .get(`/comments/${createdCommentId}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(200);

    expect(response.body.text).toBe("Test comment");
  });

  test("should update a comment by ID", async () => {
    const updatedData: Partial<IComment> = {
      text: "Updated comment",
    };

    await request(app)
      .put(`/comments/${createdCommentId}`)
      .send(updatedData)
      .set("Authorization", "JWT " + accessToken)
      .expect(200);

    const updatedComment = await CommentModel.findById(createdCommentId);
    expect(updatedComment?.text).toBe("Updated comment");
  });

  test("should delete a comment by ID", async () => {
    await request(app)
      .delete(`/comments/${createdCommentId}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(204);

    // Verify that the comment is deleted
    const deletedComment = await CommentModel.findById(createdCommentId);
    expect(deletedComment).toBeNull();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
