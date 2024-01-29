"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { EditProfilFormState, editProfil } from "../actions";

type Props = {
  className?: string;
};

const initialState: EditProfilFormState = {
  error: null,
  success: false,
};

export default function EditProfilForm(props: Props) {
  const { data, status, update } = useSession();

  const [state, formAction] = useFormState(editProfil, initialState);

  useEffect(() => {
    if (state.success) {
      (async () => {
        await update();
        window.location.reload();
      })();
    }
  }, [state.success]);

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>Edit Profil</CardTitle>
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
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="masukkan username anda"
                defaultValue={data?.user?.name ?? ""}
                name="username"
              />
            </div>
            <button
              type="submit"
              className="bg-green-800 w-fit text-white py-2 px-4 rounded-md mt-5 text-sm"
            >
              Ubah Profil
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
