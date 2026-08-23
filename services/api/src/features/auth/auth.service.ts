import { prisma } from "../../config/prisma.js";
import { hashPassword } from "./password.js";
import type { RegisterInput } from "./auth.schemas.js";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      platformRole: true,
      createdAt: true,
    },
  });

  return user;
}