"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
};

export default function EditProfilForm(props: Props) {
  const { data, status } = useSession();
  const username = useRef("");

  useEffect(() => {
    username.current = data?.user?.name ?? "";
  }, [data]);

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>Edit Profil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <form className="w-full" action="">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="masukkan username anda"
                defaultValue={username.current}
                onChange={(e) => (username.current = e.target.value)}
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
