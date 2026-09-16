import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useTenant } from "../../../app/providers/TenantProvider";

interface ExperienceFeature {
  icon: LucideIcon;
  label: string;
}

interface AuthBrandPanelProps {
  eyebrow: string;
  headline: string;
  description: string;
  features?: ExperienceFeature[];
  logoFallbackIcon: LucideIcon;
  secondaryIcons?: [LucideIcon, LucideIcon];
  footerLabel?: string;
  children?: ReactNode;
}

export default function AuthBrandPanel({
  eyebrow,
  headline,
  description,
  features,
  logoFallbackIcon: LogoFallbackIcon,
  secondaryIcons,
  footerLabel = "Powered by T.Fundi",
  children,
}: AuthBrandPanelProps) {
  const { tenant } = useTenant();

  const brandName = tenant?.name ?? "Business";

  const primaryColor = tenant?.branding.primaryColor ?? "#111827";

  const primaryForeground = tenant?.branding.primaryForeground ?? "#ffffff";

  const logoUrl = tenant?.branding.logoUrl;

  const [SecondaryIcon, TertiaryIcon] = secondaryIcons ?? [
    LogoFallbackIcon,
    LogoFallbackIcon,
  ];
  const safeFeatures = features ?? [];
  console.log(safeFeatures);
  return (
    <section
      className="relative hidden overflow-hidden p-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:p-14"
      style={{
        backgroundColor: primaryColor,
        color: primaryForeground,
      }}
    >
      {/* ============================================================
          DECORATIVE BACKGROUND
      ============================================================ */}

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

      {/* Subtle center glow */}

      <div
        className="pointer-events-none absolute left-[45%] top-[35%] h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor: `${primaryForeground}08`,
        }}
      />

      {/* ============================================================
          BRAND
      ============================================================ */}

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <img
                src={logoUrl}
                alt={`${brandName} logo`}
                className="h-10 w-10 rounded-xl object-contain"
              />
            </div>
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${primaryForeground}15`,
              }}
            >
              <LogoFallbackIcon size={22} />
            </div>
          )}

          <div>
            <p className="text-xl font-bold tracking-tight">{brandName}</p>

            <p className="text-xs opacity-60">{eyebrow}</p>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN EXPERIENCE
      ============================================================ */}

      <div className="relative z-10 max-w-2xl">
        {/* Dynamic visual */}

        <div className="relative mb-10 flex h-48 items-center justify-center">
          {/* Glow */}

          <div
            className="absolute h-44 w-44 rounded-full blur-3xl"
            style={{
              backgroundColor: `${primaryForeground}18`,
            }}
          />

          {/* Main visual */}

          <div
            className="group relative flex h-36 w-36 rotate-[-4deg] items-center justify-center rounded-[2rem] border backdrop-blur-sm transition-transform duration-500 hover:rotate-0"
            style={{
              borderColor: `${primaryForeground}25`,
              backgroundColor: `${primaryForeground}10`,
            }}
          >
            <LogoFallbackIcon size={58} strokeWidth={1.3} />

            {/* Secondary capability */}

            <div
              className="absolute -right-5 -top-5 flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:rotate-0"
              style={{
                borderColor: `${primaryForeground}20`,
                backgroundColor: `${primaryForeground}12`,
              }}
            >
              <SecondaryIcon size={21} />
            </div>

            {/* Third capability */}

            <div
              className="absolute -bottom-4 -left-5 flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:rotate-0"
              style={{
                borderColor: `${primaryForeground}20`,
                backgroundColor: `${primaryForeground}12`,
              }}
            >
              <TertiaryIcon size={20} />
            </div>
          </div>
        </div>

        {/* Eyebrow */}

        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] opacity-65">
          {eyebrow}
        </p>

        {/* Headline */}

        <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
          {headline}
        </h1>

        {/* Description */}

        <p className="mt-6 max-w-xl text-base leading-7 opacity-75">
          {description}
        </p>

        {/* ==========================================================
            FEATURES
        ========================================================== */}

        <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
          {safeFeatures.map(({ icon: Icon, label }, index) => (
            <div
              key={`${label}-${index}`}
              className="group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: `${primaryForeground}18`,
                backgroundColor: `${primaryForeground}08`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  backgroundColor: primaryForeground,
                }}
              />

              <div className="relative z-10 flex items-center gap-3">
                {/* Icon */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${primaryForeground}12`,
                    color: primaryForeground,
                  }}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-sm font-medium">{label}</p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: primaryForeground,
                        opacity: 0.6,
                      }}
                    />

                    <span className="text-[11px] opacity-50">Explore</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="ml-auto opacity-30 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-70">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slot for any extra content a parent wants to render here */}
        {children && <div className="mt-8">{children}</div>}
      </div>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <div className="relative z-10 flex items-center justify-between text-xs opacity-55">
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>

        <span>{footerLabel}</span>
      </div>
    </section>
  );
}
