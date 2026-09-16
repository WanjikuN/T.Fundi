import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Loader2,
  PackageCheck,
  Palette,
  ShoppingBag,
  Sofa,
  Sparkles,
  WandSparkles,
  Factory,
  Layers3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useTenant } from "../../../app/providers/TenantProvider";

import AuthBrandPanel from "../components/AuthBrandPanel";
import AuthFormLayout from "../components/AuthFormLayout";
import AuthInput from "../components/AuthInput";
import AuthPasswordInput from "../components/AuthPasswordInput";

interface ExperienceFeature {
  label: string;
  icon: LucideIcon;
}

interface TenantExperience {
  eyebrow: string;
  headline: string;
  description: string;
  features: ExperienceFeature[];
  logoFallbackIcon: LucideIcon;
  accountLabel: string;
}

const verticalExperiences: Record<string, TenantExperience> = {
  furniture: {
    eyebrow: "Furniture",
    headline: "Discover furniture made for your space.",
    description:
      "Explore collections, visualize pieces in your space, personalize your choices and follow your order from selection to delivery.",
    features: [
      {
        label: "Explore collections",
        icon: Sofa,
      },
      {
        label: "Visualize your space",
        icon: Sparkles,
      },
      {
        label: "Personalize your choices",
        icon: Palette,
      },
      {
        label: "Track your order",
        icon: PackageCheck,
      },
    ],
    logoFallbackIcon: Sofa,
    accountLabel: "customer account",
  },

  fashion: {
    eyebrow: "Fashion",
    headline: "Find your style. Make it yours.",
    description:
      "Explore collections, discover new looks, personalize your choices and stay connected from purchase to delivery.",
    features: [
      {
        label: "Explore collections",
        icon: ShoppingBag,
      },
      {
        label: "Discover your style",
        icon: Palette,
      },
      {
        label: "Create your look",
        icon: WandSparkles,
      },
      {
        label: "Track your order",
        icon: PackageCheck,
      },
    ],
    logoFallbackIcon: ShoppingBag,
    accountLabel: "customer account",
  },

  manufacturing: {
    eyebrow: "Manufacturing",
    headline: "Bring your next project to life.",
    description:
      "Explore products, discover production possibilities, follow your project and stay connected through delivery.",
    features: [
      {
        label: "Explore products",
        icon: Boxes,
      },
      {
        label: "Follow production",
        icon: Factory,
      },
      {
        label: "Stay updated",
        icon: Layers3,
      },
      {
        label: "Track delivery",
        icon: PackageCheck,
      },
    ],
    logoFallbackIcon: Factory,
    accountLabel: "customer account",
  },

  retail: {
    eyebrow: "Retail",
    headline: "A simpler way to shop.",
    description:
      "Discover products, find what fits your needs, enjoy a seamless shopping experience and follow your order every step of the way.",
    features: [
      {
        label: "Discover products",
        icon: ShoppingBag,
      },
      {
        label: "Find what you need",
        icon: Boxes,
      },
      {
        label: "Enjoy a smarter experience",
        icon: Sparkles,
      },
      {
        label: "Track your order",
        icon: PackageCheck,
      },
    ],
    logoFallbackIcon: ShoppingBag,
    accountLabel: "customer account",
  },

  interior: {
    eyebrow: "Interior Design",
    headline: "Turn your ideas into beautiful spaces.",
    description:
      "Explore products, experiment with materials and colours, visualize your ideas and bring your finished space to life.",
    features: [
      {
        label: "Explore design ideas",
        icon: Layers3,
      },
      {
        label: "Choose materials & colours",
        icon: Palette,
      },
      {
        label: "Visualize your space",
        icon: Sparkles,
      },
      {
        label: "Track your order",
        icon: PackageCheck,
      },
    ],
    logoFallbackIcon: Layers3,
    accountLabel: "designer account",
  },

  default: {
    eyebrow: "Welcome",
    headline: "Discover a better way to experience our products.",
    description:
      "Explore products, discover what fits your needs, enjoy a personalized experience and stay connected from purchase to delivery.",
    features: [
      {
        label: "Explore products",
        icon: Boxes,
      },
      {
        label: "Discover more",
        icon: Layers3,
      },
      {
        label: "Personalized experiences",
        icon: Sparkles,
      },
      {
        label: "Track your order",
        icon: PackageCheck,
      },
    ],
    logoFallbackIcon: Boxes,
    accountLabel: "customer account",
  },
};
function getTenantExperience(verticalKey?: string): TenantExperience {
  return verticalExperiences[verticalKey ?? ""] ?? verticalExperiences.default;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { tenant, isLoading } = useTenant();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const experience = useMemo(
    () => getTenantExperience(tenant?.verticalKey),
    [tenant?.verticalKey],
  );

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
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            <Boxes className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-slate-900">
            Workspace unavailable
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            We couldn't determine which workspace you're trying to access.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      await login({
        email: email.trim(),
        password,
      });

      toast.success(`Welcome back to ${brandName}!`);

      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
        {" "}
        {/* ============================================================
            LEFT BRAND PANEL
        ============================================================ */}
        <AuthBrandPanel
          eyebrow={experience.eyebrow}
          headline={experience.headline}
          description={experience.description}
          logoFallbackIcon={experience.logoFallbackIcon}
        />
        {/* ============================================================
            RIGHT FORM
        ============================================================ */}
        <AuthFormLayout>
          <div className="mb-8">
            <p
              className="mb-2 text-sm font-semibold"
              style={{
                color: primaryColor,
              }}
            >
              Welcome back
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Sign in to your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Continue to your {brandName} workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <AuthPasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              primaryColor={primaryColor}
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold transition hover:opacity-70"
                style={{
                  color: primaryColor,
                }}
              >
                Forgot password?
              </Link>
            </div>

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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold transition hover:opacity-70"
                style={{
                  color: primaryColor,
                }}
              >
                Create account
              </Link>
            </p>
          </div>
        </AuthFormLayout>
      </div>
    </div>
  );
}
