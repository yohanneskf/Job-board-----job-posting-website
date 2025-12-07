"use client";
import { SessionProvider as Provider } from "next-auth/react";

type props = {
  children: React.ReactNode;
  session: any;
};

export default function SessionProvider({ children, session }: props) {
  return <Provider session={session}>{children}</Provider>;
}
