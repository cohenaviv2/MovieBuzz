"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    creatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    tmdbMovieId: { type: Number, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    rate: { type: Number, required: true },
    commentsArray: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
});
const PostModel = (0, mongoose_1.model)('Post', postSchema);
exports.default = PostModel;
//# sourceMappingURL=PostModel.js.map