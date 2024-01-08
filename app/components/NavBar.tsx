"use client";

export default function NavBar() {
  return (
    <div
      className="flex flex-row justify-between items-center h-16 bg-green-800 text-white relative shadow-sm font-sans shrink-0"
      role="navigation"
    >
      <div className="px-4 cursor-pointer md:hidden">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </div>
      <div className="pr-8 md:flex hidden md:flex-row md:justify-between md:items-center">
        {/* <a className="p-4 text-" href="#"> */}
        {/* large text */}
        <a href="#" className="text-2xl font-bold p-4">
          Kab. Pasuruan
        </a>
        <a className="p-4" href="#">
          Home
        </a>
        <a className="p-4" href="#">
          Infrastruktur
        </a>
        <a className="p-4" href="#">
          Pengaduan
        </a>
      </div>
      <div className="pr-8 md:block hidden">
        <a className="p-4" href="#">
          Login
        </a>
        <a className="p-4" href="#">
          Sign Up
        </a>
      </div>
    </div>
  );
}
