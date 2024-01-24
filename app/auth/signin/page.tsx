"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn("credentials", {
      username: "admin",
      password: "admin",
      redirect: false,
      //   callbackUrl: "localhost:3000/",
    });
  };

  return (
    <main className="bg-auth flex justify-center items-center py-8 px-8 md:py-12 md:px-36 bg-green-800">
      <Card className="h-full w-full rounded-3xl">
        <CardContent className="flex gap-6 p-0 h-full">
          <div className="basis-1/2 h-full bg-card-auth rounded-s-3xl p-8 lg:flex flex-col justify-center items-center hidden">
            <img src="/logo.png" className="xl:w-48 lg:w-24" alt="" />
            <h4 className="mt-8 font-bold text-2xl xl:text-4xl">
              GISJAJALENPAS
            </h4>
            <p>GIS Jaringan Jalan Kabupaten Pasuruan</p>
          </div>
          <div className="basis-full lg:basis-1/2 py-8 px-6 flex flex-col justify-center">
            <div className="lg:hidden flex flex-col justify-center items-center mb-6">
              <img src="/logo.png" className="w-16 sm:w-24" alt="" />
              <h4 className="mt-8 font-bold text-xl sm:text-2xl">
                GISJAJALENPAS
              </h4>
              <p className="text-[.8rem] sm:text-base">
                GIS Jaringan Jalan Kabupaten Pasuruan
              </p>
            </div>
            <h4 className="font-bold text-3xl md:text-[3rem]">Masuk</h4>
            <p className="text-[.8rem] sm:text-base">
              Silakan masukkan username dan password untuk memasuki akun anda.
            </p>

            <form onSubmit={onSubmit} className="mt-8" action="">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Username</Label>
                  <Input
                    id="name"
                    placeholder="masukkan username anda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Password</Label>
                  <Input
                    id="name"
                    type="password"
                    placeholder="masukkan password anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-800 text-white py-2 px-4 rounded-md mt-5"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
