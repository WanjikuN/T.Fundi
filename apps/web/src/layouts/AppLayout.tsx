import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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

            <span className="text-sm text-[var(--color-muted-foreground)]">
              Furniture workspace
            </span>
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