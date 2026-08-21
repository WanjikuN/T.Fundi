import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <header className="border-b border-black/10 px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div>
            <span className="text-xl font-bold text-[var(--color-primary)]">
              T.Fundi
            </span>
          </div>

          <span className="text-sm text-[var(--color-muted-foreground)]">
            Furniture workspace
          </span>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;