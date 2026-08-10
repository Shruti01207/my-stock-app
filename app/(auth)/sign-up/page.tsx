import SignUpForm from "@/components/forms/SignUpForm";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const authInstance = await auth();
  const session = await authInstance.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <SignUpForm />;
};

export default SignUpPage;
