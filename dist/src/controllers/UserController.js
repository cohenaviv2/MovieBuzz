"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
const BaseController_1 = __importDefault(require("./BaseController"));
const commentController = (0, BaseController_1.default)(UserModel_1.default);
exports.default = commentController;
//# sourceMappingURL=UserController.js.map