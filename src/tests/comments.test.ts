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
  postId: "123456789",
  text: "Test comment",
};

const testUser: IUser = {
  fullName: "Test",
  email: "testUser@test.com",
  role: "user",
  password: "1234567890",
  image: "img.jpg",
  tokens: [],
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

afterAll(async () => {
  await CommentModel.deleteMany();
  await mongoose.connection.close();
});

describe("Comment tests", () => {
  test("Test create new comment", async () => {
    const response = await request(app)
      .post("/comments")
      .send(testComment)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    expect(response.body.text).toBe(testComment.text);
    expect(response.body.ownerId).toEqual(testUser._id);
    db_comment_id = response.body._id;
  });

  test("Test get all comments", async () => {
    const response = await request(app).get("/comments").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Test get comment by ID", async () => {
    const response = await request(app).get(`/comments/${db_comment_id}`).expect(200);
    expect(response.body.text).toBe(testComment.text);
    expect(response.body.postId).toEqual(testComment.postId);
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

  test("Test update comment by ID", async () => {
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

  test("Test delete comment by ID", async () => {
    await request(app)
      .delete(`/comments/${db_comment_id}`)
      .set("Authorization", "JWT " + accessToken)
      .expect(204);
    // Verify that the comment is deleted
    const deletedComment = await CommentModel.findById(db_comment_id);
    expect(deletedComment).toBeNull();
  });

  test("Test get all 2 user comments", async () => {
    // Comment 1 post
    const comments1 = testComment;
    comments1.text = "Test comments 1";
    comments1.postId = "123";
    const res1 = await request(app)
      .post("/comments")
      .send(comments1)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);
    // Comment 2 post
    const comment2 = testComment;
    comment2.text = "Test comments 2";
    comment2.postId = "456";
    const res2 = await request(app)
      .post("/comments")
      .send(comment2)
      .set("Authorization", "JWT " + accessToken)
      .expect(201);

    const response = await request(app)
      .get("/comments/find")
      .set("Authorization", "JWT " + accessToken);
    expect(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].ownerId).toBe(testUser._id);
    expect(response.body[0].text).toBe("Test comments 1");
    expect(response.body[0].postId).toBe("123");
    expect(response.body[1].ownerId).toBe(testUser._id);
    expect(response.body[1].text).toBe("Test comments 2");
    expect(response.body[1].postId).toBe("456");
  });

});
