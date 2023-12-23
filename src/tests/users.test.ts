// import { Express } from "express";
// import mongoose, { Types } from "mongoose";
// import request from "supertest";
// import initServer from "../server";
// import UserModel, { IUser } from "../models/UserModel";
// import createController from "../controllers/BaseController";

// let app: Express;

// beforeAll(async () => {
//   app = await initServer();
// });

// const testData: IUser = {
//   name: "Test User",
//   email: "testuser@example.com",
//   image: "profile.jpg",
//   posts: [],
// };


// describe("UserController", () => {
//   // Create an instance of BaseController for UserModel
//   const userController = createController<IUser>(UserModel);
//   let createdUserId: string;

//   test("should create a new user", async () => {
//     const response = await request(app)
//       .post("/users/create")
//       .send(testData)
//       .expect(201);

//     expect(response.body.name).toBe("Test User");
//     createdUserId = response.body._id;
//   });

//   test("should get all users", async () => {
//     const response = await request(app).get("/users/getAll").expect(200);

//     expect(Array.isArray(response.body)).toBe(true);
//   });

//   test("should get a user by ID", async () => {
//     const response = await request(app)
//       .get(`/users/get/${createdUserId}`)
//       .expect(200);

//     expect(response.body.name).toBe("Test User");
//   });

//   test("should delete a user by ID", async () => {
//     await request(app).delete(`/users/delete/${createdUserId}`).expect(204);

//     // Verify that the user is deleted
//     const deletedUser = await UserModel.findById(createdUserId);
//     expect(deletedUser).toBeNull();
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });
// });
