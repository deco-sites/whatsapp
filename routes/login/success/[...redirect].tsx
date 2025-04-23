import type { PageProps } from "$fresh/server.ts";
import AuthListener from "../../../islands/AuthListener.tsx";

export default function LoginSuccess(_props: PageProps) {
  return (
    <>
      <AuthListener />
    </>
  );
} 