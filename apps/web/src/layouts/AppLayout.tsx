import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useTenant } from "../app/providers/TenantProvider";
import Sidebar from "../components/navigation/Sidebar";

const AppLayout = () => {
  const { tenant } = useTenant();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!tenant) {
    return null;
  }
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/10 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                {tenant.name}
              </p>

              <p className="hidden text-xs text-[var(--color-muted-foreground)] sm:block">
                Furniture workspace
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-muted)] text-sm font-medium">
            P
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
