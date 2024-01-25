"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  className?: string;
};

export default function CardUser(props: Props) {
  const { data, status } = useSession();

  return (
    <Card className={props.className}>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ui-avatars.com/api/?name=${data?.user?.name}&background=0D8ABC&color=fff`}
          alt={data?.user?.name ?? ""}
          className="w-40 h-40 rounded-full mb-6"
        />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{data?.user?.name}</span>
          <span className="text-lg flex gap-2 mt-3 text-gray-500">
            <User /> {(data?.user as any)?.role}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
