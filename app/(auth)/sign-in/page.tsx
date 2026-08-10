import SignInForm from "@/components/forms/SignInForm";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignInPage = async () => {

  const authInstance = await auth()// intializing and retrieve the intial better auth server instance
  const session = await authInstance.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }

  return <SignInForm />;
}

export default SignInPage