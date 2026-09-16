import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Sofa,
  Palette,
  PackageCheck,
  Boxes,
  ArrowRight,
  ShoppingBag,
  Factory,
  Layers3,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useTenant } from "../../../app/providers/TenantProvider";

interface ExperienceFeature {
  icon: LucideIcon;
  text: string;
}

interface TenantExperience {
  eyebrow: string;
  headline: string;
  description: string;
  features: ExperienceFeature[];
  logoFallbackIcon: LucideIcon;
  secondaryIcons: [LucideIcon, LucideIcon];
  accountLabel: string;
  footerLabel: string;
}

/**
 * Frontend experience registry.
 *
 * This keeps vertical-specific presentation out of the LoginPage.
 *
 * The backend can eventually provide the vertical key,
 * while the frontend controls how that vertical is presented.
 */
const verticalExperiences: Record<string, TenantExperience> = {
  furniture: {
    eyebrow: "Furniture",
    headline: "Your furniture journey, all in one place.",
    description:
      "Explore products, discover materials and colors, visualize your space and keep track of your orders from one workspace.",
    features: [
      {
        icon: Sofa,
        text: "Explore the furniture collection",
      },
      {
        icon: Palette,
        text: "Discover colors and materials",
      },
      {
        icon: Sparkles,
        text: "Visualize furniture in your space",
      },
      {
        icon: PackageCheck,
        text: "Track your order and production",
      },
    ],
    logoFallbackIcon: Sofa,
    secondaryIcons: [Palette, Sparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },

  fashion: {
    eyebrow: "Fashion",
    headline: "Discover, personalize and order your style.",
    description:
      "Explore collections, discover materials and colors, personalize products and manage your orders from one workspace.",
    features: [
      {
        icon: ShoppingBag,
        text: "Explore collections",
      },
      {
        icon: Palette,
        text: "Discover colors and materials",
      },
      {
        icon: WandSparkles,
        text: "Personalize your products",
      },
      {
        icon: PackageCheck,
        text: "Track your order",
      },
    ],
    logoFallbackIcon: ShoppingBag,
    secondaryIcons: [Palette, WandSparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },

  manufacturing: {
    eyebrow: "Manufacturing",
    headline: "Manage your products and operations in one place.",
    description:
      "Manage your product catalog, production workflows, orders and customers from one connected workspace.",
    features: [
      {
        icon: Boxes,
        text: "Manage your product catalog",
      },
      {
        icon: Factory,
        text: "Manage production workflows",
      },
      {
        icon: Layers3,
        text: "Track products and operations",
      },
      {
        icon: PackageCheck,
        text: "Track orders and delivery",
      },
    ],
    logoFallbackIcon: Factory,
    secondaryIcons: [Boxes, Layers3],
    accountLabel: "Business account",
    footerLabel: "Powered by T.Fundi",
  },

  retail: {
    eyebrow: "Retail",
    headline: "Everything your customers need, in one place.",
    description:
      "Explore products, manage orders and stay connected with your favorite businesses from one workspace.",
    features: [
      {
        icon: ShoppingBag,
        text: "Explore products",
      },
      {
        icon: Boxes,
        text: "Discover available collections",
      },
      {
        icon: Sparkles,
        text: "Discover personalized options",
      },
      {
        icon: PackageCheck,
        text: "Track your orders",
      },
    ],
    logoFallbackIcon: ShoppingBag,
    secondaryIcons: [Boxes, Sparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },

  interior: {
    eyebrow: "Interior Design",
    headline: "Bring your spaces and ideas together.",
    description:
      "Discover products, materials and design options while managing projects and orders from one workspace.",
    features: [
      {
        icon: Layers3,
        text: "Explore design products",
      },
      {
        icon: Palette,
        text: "Discover materials and colors",
      },
      {
        icon: Sparkles,
        text: "Visualize your ideas",
      },
      {
        icon: PackageCheck,
        text: "Track projects and orders",
      },
    ],
    logoFallbackIcon: Layers3,
    secondaryIcons: [Palette, Sparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },

  /**
   * Generic experience.
   *
   * This is NOT T.Fundi.
   * It exists so a future vertical can render safely
   * before we add a dedicated experience configuration.
   */
  default: {
    eyebrow: "Business",
    headline: "Everything you need, in one place.",
    description:
      "Explore products, manage your orders and stay connected with your business from one workspace.",
    features: [
      {
        icon: Boxes,
        text: "Explore products and services",
      },
      {
        icon: Layers3,
        text: "Discover available options",
      },
      {
        icon: Sparkles,
        text: "Discover personalized experiences",
      },
      {
        icon: PackageCheck,
        text: "Track your orders",
      },
    ],
    logoFallbackIcon: Boxes,
    secondaryIcons: [Layers3, Sparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },
};

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    tenant,
    isLoading: isTenantLoading,
  } = useTenant();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /*
   * TenantProvider is responsible for resolving the tenant
   * from the current URL.
   *
   * LoginPage does not decide which tenant should be used.
   */
  const experience = useMemo(() => {
    const verticalKey = tenant?.verticalKey ?? "default";

    return (
      verticalExperiences[verticalKey] ??
      verticalExperiences.default
    );
  }, [tenant]);

  /*
   * All tenant-facing visual configuration comes from the
   * resolved tenant.
   */
  const brandName = tenant?.name ?? "Business";

  const primaryColor =
    tenant?.branding.primaryColor ??
    "var(--color-primary)";

  const primaryForeground =
    tenant?.branding.primaryForeground ??
    "var(--color-primary-foreground)";

  const backgroundColor =
    tenant?.branding.backgroundColor ??
    "var(--color-background)";

  const foregroundColor =
    tenant?.branding.foregroundColor ??
    "var(--color-foreground)";

  const mutedForeground =
    tenant?.branding.mutedForeground ??
    "var(--color-muted-foreground)";

  const LogoFallbackIcon = experience.logoFallbackIcon;

  const [SecondaryIcon, TertiaryIcon] =
    experience.secondaryIcons;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await login({
        email,
        password,
      });

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
      setIsLoading(false);
    }
  }

  /*
   * Do not render the tenant experience until the URL
   * has been resolved to a tenant.
   */
  if (isTenantLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor,
          color: foregroundColor,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: primaryColor,
              color: primaryForeground,
            }}
          >
            <Loader2
              size={22}
              className="animate-spin"
            />
          </div>

          <p
            className="text-sm"
            style={{
              color: mutedForeground,
            }}
          >
            Preparing your workspace...
          </p>
        </div>
      </main>
    );
  }

  /*
   * If tenant resolution has completed but no tenant exists,
   * this should be treated as a routing/configuration problem.
   *
   * We deliberately do NOT silently turn this into T.Fundi.
   */
  if (!tenant) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6"
        style={{
          backgroundColor,
          color: foregroundColor,
        }}
      >
        <div className="w-full max-w-md text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: primaryColor,
              color: primaryForeground,
            }}
          >
            <Boxes size={28} />
          </div>

          <h1 className="text-2xl font-semibold">
            Workspace unavailable
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{
              color: mutedForeground,
            }}
          >
            We could not find a business workspace for this
            address. Please check the URL and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen overflow-hidden"
      style={{
        backgroundColor,
        color: foregroundColor,
      }}
    >
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
        {/* =====================================================
            LEFT BRAND / EXPERIENCE PANEL
        ====================================================== */}

        <section
          className="relative hidden overflow-hidden p-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:p-14"
          style={{
            backgroundColor: primaryColor,
            color: primaryForeground,
          }}
        >
          {/* Decorative background */}

          <div
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border"
            style={{
              borderColor: `${primaryForeground}20`,
            }}
          />

          <div
            className="pointer-events-none absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full border"
            style={{
              borderColor: `${primaryForeground}15`,
            }}
          />

          {/* Brand */}

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              {tenant.branding.logoUrl ? (
                <img
                  src={tenant.branding.logoUrl}
                  alt={`${brandName} logo`}
                  className="h-11 w-11 rounded-xl object-contain"
                />
              ) : (
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${primaryForeground}15`,
                  }}
                >
                  <LogoFallbackIcon size={21} />
                </div>
              )}

              <div>
                <p className="text-xl font-bold tracking-tight">
                  {brandName}
                </p>

                <p className="text-xs opacity-60">
                  {experience.eyebrow}
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}

          <div className="relative z-10 max-w-2xl">
            {/* Dynamic visual */}

            <div className="relative mb-10 flex h-48 items-center justify-center">
              <div
                className="absolute h-44 w-44 rounded-full blur-3xl"
                style={{
                  backgroundColor: `${primaryForeground}18`,
                }}
              />

              <div
                className="relative flex h-36 w-36 rotate-[-4deg] items-center justify-center rounded-[2rem] border backdrop-blur-sm transition-transform duration-500 hover:rotate-0"
                style={{
                  borderColor: `${primaryForeground}25`,
                  backgroundColor: `${primaryForeground}10`,
                }}
              >
                <LogoFallbackIcon
                  size={58}
                  strokeWidth={1.3}
                />

                {/* Secondary capability */}

                <div
                  className="absolute -right-5 -top-5 flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-2xl border"
                  style={{
                    borderColor: `${primaryForeground}20`,
                    backgroundColor: `${primaryForeground}12`,
                  }}
                >
                  <SecondaryIcon size={21} />
                </div>

                {/* Third capability */}

                <div
                  className="absolute -bottom-4 -left-5 flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl border"
                  style={{
                    borderColor: `${primaryForeground}20`,
                    backgroundColor: `${primaryForeground}12`,
                  }}
                >
                  <TertiaryIcon size={20} />
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] opacity-65">
              {experience.eyebrow}
            </p>

            <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] xl:text-5xl">
              {experience.headline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 opacity-72">
              {experience.description}
            </p>

            {/* Dynamic features */}

            <div className="mt-8 space-y-3">
              {experience.features.map(
                ({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-sm opacity-80"
                  >
                    <Icon size={17} />
                    <span>{text}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="relative z-10 flex items-center justify-between text-xs opacity-55">
            <span>
              © {new Date().getFullYear()} T.Fundi
            </span>

            <span>{experience.footerLabel}</span>
          </div>
        </section>

        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile branding */}

            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                {tenant.branding.logoUrl ? (
                  <img
                    src={tenant.branding.logoUrl}
                    alt={`${brandName} logo`}
                    className="h-10 w-10 rounded-xl object-contain"
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: primaryColor,
                      color: primaryForeground,
                    }}
                  >
                    <LogoFallbackIcon size={20} />
                  </div>
                )}

                <div>
                  <p className="text-xl font-bold">
                    {brandName}
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: mutedForeground,
                    }}
                  >
                    {experience.eyebrow}
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                />

                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: mutedForeground,
                  }}
                >
                  {experience.accountLabel}
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p
                className="mt-2 text-sm leading-6"
                style={{
                  color: mutedForeground,
                }}
              >
                Sign in to continue to your{" "}
                {brandName} account.
              </p>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}

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
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium hover:underline"
                    style={{
                      color: primaryColor,
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 transition hover:text-gray-700 disabled:opacity-50"
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

              {/* Submit */}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryForeground,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Customer registration */}

            <p
              className="mt-8 text-center text-sm"
              style={{
                color: mutedForeground,
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{
                  color: primaryColor,
                }}
              >
                Create one
              </Link>
            </p>

            {/* Footer */}

            <div
              className="mt-10 border-t pt-6 text-center text-xs"
              style={{
                borderColor: `${primaryColor}15`,
                color: mutedForeground,
              }}
            >
              {experience.footerLabel}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}