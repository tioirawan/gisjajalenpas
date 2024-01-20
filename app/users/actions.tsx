"use server";

import prisma from "@/libs/prismadb";
import { hash } from "bcrypt";
import { z } from "zod";

const schema = z.object({
  id: z.string().optional(),
  username: z.string().min(3),
  password: z.nullable(z.string().min(6)).optional(),
  role: z.enum(["ADMIN", "OPERATOR", "OPD"]),
});

export type CreateUserFormState = {
  error: Record<string, string> | null;
  success: boolean;
};
export async function createUser(
  prevState: CreateUserFormState | null,
  formData: FormData
): Promise<CreateUserFormState> {
  const data = schema.safeParse({
    id: formData.get("id"),
    username: formData.get("username"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!data.success) {
    return {
      error: data.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  const id = data.data.id;

  if (!id && !data.data.password) {
    return {
      error: {
        password: "Password harus diisi",
      },
      success: false,
    };
  }

  try {
    if (id) {
      await prisma.user.update({
        where: {
          id: parseInt(id as string),
        },
        data: {
          username: data.data.username,
          role: data.data.role,
        },
      });
      return {
        error: null,
        success: true,
      };
    }

    await prisma.user.create({
      data: {
        username: data.data.username,
        password: await hash(data.data.password as string, 10),
        role: data.data.role,
      },
    });
  } catch (error) {
    return {
      error: {
        username: "Username sudah digunakan",
      },
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: {
      id,
    },
  });
}
