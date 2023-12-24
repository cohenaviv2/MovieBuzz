import { Express } from "express";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import initServer from "../server";
import CommentModel, { IComment } from "../models/CommentModel";
import createController from "../controllers/BaseController";
import UserModel from "../models/UserModel";
import { testUser } from "./auth.test";

let app: Express;
let accessToken:string;

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

describe("CommentController", () => {
  const commentController = createController<IComment>(CommentModel);
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
