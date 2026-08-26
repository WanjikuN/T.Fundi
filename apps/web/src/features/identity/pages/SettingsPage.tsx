import {
  BookOpen,
  ChevronRight,
  Palette,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTenant } from "../../../app/providers/TenantProvider";

const SettingsPage = () => {
  const { tenant } = useTenant();

  if (!tenant) {
    return null;
  }

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-background)]">
      <div className="mx-auto h-full max-w-5xl overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{
              color: "var(--color-primary)",
            }}
          >
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Manage your {tenant.name} workspace, catalog and
            brand configuration.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {/* BRANDING */}

          <SettingsCard
            to="/settings/branding"
            icon={<Palette size={20} />}
            title="Branding"
            description="Customize your logo, colors and workspace appearance."
          />

          {/* CATALOG */}

          <SettingsCard
            to="/settings/catalog"
            icon={<BookOpen size={20} />}
            title="Catalog Settings"
            description="Define the categories and product characteristics your business uses."
          />
        </div>
      </div>
    </main>
  );
};

type SettingsCardProps = {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const SettingsCard = ({
  to,
  icon,
  title,
  description,
}: SettingsCardProps) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-md"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
      />
    </Link>
  );
};

export default SettingsPage;