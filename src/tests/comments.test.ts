import { Express } from "express";
import mongoose, { Types } from "mongoose";
import request from 'supertest';
import initServer from '../server';
import CommentModel, { IComment } from '../models/CommentModel';
import createController from '../controllers/BaseController';

let app: Express;

beforeAll(async () => {
  app = await initServer();
});

const testData: IComment = {
  creatorId: new Types.ObjectId(),
  text: "Test comment",
};

describe('CommentController', () => {
  const commentController = createController<IComment>(CommentModel);
  let createdCommentId: string;

  test('should create a new comment', async () => {
    const response = await request(app)
      .post('/comments/create')
      .send(testData)
      .expect(201);

    expect(response.body.text).toBe('Test comment');
    createdCommentId = response.body._id;
  });

  test('should get all comments', async () => {
    const response = await request(app)
      .get('/comments/getAll')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should get a comment by ID', async () => {
    const response = await request(app)
      .get(`/comments/get/${createdCommentId}`)
      .expect(200);

    expect(response.body.text).toBe('Test comment');
  });

  test('should delete a comment by ID', async () => {
    await request(app)
      .delete(`/comments/delete/${createdCommentId}`)
      .expect(204);

    // Verify that the comment is deleted
    const deletedComment = await CommentModel.findById(createdCommentId);
    expect(deletedComment).toBeNull();
  });
  

  afterAll(async () => {
    await mongoose.connection.close();
  });
});