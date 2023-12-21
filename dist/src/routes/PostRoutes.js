"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostController_1 = __importDefault(require("../controllers/PostController"));
const router = express_1.default.Router();
router.post("/create", PostController_1.default.create.bind(PostController_1.default));
router.get("/getAll", PostController_1.default.getAll.bind(PostController_1.default));
router.get("/get/:id", PostController_1.default.getById.bind(PostController_1.default));
router.put("/update/:id", PostController_1.default.updateById.bind(PostController_1.default));
router.delete('/delete/:id', PostController_1.default.deleteById.bind(PostController_1.default));
exports.default = router;
//# sourceMappingURL=PostRoutes.js.map