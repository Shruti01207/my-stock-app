"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
  try {
    const authInstance = await auth();// calling getauth
    const response = await authInstance.api.signUpEmail({ body: { email, password, name: fullName }, headers: await headers() });
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry
        }
      })
    }
    return { success: true, data: response };
  }
  catch (error: any) {
    return { success: false, error: error?.message || "An unexpected error during signup" };
  }

}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const authInstance = await auth();
    const response = await authInstance.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
    console.log("response", response);

    return { success: true, data: response };
  } catch (error: any) {
    // Better Auth errors are quite helpful
    // Common codes: "INVALID_EMAIL_OR_PASSWORD"
    console.error("Login Error:", error.code);

    return {
      success: false,
      error: error.message || "Invalid email or password"
    };
  }
};