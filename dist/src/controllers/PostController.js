"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostModel_1 = __importDefault(require("../models/PostModel"));
const BaseController_1 = __importDefault(require("./BaseController"));
const commentController = (0, BaseController_1.default)(PostModel_1.default);
exports.default = commentController;
//# sourceMappingURL=PostController.js.map