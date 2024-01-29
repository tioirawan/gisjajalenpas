import { MdLogin } from "react-icons/md";
import { UnauthenticatedOnly } from "./AuthenticatedOnly";

export default function LoginToSee() {
  return (
    <UnauthenticatedOnly>
      {/* Masuk untuk melihat detail */}
      <div className="flex flex-col justify-center items-center my-4">
        <a
          href="/api/auth/signin"
          className="text-sm font-bold text-green-500 flex items-center"
        >
          <MdLogin className="mr-4" /> Masuk untuk melihat detail
        </a>
      </div>
    </UnauthenticatedOnly>
  );
}
