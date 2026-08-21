import { NavLink } from "react-router-dom";
import { navigationItems } from "../../config/navigation";

const Sidebar = () => {
  return (
    <aside className="flex w-64 flex-col border-r border-black/10 bg-white">
      <div className="flex h-16 items-center border-b border-black/10 px-6">
        <span className="text-xl font-bold text-[var(--color-primary)]">
          T.Fundi
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
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
  );
};

export default Sidebar;