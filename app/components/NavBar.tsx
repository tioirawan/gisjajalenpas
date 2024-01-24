"use client";

import { useSession } from "next-auth/react";
import AuthenticatedOnly from "./AuthenticatedOnly";

export default function NavBar() {
  const { data, status } = useSession();

  return (
    <div
      className="flex flex-row justify-between items-center h-16 bg-green-800 text-white relative shadow-sm font-sans shrink-0"
      role="navigation"
    >
      <div className="pr-8 md:flex hidden md:flex-row md:justify-between md:items-center">
        <a href="/" className="text-xl font-bold p-6 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-8 mr-2" />
          Kab. Pasuruan
        </a>
        <a className="p-4" href="/">
          Home
        </a>
        <AuthenticatedOnly>
          <a className="p-4" href="/laporan">
            Laporan
          </a>
        </AuthenticatedOnly>
        <AuthenticatedOnly>
          <a className="p-4" href="/statistik">
            Statistik
          </a>
        </AuthenticatedOnly>
        {(data?.user as any)?.role === "ADMIN" && (
          <a className="p-4" href="/users">
            Akun
          </a>
        )}
      </div>
      {/* <div className="pr-8 md:block hidden">
        <a className="p-4" href="#">
          Login
        </a>
        <a className="p-4" href="#">
          Sign Up
        </a>
      </div> */}

      {status === "authenticated" && (
        <div className="flex flex-row items-center ml-auto md:mr-8 mr-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{data?.user?.name}</span>
            <span className="text-xs">{(data?.user as any)?.role}</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ui-avatars.com/api/?name=${data?.user?.name}&background=0D8ABC&color=fff`}
            alt={data?.user?.name ?? ""}
            className="w-10 h-10 rounded-full ml-2"
          />

          <div className="flex flex-row items-center">
            <a href="/api/auth/signout" className="p-4">
              Logout
            </a>
          </div>
        </div>
      )}

      {status === "unauthenticated" && (
        <div className="flex flex-row items-center">
          <a href="/api/auth/signin" className="p-4">
            Login
          </a>
        </div>
      )}
    </div>
  );
}
