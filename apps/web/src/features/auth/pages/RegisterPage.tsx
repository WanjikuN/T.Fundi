import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useTenant } from "../../../app/providers/TenantProvider";

import AuthBrandPanel from "../components/AuthBrandPanel";
import AuthFormLayout from "../components/AuthFormLayout";
import AuthInput from "../components/AuthInput";
import AuthPasswordInput from "../components/AuthPasswordInput";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();
  const { tenant, isLoading } = useTenant();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const brandName = tenant?.name ?? "Business";

  const primaryColor = tenant?.branding?.primaryColor ?? "#111827";

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
            We couldn't determine which workspace you're trying to access.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
            style={{
              color: primaryColor,
            }}
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      toast.success(`Your ${brandName} account has been created.`);

      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
        <AuthBrandPanel
          logoFallbackIcon={Building2}
          eyebrow="Create your account"
          headline="Your workspace starts here."
          description={`Create your account and get access to the tools, products, orders and experiences available in ${brandName}.`}
        />

        <AuthFormLayout showBackToLogin>
          <div className="mb-7">
            <p
              className="mb-2 text-sm font-semibold"
              style={{
                color: primaryColor,
              }}
            >
              Create account
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Get started
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Create your account to continue to your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <AuthInput
                id="firstName"
                label="First name"
                value={firstName}
                onChange={setFirstName}
                placeholder="Patricia"
                autoComplete="given-name"
                primaryColor={primaryColor}
                required
              />

              <AuthInput
                id="lastName"
                label="Last name"
                value={lastName}
                onChange={setLastName}
                placeholder="Njoroge"
                autoComplete="family-name"
                primaryColor={primaryColor}
                required
              />
            </div>

            <AuthInput
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              primaryColor={primaryColor}
              required
            />

            <AuthPasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              primaryColor={primaryColor}
              autoComplete="new-password"
            />

            <AuthPasswordInput
              id="confirmPassword"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((current) => !current)}
              primaryColor={primaryColor}
              autoComplete="new-password"
            />

            <p className="text-xs leading-5 text-slate-400">
              Your password should contain at least 8 characters.
            </p>

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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold transition hover:opacity-70"
                style={{
                  color: primaryColor,
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </AuthFormLayout>
      </div>
    </div>
  );
}
