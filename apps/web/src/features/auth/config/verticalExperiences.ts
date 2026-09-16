import {
  Boxes,
  Factory,
  Layers3,
  PackageCheck,
  Palette,
  ShoppingBag,
  Sofa,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ExperienceFeature {
  icon: LucideIcon;
  label: string;
}

export interface TenantExperience {
  eyebrow: string;
  headline: string;
  description: string;
  features: ExperienceFeature[];
  logoFallbackIcon: LucideIcon;
  secondaryIcons: [LucideIcon, LucideIcon];
  accountLabel: string;
  footerLabel: string;
}

export const verticalExperiences: Record<
  string,
  TenantExperience
> = {
  furniture: {
    eyebrow: "Furniture",
    headline: "Your furniture journey, all in one place.",
    description:
      "Explore products, discover materials and colors, visualize your space and keep track of your orders from one workspace.",
    features: [
      {
        icon: Sofa,
       label: "Explore the furniture collection",
      },
      {
        icon: Palette,
       label: "Discover colors and materials",
      },
      {
        icon: Sparkles,
       label: "Visualize furniture in your space",
      },
      {
        icon: PackageCheck,
       label: "Track your order and production",
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
        label: "Explore collections",
      },
      {
        icon: Palette,
        label: "Discover colors and materials",
      },
      {
        icon: WandSparkles,
        label: "Personalize your products",
      },
      {
        icon: PackageCheck,
        label: "Track your order",
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
        label: "Manage your product catalog",
      },
      {
        icon: Factory,
        label: "Manage production workflows",
      },
      {
        icon: Layers3,
        label: "Track products and operations",
      },
      {
        icon: PackageCheck,
        label: "Track orders and delivery",
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
        label: "Explore products",
      },
      {
        icon: Boxes,
        label: "Discover available collections",
      },
      {
        icon: Sparkles,
        label: "Discover personalized options",
      },
      {
        icon: PackageCheck,
        label: "Track your orders",
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
        label: "Explore design products",
      },
      {
        icon: Palette,
        label: "Discover materials and colors",
      },
      {
        icon: Sparkles,
        label: "Visualize your ideas",
      },
      {
        icon: PackageCheck,
        label: "Track projects and orders",
      },
    ],
    logoFallbackIcon: Layers3,
    secondaryIcons: [Palette, Sparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },

  default: {
    eyebrow: "Business",
    headline: "Everything you need, in one place.",
    description:
      "Explore products, manage your orders and stay connected with your business from one workspace.",
    features: [
      {
        icon: Boxes,
        label: "Explore products and services",
      },
      {
        icon: Layers3,
        label: "Discover available options",
      },
      {
        icon: Sparkles,
        label: "Discover personalized experiences",
      },
      {
        icon: PackageCheck,
        label: "Track your orders",
      },
    ],
    logoFallbackIcon: Boxes,
    secondaryIcons: [Layers3, Sparkles],
    accountLabel: "Customer account",
    footerLabel: "Powered by T.Fundi",
  },
};

export function getTenantExperience(
  verticalKey?: string,
): TenantExperience {
  if (!verticalKey) {
    return verticalExperiences.default;
  }

  return (
    verticalExperiences[verticalKey] ??
    verticalExperiences.default
  );
}