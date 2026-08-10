"use client";

import CountrySelectField from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import {
  COUNTRIES,
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUpForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "United States",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    const result = await signUpWithEmail(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Sign up successful");
    router.push("/");
  };

  return (
    <>
      <h1 className="form-title !my-5">Sign Up & Personalize</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 h-[100vh] flex flex-col justify-start items-center">
        <div className="h-[80%] w-full">
          <InputField
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            register={register}
            error={errors.fullName}
            validation={{ required: "Full name is required", minLength: 2 }}
          />

          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
            validation={{
              required: "Email is required",
              pattern: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
            }}
          />

          <InputField
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            register={register}
            error={errors.password}
            validation={{ required: "Password is required", minLength: 8 }}
          />

          <CountrySelectField
            name="country"
            label="Country"
            placeholder="Select your country"
            options={COUNTRIES}
            control={control}
            error={errors.country}
            required
          />

          <SelectField
            name="investmentGoals"
            label="Investment Goals"
            placeholder="Select your investment goals"
            options={INVESTMENT_GOALS}
            control={control}
            error={errors.investmentGoals}
            required
          />

          <SelectField
            name="riskTolerance"
            label="Risk Tolerance"
            placeholder="Select your risk levels"
            options={RISK_TOLERANCE_OPTIONS}
            control={control}
            error={errors.riskTolerance}
            required
          />

          <SelectField
            name="preferredIndustry"
            label="Preferred Industry"
            placeholder="Select your preferred industry"
            options={PREFERRED_INDUSTRIES}
            control={control}
            error={errors.preferredIndustry}
            required
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="yellow-btn w-full mt-5"
          >
            {isSubmitting ? "Creating Account..." : "Start your investing journey"}
          </Button>

          <FooterLink
            text="Already have an account?"
            linkText="Sign In"
            href="/sign-in"
          />
        </div>
      </form>
    </>
  );
};

export default SignUpForm;
