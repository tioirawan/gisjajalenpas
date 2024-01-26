"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import AuthenticatedOnly from "./AuthenticatedOnly";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function NavBar() {
  const { data, status } = useSession();

  let currentPath = "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      currentPath = window.location.pathname;
    }
  }, []);

  return (
    <div
      className="flex flex-row justify-between items-center h-16 bg-green-800 text-white relative shadow-sm font-sans shrink-0"
      role="navigation"
    >
      <div className="md:hidden flex flex-row items-center ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[500]">
            <DropdownMenuItem>
              <a href="/">Home</a>
            </DropdownMenuItem>
            <AuthenticatedOnly>
              <DropdownMenuItem>
                <a href="/statistik">Statistik</a>
              </DropdownMenuItem>
            </AuthenticatedOnly>
            {(data?.user as any)?.role === "ADMIN" && (
              <DropdownMenuItem>
                <a href="/users">Akun</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="/" className="text-xl font-bold p-6 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-8 mr-2" />
          Kab. Pasuruan
        </a>
      </div>

      <div className="pr-8 md:flex hidden md:flex-row md:justify-between md:items-center">
        <a href="/" className="text-xl font-bold p-6 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-8 mr-2" />
          Kab. Pasuruan
        </a>
        <a
          className={`p-4 ${
            currentPath === "/"
              ? "font-bold text-md text-white"
              : "text-sm text-gray-300"
          }`}
          href="/"
        >
          Home
        </a>
        <a
          className={`p-4 ${
            currentPath === "/laporan"
              ? "font-bold text-md text-white"
              : "text-sm text-gray-300"
          }`}
          href="/laporan"
        >
          Laporan
        </a>
        <AuthenticatedOnly>
          <a
            className={`p-4 ${
              currentPath === "/statistik"
                ? "font-bold text-md text-white"
                : "text-sm text-gray-300"
            }`}
            href="/statistik"
          >
            Statistik
          </a>
        </AuthenticatedOnly>
        <a
          className={`p-4 ${"text-sm text-gray-300"}`}
          href="https://www.lapor.go.id/"
          target="_blank"
        >
          Pengaduan
        </a>
        {(data?.user as any)?.role === "ADMIN" && (
          <a
            className={`p-4 ${
              currentPath === "/users"
                ? "font-bold text-md text-white"
                : "text-sm text-gray-300"
            }`}
            href="/users"
          >
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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[500]">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Profil</DropdownMenuItem>
              <DropdownMenuItem>Ganti Password</DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/api/auth/signout">Keluar</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
