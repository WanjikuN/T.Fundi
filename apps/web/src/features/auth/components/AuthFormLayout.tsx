import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { useTenant } from "../../../app/providers/TenantProvider";

interface AuthFormLayoutProps {
  children: ReactNode;
  showBackToLogin?: boolean;
}

export default function AuthFormLayout({
  children,
  showBackToLogin = false,
}: AuthFormLayoutProps) {
  const { tenant } = useTenant();

  const brandName = tenant?.name ?? "Business";

  const primaryColor =
    tenant?.branding?.primaryColor ?? "#111827";

  const logoUrl = tenant?.branding?.logoUrl;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
      <div className="w-full max-w-lg">
        {/* Mobile brand */}
        <div className="mb-8 lg:hidden">
          {showBackToLogin && (
            <Link
              to="/login"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          )}

          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="h-10 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                {brandName.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="text-lg font-bold tracking-tight text-slate-900">
              {brandName}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </main>
  );
}