import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/10 px-6">
          <span className="text-sm text-[var(--color-muted-foreground)]">
            Furniture workspace
          </span>

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