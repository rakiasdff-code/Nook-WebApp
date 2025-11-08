import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to home page (you can change this to /login if user is not authenticated)
  redirect("/home");
}

