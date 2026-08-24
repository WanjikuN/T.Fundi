export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "T.Fundi API",
    version: "1.0.0",
    description:
      "API for the T.Fundi multi-tenant furniture commerce and operations platform.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
    {
      url: "https://tfundi.vercel.app/",
      description: "Production",
    },
  ],

  tags: [
    {
      name: "System",
      description: "API health and service information",
    },
    {
      name: "Authentication",
      description: "User authentication and identity",
    },
  ],

  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                    service: {
                      type: "string",
                      example: "t.fundi-api",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api": {
      get: {
        tags: ["System"],
        summary: "API information",
        responses: {
          "200": {
            description: "API information",
          },
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a user",
        description:
          "Creates a T.Fundi user account. Registration does not create a tenant or grant platform privileges.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
              example: {
                email: "test@example.com",
                password: "password123",
                firstName: "Test",
                lastName: "User",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterResponse",
                },
              },
            },
          },

          "400": {
            description: "Invalid registration data",
          },

          "409": {
            description: "A user with this email already exists",
          },

          "500": {
            description: "Internal server error",
          },
        },
      },
    },
  },

  components: {
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "password", "firstName", "lastName"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "test@example.com",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 8,
            example: "password123",
          },
          firstName: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            example: "Test",
          },
          lastName: {
            type: "string",
            minLength: 1,
            maxLength: 50,
            example: "User",
          },
        },
      },

      RegisterResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "User registered successfully",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },

      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          email: {
            type: "string",
            format: "email",
          },
          firstName: {
            type: "string",
          },
          lastName: {
            type: "string",
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "SUSPENDED", "DEACTIVATED"],
          },
          platformRole: {
            type: ["string", "null"],
            enum: [
              "PLATFORM_OWNER",
              "PLATFORM_ADMIN",
              "PLATFORM_OPERATIONS",
              "PLATFORM_SUPPORT",
              null,
            ],
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
    },
  },
} as const;
