import { Request, Response } from 'express';
import PostModel from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    const newPost = await PostModel.create(postData);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
