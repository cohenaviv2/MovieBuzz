import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Request, Response } from "express";

const rootDirectory = path.join(__dirname, "..");

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function) {
    const targetFolder = req.params.targetFolder;

    if (targetFolder != "posts" && targetFolder != "users") {
      cb(new Error("Invalid target folder."));
    } else {
      cb(null, path.join(rootDirectory, "uploads", targetFolder));
    }
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    const itemId = uuidv4();
    const imageName = itemId + ".jpg";

    cb(null, imageName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF images are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

async function handleImageUpload(req: Request, res: Response) {
  if (req.file && req.file.filename) {
    const fileName = req.file.filename;
    const targetFolder = req.params.targetFolder;
    const UPLOADS_URL = process.env.UPLOADS_URL;
    const imageUrl = `${UPLOADS_URL}/${targetFolder}/${fileName}`;
    return res.status(201).json({ imageUrl:imageUrl });
  } else {
    return res.status(500).send({ error: "Failed to upload image." });
  }
};

export {upload, handleImageUpload};
