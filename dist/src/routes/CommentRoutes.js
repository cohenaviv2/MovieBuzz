"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CommentController_1 = __importDefault(require("../controllers/CommentController"));
const router = express_1.default.Router();
router.post('/create', CommentController_1.default.create.bind(CommentController_1.default));
router.get("/getAll", CommentController_1.default.getAll.bind(CommentController_1.default));
router.get("/get/:id", CommentController_1.default.getById.bind(CommentController_1.default));
router.put("/update/:id", CommentController_1.default.updateById.bind(CommentController_1.default));
router.delete('/delete/:id', CommentController_1.default.deleteById.bind(CommentController_1.default));
exports.default = router;
//# sourceMappingURL=CommentRoutes.js.map