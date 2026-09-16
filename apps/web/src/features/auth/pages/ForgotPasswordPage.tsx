import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { useTenant } from "../../../app/providers/TenantProvider";

import AuthBrandPanel from "../components/AuthBrandPanel";
import AuthFormLayout from "../components/AuthFormLayout";
import AuthInput from "../components/AuthInput";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000";

export default function ForgotPasswordPage() {
  const { tenant, isLoading } = useTenant();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const primaryColor =
    tenant?.branding?.primaryColor ?? "#111827";

  const brandName = tenant?.name ?? "Business";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          className="h-7 w-7 animate-spin"
          style={{
            color: primaryColor,
          }}
        />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Workspace unavailable
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            We couldn't determine which workspace you're trying
            to access.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
            style={{
              color: primaryColor,
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ??
            "Unable to process your request.",
        );
      }

      setSubmitted(true);

      toast.success(
        "Password reset instructions sent.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
        <AuthBrandPanel
          logoFallbackIcon={Mail}
          eyebrow="Account security"
          headline="Get back into your account."
          description="Enter your email address and we'll help you securely reset your password and get back to your workspace."
        />

        <AuthFormLayout showBackToLogin>
          {!submitted ? (
            <>
              <div className="mb-8">
                
                <p
                  className="mb-2 text-sm font-semibold"
                  style={{
                    color: primaryColor,
                  }}
                >
                  Reset your password
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Forgot your password?
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                  Enter the email address associated with
                  your account and we'll send you
                  instructions to reset your password.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <AuthInput
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  primaryColor={primaryColor}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 25px -8px ${primaryColor}80`,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    <>
                      Send reset instructions
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
                  style={{
                    color: primaryColor,
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center sm:py-10">
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${primaryColor}14`,
                  color: primaryColor,
                }}
              >
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <p
                className="mb-2 text-sm font-semibold"
                style={{
                  color: primaryColor,
                }}
              >
                Check your inbox
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Reset instructions sent
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                If an account exists for{" "}
                <span className="font-semibold text-slate-700">
                  {email}
                </span>
                , you'll receive instructions to reset
                your password.
              </p>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Check your spam or junk folder if you
                don't see the email.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="h-12 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Try another email
                </button>

                <Link
                  to="/login"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>

              <p className="mt-8 text-xs text-slate-400">
                {brandName} account security
              </p>
            </div>
          )}
        </AuthFormLayout>
      </div>
    </div>
  );
}