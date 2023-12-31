import multer, { Multer } from "multer";
import path from "path";
import util from "util";
import { Request, Response } from "express";
import { ImageRequest } from "../controllers/PostController";

const storage = multer.diskStorage({
  destination: function (req: ImageRequest, file, cb) {
    const targetFolder = "/uploads" + req.targetFolder;
    cb(null, targetFolder);
  },
  filename: function (req: ImageRequest, file, cb) {
    const fileName = req.fileName;
    cb(null, fileName);
  },
});

const upload: Multer = multer({ storage: storage });

export const uploadImage = util.promisify(upload.single("image"));

export function getImage(req: Request, res: Response) {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../uploads/", filename);
  res.sendFile(filePath);
}