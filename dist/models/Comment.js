"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    creatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
});
const CommentModel = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = CommentModel;
//# sourceMappingURL=Comment.js.map