import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import initServer from "../server";
import UserModel, { IUser } from "../models/UserModel";
import CommentModel, { IComment } from "../models/CommentModel";

let app: Express;
let accessToken: string;
let db_comment_id: string;

const testComment: IComment = {
  ownerId: "GOING_TO_BE_REPLACED_ID",
  text: "Test comment",
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
  await CommentModel.deleteMany();
  const res1 = await request(app).post("/auth/register").send(testUser);
  testUser._id = res1.body._id;
  const res2 = await request(app).post("/auth/login").send(testUser);
  accessToken = res2.body.accessToken;
});

describe("Comment tests", () => {
  let createdCommentId: string;

  test("should create a new comment", async () => {
    const response = await request(app)
      .post("/comments")
      .send(testComment)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    expect(response.body.text).toBe(testComment.text);
    expect(response.body.ownerId).toEqual(testUser._id);
    db_comment_id = response.body._id;
  });

  test("should get all comments", async () => {
    const response = await request(app).get("/comments").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should get a comment by ID", async () => {
    const response = await request(app).get(`/comments/${db_comment_id}`).expect(200);
    expect(response.body.text).toBe(testComment.text);
  });

    test("Test Get All comments with one comment in DB", async () => {
      const response = await request(app)
        .get("/comments")
        .set("Authorization", "JWT " + accessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      const rc = response.body[0];
      expect(rc.text).toBe(testComment.text);
      expect(rc.ownerId).toBe(testUser._id);
    });

  test("should update a comment by ID", async () => {
    const updatedData: Partial<IComment> = {
      text: "Updated comment",
    };
    const response = await request(app)
      .put(`/comments/${db_comment_id}`)
      .send(updatedData)
      .set("Authorization", "JWT " + accessToken)
      .expect(200);
    expect(response.body.ownerId).toBe(testUser._id);
    const updatedComment = await CommentModel.findById(db_comment_id);
    expect(updatedComment?.text).toBe(updatedData.text);
  });

  test("should delete a comment by ID", async () => {
    await request(app)
      .delete(`/comments/${db_comment_id}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(204);
    // Verify that the comment is deleted
    const deletedComment = await CommentModel.findById(db_comment_id);
    expect(deletedComment).toBeNull();
  });

  afterAll(async () => {
    await CommentModel.deleteMany();
    await mongoose.connection.close();
  });
});
