import { Request, Response } from 'express';
import CommentModel from '../models/Comment';

export const createComment = async (req: Request, res: Response) => {
  try {
    const commentData = req.body;
    const newComment = await CommentModel.create(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await CommentModel.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const updatedComment = await CommentModel.findByIdAndUpdate(commentId, req.body, { new: true });
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
