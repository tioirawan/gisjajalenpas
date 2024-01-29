"use server";

import prisma from "@/libs/prismadb";
import { hash } from "bcrypt";
import { z } from "zod";

const editProfilSchema = z.object({
  userId: z.string(),
  username: z.string().min(3),
});

const changePasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(6),
  newPasswordConfirmation: z.string().min(6),
});

export type EditProfilFormState = {
  error: Record<string, string> | null;
  success: boolean;
};

export type ChangePasswordFormState = {
  error: Record<string, string> | null;
  success: boolean;
};

export async function editProfil(
  prevState: EditProfilFormState | null,
  formData: FormData
): Promise<EditProfilFormState> {
  const data = editProfilSchema.safeParse({
    userId: formData.get("userId"),
    username: formData.get("username"),
  });

  if (!data.success) {
    return {
      error: data.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: parseInt(data.data.userId as string),
      },
      data: {
        username: data.data.username as string,
      },
    });
  } catch (error) {
    return {
      error: {
        username: "Username gagal diubah",
      },
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}

export async function changePassword(
  prevState: ChangePasswordFormState | null,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const data = changePasswordSchema.safeParse({
    userId: formData.get("userId"),
    newPassword: formData.get("newPassword"),
    newPasswordConfirmation: formData.get("newPasswordConfirmation"),
  });

  if (!data.success) {
    console.log("error change password");
    return {
      error: data.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  if (data.data.newPassword !== data.data.newPasswordConfirmation) {
    return {
      error: {
        newPasswordConfirmation: "Password tidak sama",
      },
      success: false,
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: parseInt(data.data.userId as string),
      },
      data: {
        password: await hash(data.data.newPassword as string, 10),
      },
    });
  } catch (error) {
    return {
      error: {
        newPassword: "Password gagal diubah",
      },
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}
