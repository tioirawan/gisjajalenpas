import prisma from "@/libs/prismadb";
import { z } from "zod";

const changePasswordSchema = z.object({
  userId: z.number(),
  newPassword: z.string().min(6),
  newPasswordConfirmation: z.string().min(6),
});

export type ChangePasswordFormState = {
  error: Record<string, string> | null;
  success: boolean;
};

export async function changePassword(
  prevState: ChangePasswordFormState | null,
  formData: FormData
): Promise<ChangePasswordFormState> {
  console.log("change password");

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
    console.log("password not same");
    return {
      error: {
        newPasswordConfirmation: "Password tidak sama",
      },
      success: false,
    };
  }

  try {
    console.log("try change password");
    await prisma.user.update({
      where: {
        id: data.data.userId,
      },
      data: {
        password: await hash(data.data.newPassword as string, 10),
      },
    });
    console.log("success change password");
  } catch (error) {
    console.log(error);
    console.log("error change password");
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
