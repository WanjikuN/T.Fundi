import { useState } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navigationItems } from "../../config/navigation";
import { useTenant } from "../../app/providers/TenantProvider";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { tenant } = useTenant();

  if (!tenant) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/10 bg-white",
          "transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/10 px-4">
          <div className="flex min-w-0 items-center gap-3">
            {tenant.branding.logoUrl ? (
              <img
                src={tenant.branding.logoUrl}
                alt={`${tenant.name} logo`}
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-[var(--color-primary-foreground)]">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="truncate text-sm font-semibold text-[var(--color-foreground)]">
              {tenant.name}
            </span>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                      : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                  ].join(" ")
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
