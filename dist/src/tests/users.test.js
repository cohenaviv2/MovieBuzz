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
const UserModel_1 = __importDefault(require("../models/UserModel"));
const BaseController_1 = __importDefault(require("../controllers/BaseController"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
}));
describe("UserController", () => {
    const userController = (0, BaseController_1.default)(UserModel_1.default);
    let createdUserId;
    test("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
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
        expect(response.body.name).toBe("Test User");
        createdUserId = response.body._id;
    }));
    test("should get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/getAllUsers").expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    test("should get a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/users/getUser/${createdUserId}`)
            .expect(200);
        expect(response.body.name).toBe("Test User");
    }));
    test("should update a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = {
            name: "Updated User",
            email: "updated@example.com",
            age: 30,
            postsArray: [],
        };
        const response = yield (0, supertest_1.default)(app)
            .put(`/users/updateUser/${createdUserId}`)
            .send(updatedData)
            .expect(200);
        expect(response.body.name).toBe("Updated User");
        expect(response.body.email).toBe("updated@example.com");
        expect(response.body.age).toBe(30);
    }));
    test("should delete a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).delete(`/users/deleteUser/${createdUserId}`).expect(204);
        const deletedUser = yield UserModel_1.default.findById(createdUserId);
        expect(deletedUser).toBeNull();
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
//# sourceMappingURL=users.test.js.map