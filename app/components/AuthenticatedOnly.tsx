import { useSession } from "next-auth/react";

export default function AuthenticatedOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "authenticated") {
    return <>{children}</>;
  } else {
    return null;
  }
}

export function UnauthenticatedOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status !== "authenticated") {
    return <>{children}</>;
  } else {
    return null;
  }
}
