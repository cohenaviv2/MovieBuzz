import express from "express";
import CommentController from "../controllers/CommentController";
import auth from "../common/auth-middleware";

const router = express.Router();

router.post("/", auth, CommentController.create.bind(CommentController));
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     description: Create a new comment on a movie post.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the movie post for which to create the comment.
 *               text:
 *                 type: string
 *                 description: The content of the comment.
 *             example:
 *               postId: "movie_post_id"
 *               text: "Great post!"
 *     responses:
 *       201:
 *         description: Successfully created a new comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       404:
 *         description: Movie post not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/", CommentController.getAll.bind(CommentController));
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: get comments from movie posts
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Successfully retrieved most-commented posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/user/:id", CommentController.getUserComments.bind(CommentController)); // get all comments by userId given
/**
 * @swagger
 * /comments/user/{id}:
 *   get:
 *     summary: Get comments by user ID
 *     tags: [Comments]
 *     description: Retrieve comments posted by a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user for whom to retrieve comments.
 *     responses:
 *       200:
 *         description: Successfully retrieved comments for the user.
 *       404:
 *         description: No comments found.
 */
router.get("/post/:id", CommentController.getPostComments.bind(CommentController)); // get all comments by postId given
/**
 * @swagger
 * /comments/post/{id}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     description: Retrieve comments for a specific post.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post for which to retrieve comments.
 *     responses:
 *       200:
 *         description: Successfully retrieved comments for the post.
 *       404:
 *         description: Post has no comments.
 */
router.get("/find", auth, CommentController.find.bind(CommentController));
router.get("/:id", CommentController.getById.bind(CommentController));
router.put("/:id", auth, CommentController.updateById.bind(CommentController));
router.delete("/:id", auth, CommentController.deleteById.bind(CommentController));

export default router;
