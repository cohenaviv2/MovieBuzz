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
const supertest_1 = __importDefault(require("supertest"));
const yourExpressApp_1 = __importDefault(require("../yourExpressApp")); // Import your Express app
// Assuming you have your app initialized with Express and controllers
describe('Comment Controller', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Setup: Connect to a test database or perform any other necessary setup
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Teardown: Disconnect from the test database or perform cleanup
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Optionally, you can seed the test database with some data
    }));
    it('should create a new comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(yourExpressApp_1.default)
            .post('/api/comments')
            .send({ creatorId: 'userId', text: 'Test comment' });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        // Add more assertions based on your data model
    }));
    it('should get all comments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(yourExpressApp_1.default).get('/api/comments');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        // Add more assertions based on your data model
    }));
    // Add more tests for other CRUD operations
});
//# sourceMappingURL=commentTest.js.map