import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../app/providers/AuthProvider";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("LOGIN SUBMITTED");

    setIsLoading(true);

    try {
      console.log("Calling login...");

      await login({
        email,
        password,
      });

      console.log("Login successful");

      toast.success("Welcome back!");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to login",
      );
    } finally {
      console.log("Login finished");

      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-[var(--color-primary)] p-12 text-[var(--color-primary-foreground)] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              T.Fundi
            </div>

            <p className="mt-3 max-w-md text-sm opacity-80">
              The operating platform for modern furniture
              businesses.
            </p>
          </div>

          <div>
            <h1 className="max-w-lg text-5xl font-semibold leading-tight">
              Build, customize and manage your furniture
              business in one place.
            </h1>

            <p className="mt-6 max-w-lg text-base opacity-80">
              Manage products, customers, production and
              orders from one powerful workspace.
            </p>
          </div>

          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} T.Fundi
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-6 text-2xl font-bold lg:hidden">
                T.Fundi
              </div>

              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                Sign in to your T.Fundi account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-60"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-60"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {isLoading
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}