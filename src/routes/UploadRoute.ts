import express from "express";
import auth from "../common/auth-middleware";
import { upload, handleImageUpload } from "../common/multer-config";

const router = express.Router();

router.post("/upload/:targetFolder", auth, upload.single("image"), handleImageUpload);

export default router;
