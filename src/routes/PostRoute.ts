import express from "express";
import PostController from "../controllers/PostController";
import auth from "../common/auth-middleware";

const router = express.Router();

router.post("/", auth, PostController.create.bind(PostController));
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tmdbId:
 *                 type: string
 *                 description: The TMDB ID of the movie.
 *               text:
 *                 type: string
 *                 description: The content of the comment.
 *               rating:
 *                 type: number
 *                 description: The rating associated with the post.
 *               imageUrl:
 *                 type: string
 *                 description: The URL of the image associated with the post.
 *             example:
 *               tmdbId: "12345"
 *               text: "This is a sample post"
 *               rating: 4.5
 *               imageUrl: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: The post was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized. Authentication failed.
 *       500:
 *         description: Internal Server Error
 */
router.get("/", PostController.getAll.bind(PostController));
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/find", auth, PostController.find.bind(PostController));
router.get("/recent", PostController.getByRecency.bind(PostController));
/**
 * @swagger
 * /posts/recent:
 *   get:
 *     summary: Retrieve recent posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successfully retrieved recent posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/top-rated", PostController.getByTopRated.bind(PostController));
/**
 * @swagger
 * /posts/top-rated:
 *   get:
 *     summary: Retrieve top-rated posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successfully retrieved top-rated posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/most-commented", PostController.getByMostCommented.bind(PostController));
/**
 * @swagger
 * /posts/most-commented:
 *   get:
 *     summary: Retrieve most-commented posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successfully retrieved most-commented posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/search", PostController.search.bind(PostController));
router.get("/:id", PostController.getById.bind(PostController));
router.put("/:id", auth, PostController.updateById.bind(PostController));
router.delete("/:id", auth, PostController.deleteById.bind(PostController));

export default router;
