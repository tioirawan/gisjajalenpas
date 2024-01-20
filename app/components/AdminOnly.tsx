import { useSession } from "next-auth/react";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  if (status === "authenticated" && (data?.user as any)?.role === "ADMIN") {
    return <>{children}</>;
  } else {
    return null;
  }
}
