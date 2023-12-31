import { Request, Response } from "express";

async function create(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Send a success response
    res.send("File uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export default {
  create,
};
