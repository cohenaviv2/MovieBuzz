"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.default.Router();
router.post("/create", UserController_1.default.create.bind(UserController_1.default));
router.get("/getAll", UserController_1.default.getAll.bind(UserController_1.default));
router.get("/get/:id", UserController_1.default.getById.bind(UserController_1.default));
router.put("/update/:id", UserController_1.default.updateById.bind(UserController_1.default));
router.delete("/delete/:id", UserController_1.default.deleteById.bind(UserController_1.default));
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map