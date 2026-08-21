import { Link } from "react-router-dom";
import { useTenant } from "../../../app/providers/TenantProvider";

const SettingsPage = () => {
    const { tenant } = useTenant();
  
    if (!tenant) {
      return null;
    }
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Manage your {tenant.name} workspace.
        </p>

        <div className="mt-8">
          <Link
            to="/settings/branding"
            className="block rounded-xl border border-black/10 bg-white p-5 transition hover:border-[var(--color-primary)]"
          >
            <h2 className="font-semibold">
              Branding
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Customize your logo, colors, and workspace appearance.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;