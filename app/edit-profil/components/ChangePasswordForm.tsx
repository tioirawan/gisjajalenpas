"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { ChangePasswordFormState, changePassword } from "../actions";

type Props = {
  className?: string;
};

const initialState: ChangePasswordFormState = {
  error: null,
  success: false,
};

export default function ChangePasswordForm(props: Props) {
  const { data, status } = useSession();
  const [state, formAction] = useFormState(changePassword, initialState);

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>Ganti Password</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <form className="w-full" action={formAction}>
          <input
            type="hidden"
            name="userId"
            value={(data?.user as any)?.id ?? 0}
          />
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                placeholder="masukkan password baru anda"
                name="newPassword"
                type="password"
              />
            </div>{" "}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmationPassword">
                Konfirmasi Password Baru
              </Label>
              <Input
                id="confirmationPassword"
                placeholder="masukkan kondirmasi password baru anda"
                name="newPasswordConfirmation"
                type="password"
              />
            </div>
            <button
              type="submit"
              className="bg-green-800 w-fit text-white py-2 px-4 rounded-md mt-5 text-sm"
            >
              Ganti Password
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
