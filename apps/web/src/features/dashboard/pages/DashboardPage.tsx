import { useTenant } from "../../../app/providers/TenantProvider";

const DashboardPage = () => {
  const { tenant } = useTenant();

  if (!tenant) {
    return null;
  }
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome to {tenant.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)] sm:text-base">
          Your furniture business workspace.
        </p>

        <button className="mt-6 rounded-[var(--radius)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] sm:px-5 sm:py-3 sm:text-base">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
