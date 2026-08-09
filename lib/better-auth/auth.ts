import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

// callback function so, getAuth means we are passing the function to get
// authentication session
export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectToDatabase();

  if (!mongoose) throw new Error("Could not connect to database");

  const db = mongoose.connection.db;

  if (!db) throw new Error("MongoDB Connection not found`");

  authInstance = betterAuth({
    database: mongodbAdapter(db as any),
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: ["localhost:3000", "*vercel.app"],
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    plugins: [
      nextCookies(),
    ],
  });

  return authInstance;
};

// auth is a reference to getAuth, creating an alias
export const auth = getAuth;
