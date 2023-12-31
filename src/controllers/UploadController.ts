import { Request, Response } from "express";
import path from "path";

async function uploadImage(req: Request, res: Response) {
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

async function getImage(req: Request, res: Response) {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../uploads/", filename);
  res.sendFile(filePath);
}

export default {
  uploadImage,
  getImage,
};
