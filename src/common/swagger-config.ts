export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MovieBuzz REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Tokens: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "The JWT access token",
            },
            refreshToken: {
              type: "string",
              description: "The JWT refresh token",
            },
          },
          required: ["accessToken", "refreshToken"],
          example: {
            accessToken: "123cd123x1xx1",
            refreshToken: "134r2134cr1x3c",
          },
        },
        UserRegistration: {
          type: "object",
          properties: {
            fullName: {
              type: "string",
              description: "The user full name",
            },
            email: {
              type: "string",
              description: "The user email",
            },
            password: {
              type: "string",
              description: "The user password",
            },
            imageUrl: {
              type: "string",
              description: "The user image url",
            },
          },
          required: ["fullName", "email", "password", "imageUrl"],
          example: {
            fullName: "Aviv Cohen",
            email: "aviv@gmail.com",
            password: "123456",
            imageUrl: "aviv-image.jpg",
          },
        },
        UserLogin: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The user email",
            },
            password: {
              type: "string",
              description: "The user password",
            },
          },
          required: ["email", "password"],
          example: {
            email: "aviv@gmail.com",
            password: "123456",
          },
        },
        Post: {
          type: "object",
          properties: {
            ownerId: {
              type: "string",
              description: "The ID of the user who owns the post",
            },
            ownerName: {
              type: "string",
              description: "The name of the user who owns the post",
            },
            ownerImageUrl: {
              type: "string",
              description: "The image of the user who owns the post",
            },
            tmdbId: {
              type: "string",
              description: "The TMDB ID of the movie",
            },
            tmdbTitle: {
              type: "string",
              description: "The TMDB title of the movie",
            },
            tmdbImageUrl: {
              type: "string",
              description: "The TMDB image of the movie",
            },
            text: {
              type: "string",
              description: "The text content of the post",
            },
            imageUrl: {
              type: "string",
              description: "The URL of the image associated with the post",
            },
            rating: {
              type: "number",
              description: "The rating associated with the post",
            },
            numOfComments: {
              type: "number",
              description: "The number of comments on the post - by default set to 0",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time when the post was created",
            },
          },
          required: ["tmdbId", "tmdbTitle", "tmdbImageUrl", "text", "imageUrl", "rating"],
          example: {
            ownerId: "221585321",
            ownerName: "Aviv Cohen",
            ownerImage: "aviv-pic.jpg",
            tmdbId: "12345",
            tmdbTitle: "frozen",
            tmdbImageUrl: "frozen.jpg",
            text: "This is a sample post",
            imageUrl: "https://example.com/image.jpg",
            rating: 4.5,
            numOfComments: 0,
            createdAt: "2024-01-10T12:30:00Z",
          },
        },
        Comment: {
          type: "object",
          properties: {
            ownerId: {
              type: "string",
              description: "The ID of the user who owns the comment",
            },
            ownerName: {
              type: "string",
              description: "The name of the user who owns the post",
            },
            ownerImageUrl: {
              type: "string",
              description: "The image of the user who owns the post",
            },
            postId: {
              type: "string",
              description: "The ID of the post associated with the comment",
            },
            text: {
              type: "string",
              description: "The text content of the comment",
            },
          },
          required: ["postId", "text"],
          example: {
            ownerId: "221585321",
            ownerName: "Aviv Cohen",
            ownerImage: "aviv-pic.jpg",
            postId: "post456",
            text: "This is a sample comment",
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "The Authentication API" },
      { name: "Movies", description: "The Movies API" },
      { name: "TV Shows", description: "The TV Shows API" },
      { name: "Posts", description: "The Posts API" },
      { name: "Comments", description: "The Comments API" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
