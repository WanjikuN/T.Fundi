import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { resolveTenantHost } from "../../features/tenant/resolveTenant";
import { getTenantByHost } from "../../features/tenant/services/tenantService";
import type { Tenant } from "../../features/tenant/types";
import { Toaster } from "sonner";

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  updateBranding: (branding: Partial<Tenant["branding"]>) => void;
  saveBranding: () => void;
  resetBranding: () => void;
  hasUnsavedChanges: boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

const TenantProvider = ({ children }: TenantProviderProps) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedBranding, setSavedBranding] = useState<Tenant["branding"] | null>(
    null,
  );
  const updateBranding = (branding: Partial<Tenant["branding"]>) => {
    setTenant((currentTenant) => {
      if (!currentTenant) {
        return currentTenant;
      }

      return {
        ...currentTenant,
        branding: {
          ...currentTenant.branding,
          ...branding,
        },
      };
    });
  };
  const saveBranding = () => {
    if (!tenant) {
      return;
    }

    setSavedBranding(tenant.branding);
  };
  const brandingHasChanged = (
    current: Tenant["branding"],
    saved: Tenant["branding"],
  ) => {
    return (
      current.primaryColor !== saved.primaryColor ||
      current.primaryForeground !== saved.primaryForeground ||
      current.secondaryColor !== saved.secondaryColor ||
      current.secondaryForeground !== saved.secondaryForeground ||
      current.accentColor !== saved.accentColor ||
      current.accentForeground !== saved.accentForeground ||
      current.backgroundColor !== saved.backgroundColor ||
      current.foregroundColor !== saved.foregroundColor ||
      current.mutedColor !== saved.mutedColor ||
      current.mutedForeground !== saved.mutedForeground ||
      current.logoUrl !== saved.logoUrl
    );
  };
  const hasUnsavedChanges =
    tenant !== null &&
    savedBranding !== null &&
    brandingHasChanged(tenant.branding, savedBranding);
  const resetBranding = () => {
    if (!savedBranding) {
      return;
    }

    setTenant((currentTenant) => {
      if (!currentTenant) {
        return currentTenant;
      }

      return {
        ...currentTenant,
        branding: savedBranding,
      };
    });
  };
  useEffect(() => {
    const loadTenant = async () => {
      try {
        const host = resolveTenantHost();
        const tenantData = await getTenantByHost(host);

        if (!tenantData) {
          setError("This tenant could not be found.");
          return;
        }

        setTenant(tenantData);
        setSavedBranding(tenantData.branding);
      } catch {
        setError("We couldn't load this workspace.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading T.Fundi...
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Workspace unavailable</h1>

          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            {error ?? "We couldn't find this workspace."}
          </p>
        </div>
      </div>
    );
  }

  const themeStyles = {
    "--color-primary": tenant.branding.primaryColor,
    "--color-primary-foreground": tenant.branding.primaryForeground,

    "--color-secondary": tenant.branding.secondaryColor,
    "--color-secondary-foreground": tenant.branding.secondaryForeground,

    "--color-accent": tenant.branding.accentColor,
    "--color-accent-foreground": tenant.branding.accentForeground,

    "--color-background": tenant.branding.backgroundColor,
    "--color-foreground": tenant.branding.foregroundColor,

    "--color-muted": tenant.branding.mutedColor,
    "--color-muted-foreground": tenant.branding.mutedForeground,
  } as CSSProperties;

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        error,
        updateBranding,
        saveBranding,
        resetBranding,
        hasUnsavedChanges,
      }}
    >
      <div style={themeStyles}>
        {" "}
        <Toaster position="top-right" richColors />
        {children}
      </div>
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used inside TenantProvider");
  }

  return context;
};

export default TenantProvider;
