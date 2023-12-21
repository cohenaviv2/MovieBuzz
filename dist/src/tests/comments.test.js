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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const CommentModel_1 = __importDefault(require("../models/CommentModel"));
const BaseController_1 = __importDefault(require("../controllers/BaseController"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
}));
const createTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        name: "Test User",
        email: "test@example.com",
        age: 25,
        postsArray: [],
    };
    const response = yield (0, supertest_1.default)(app)
        .post("/users/createUser")
        .send(userData)
        .expect(201);
    return response.body._id;
});
describe("CommentController", () => {
    const commentController = (0, BaseController_1.default)(CommentModel_1.default);
    let createdCommentId;
    test("should create a new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createTestUser();
        const commentData = {
            creatorId: userId,
            text: "Test comment",
        };
        const response = yield (0, supertest_1.default)(app)
            .post("/comments/create")
            .send(commentData)
            .expect(201);
        expect(response.body.text).toBe("Test comment");
        createdCommentId = response.body._id;
    }));
    // Ensure that createTestUser has completed before proceeding
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield createTestUser();
    }));
    test("should get all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/comments/getAll")
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    test("should get a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/comments/get/${createdCommentId}`)
            .expect(200);
        expect(response.body.text).toBe("Test comment");
    }));
    test("should update a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = {
            creatorId: createdCommentId,
            text: "Updated comment",
        };
        const response = yield (0, supertest_1.default)(app)
            .put(`/comments/update/${createdCommentId}`)
            .send(updatedData)
            .expect(200);
        expect(response.body.text).toBe("Updated comment");
    }));
    test("should delete a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete(`/comments/delete/${createdCommentId}`)
            .expect(204);
        const deletedComment = yield CommentModel_1.default.findById(createdCommentId);
        expect(deletedComment).toBeNull();
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
//# sourceMappingURL=comments.test.js.map