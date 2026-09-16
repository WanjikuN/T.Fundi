import type { ReactNode } from "react";
import { Loader2, Boxes } from "lucide-react";

import { useTenant } from "../../../app/providers/TenantProvider";
import AuthBrandPanel from "./AuthBrandPanel";
import { getTenantExperience } from "../config/verticalExperiences";

interface AuthPageLayoutProps {
  children: ReactNode;
  mobileTitle?: string;
}

export default function AuthPageLayout({
  children,
  mobileTitle,
}: AuthPageLayoutProps) {
  const { tenant, isLoading: isTenantLoading } = useTenant();

  const experience = getTenantExperience(tenant?.verticalKey);

  const backgroundColor =
    tenant?.branding.backgroundColor ?? "var(--color-background)";

  const foregroundColor =
    tenant?.branding.foregroundColor ?? "var(--color-foreground)";

  const primaryColor = tenant?.branding.primaryColor ?? "var(--color-primary)";

  const primaryForeground =
    tenant?.branding.primaryForeground ?? "var(--color-primary-foreground)";

  const mutedForeground =
    tenant?.branding.mutedForeground ?? "var(--color-muted-foreground)";

  if (isTenantLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6"
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
            <Loader2 size={22} className="animate-spin" />
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

          <h1 className="text-2xl font-semibold">Workspace unavailable</h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{
              color: mutedForeground,
            }}
          >
            We could not find a business workspace for this address. Please
            check the URL and try again.
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
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <AuthBrandPanel
          eyebrow="Welcome back"
          headline={experience.headline}
          description={experience.description}
          logoFallbackIcon={experience.logoFallbackIcon}
        />

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile branding */}

            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                {tenant.branding.logoUrl ? (
                  <img
                    src={tenant.branding.logoUrl}
                    alt={`${tenant.name} logo`}
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
                    <experience.logoFallbackIcon size={20} />
                  </div>
                )}

                <div>
                  <p className="text-xl font-bold">{tenant.name}</p>

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

            {mobileTitle && (
              <p
                className="mb-2 text-sm font-medium"
                style={{
                  color: primaryColor,
                }}
              >
                {mobileTitle}
              </p>
            )}

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}