import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {
  model: Model<ModelType>;
  constructor(model: Model<ModelType>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    try {
      const items = await this.model.find();
      res.send(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (req.params.id) {
        const itemId = req.params.id;
        const itemById = await this.model.findById(itemId);
        res.send(itemById);
      } else {
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const itemData = req.body;
      const newItem = await this.model.create(itemData);
      res.status(201).json(newItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateById(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const updatedItem = await this.model.findByIdAndUpdate(itemId, req.body, {
        new: true,
      });
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const deletedItem = await this.model.findByIdAndDelete(itemId);
      if (!deletedItem) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseController<ModelType>(model);
};

export default createController;
