"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentById = exports.getAllComments = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentData = req.body;
        const newComment = yield Comment_1.default.create(commentData);
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createComment = createComment;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.default.find();
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllComments = getAllComments;
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCommentById = getCommentById;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        const updatedComment = yield Comment_1.default.findByIdAndUpdate(commentId, req.body, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(updatedComment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        const deletedComment = yield Comment_1.default.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=commentController.js.map