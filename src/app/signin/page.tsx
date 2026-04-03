import { redirect } from "next/navigation";

/** Legacy URL; canonical login lives at `/login`. */
export default function SignInPage() {
  redirect("/login");
}
