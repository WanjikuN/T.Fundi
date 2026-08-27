import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Toaster } from "sonner";

import { resolveTenantHost } from "../../features/tenant/resolveTenant";
import { getTenantByHost } from "../../features/tenant/services/tenantService";

import type { Tenant } from "../../features/tenant/types";

import type {
  ProductCategory,
  TenantCatalogSettings,
  TenantCharacteristic,
} from "../../features/catalog/types/catalog.types";

/* =========================================================
   DEFAULT CATALOG CATEGORIES
   ========================================================= */

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  "sofas",
  "chairs",
  "tables",
  "beds",
  "storage",
  "desks",
  "lighting",
  "outdoor",
  "other",
];

/* =========================================================
   DEFAULT CATALOG SETTINGS
   ========================================================= */

export const DEFAULT_CATALOG_SETTINGS: TenantCatalogSettings = {
  categories: [...DEFAULT_CATEGORIES],

  characteristics: [],

  defaultCurrency: "KES",

  allowCustomCategories: false,

  allowCustomCharacteristics: false,

  requireDimensions: false,

  requirePrice: false,
};

/* =========================================================
   CONTEXT
   ========================================================= */

interface TenantContextValue {
  tenant: Tenant | null;

  isLoading: boolean;

  error: string | null;

  /* =======================================================
     BRANDING
     ======================================================= */

  updateBranding: (
    branding: Partial<Tenant["branding"]>,
  ) => void;

  saveBranding: () => void;

  resetBranding: () => void;

  hasUnsavedChanges: boolean;

  /* =======================================================
     CATALOG SETTINGS
     ======================================================= */

  catalogSettings: TenantCatalogSettings;

  updateCatalogSettings: (
    settings: Partial<TenantCatalogSettings>,
  ) => void;

  updateCatalogSetting: <
    K extends keyof TenantCatalogSettings,
  >(
    key: K,
    value: TenantCatalogSettings[K],
  ) => void;

  toggleCatalogCategory: (
    category: ProductCategory,
  ) => void;

  setCatalogCharacteristics: (
    characteristics: TenantCharacteristic[],
  ) => void;

  saveCatalogSettings: () => Promise<void>;

  resetCatalogSettings: () => void;

  hasUnsavedCatalogChanges: boolean;

  isSavingCatalog: boolean;
}

/* =========================================================
   CONTEXT
   ========================================================= */

const TenantContext =
  createContext<TenantContextValue | undefined>(
    undefined,
  );

/* =========================================================
   PROPS
   ========================================================= */

interface TenantProviderProps {
  children: ReactNode;
}

/* =========================================================
   HELPERS
   ========================================================= */

const cloneCharacteristics = (
  characteristics: TenantCharacteristic[],
): TenantCharacteristic[] => {
  return characteristics.map(
    (characteristic) => ({
      ...characteristic,

      values:
        characteristic.values?.map(
          (value) => ({
            ...value,

            images:
              value.images
                ? [...value.images]
                : undefined,
          }),
        ) ?? [],
    }),
  );
};

const cloneCatalogSettings = (
  settings: TenantCatalogSettings,
): TenantCatalogSettings => ({
  ...settings,

  categories: settings.categories
    ? [...settings.categories]
    : [],

  characteristics:
    cloneCharacteristics(
      settings.characteristics ?? [],
    ),
});

/* =========================================================
   NORMALIZE CATALOG SETTINGS
   ========================================================= */

const normalizeCatalogSettings = (
  settings?: Partial<TenantCatalogSettings> | null,
): TenantCatalogSettings => {
  const source =
    settings ?? {};

  return {
    ...DEFAULT_CATALOG_SETTINGS,

    ...source,

    categories:
      source.categories?.length
        ? [...source.categories]
        : [...DEFAULT_CATEGORIES],

    characteristics:
      source.characteristics
        ? cloneCharacteristics(
            source.characteristics,
          )
        : [],

    defaultCurrency:
      source.defaultCurrency?.trim()
        ? source.defaultCurrency
            .trim()
            .slice(0, 3)
            .toUpperCase()
        : DEFAULT_CATALOG_SETTINGS.defaultCurrency,

    allowCustomCategories:
      source.allowCustomCategories ??
      DEFAULT_CATALOG_SETTINGS.allowCustomCategories,

    allowCustomCharacteristics:
      source.allowCustomCharacteristics ??
      DEFAULT_CATALOG_SETTINGS.allowCustomCharacteristics,

    requireDimensions:
      source.requireDimensions ??
      DEFAULT_CATALOG_SETTINGS.requireDimensions,

    requirePrice:
      source.requirePrice ??
      DEFAULT_CATALOG_SETTINGS.requirePrice,
  };
};

/* =========================================================
   PROVIDER
   ========================================================= */

const TenantProvider = ({
  children,
}: TenantProviderProps) => {
  /* =======================================================
     TENANT
     ======================================================= */

  const [tenant, setTenant] =
    useState<Tenant | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     BRANDING STATE
     ======================================================= */

  const [savedBranding, setSavedBranding] =
    useState<Tenant["branding"] | null>(
      null,
    );

  /* =======================================================
     CATALOG STATE
     ======================================================= */

  const [catalogSettings, setCatalogSettings] =
    useState<TenantCatalogSettings>(
      cloneCatalogSettings(
        DEFAULT_CATALOG_SETTINGS,
      ),
    );

  const [
    savedCatalogSettings,
    setSavedCatalogSettings,
  ] = useState<TenantCatalogSettings>(
    cloneCatalogSettings(
      DEFAULT_CATALOG_SETTINGS,
    ),
  );

  const [isSavingCatalog, setIsSavingCatalog] =
    useState(false);

  /* =======================================================
     LOAD TENANT
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadTenant = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const host = resolveTenantHost();

        const tenantData =
          await getTenantByHost(host);

        if (!mounted) {
          return;
        }

        if (!tenantData) {
          setError(
            "This tenant could not be found.",
          );

          return;
        }

        setTenant(tenantData);

        setSavedBranding({
          ...tenantData.branding,
        });

        /*
         * catalogSettings is temporarily read from
         * the tenant response.
         *
         * Once the backend endpoint is connected,
         * the same normalized structure can be
         * returned directly by the tenant service.
         */

        const tenantWithCatalog =
          tenantData as Tenant & {
            catalogSettings?: TenantCatalogSettings;
          };

        const normalizedCatalogSettings =
          normalizeCatalogSettings(
            tenantWithCatalog.catalogSettings,
          );

        setCatalogSettings(
          cloneCatalogSettings(
            normalizedCatalogSettings,
          ),
        );

        setSavedCatalogSettings(
          cloneCatalogSettings(
            normalizedCatalogSettings,
          ),
        );
      } catch (caughtError) {
        console.error(
          "Failed to load tenant:",
          caughtError,
        );

        if (!mounted) {
          return;
        }

        setError(
          "We couldn't load this workspace.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTenant();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     BRANDING
     ======================================================= */

  const updateBranding = (
    branding: Partial<Tenant["branding"]>,
  ) => {
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

    setSavedBranding({
      ...tenant.branding,
    });
  };

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

        branding: {
          ...savedBranding,
        },
      };
    });
  };

  const brandingHasChanged = (
    current: Tenant["branding"],
    saved: Tenant["branding"],
  ) => {
    return (
      current.primaryColor !==
        saved.primaryColor ||
      current.primaryForeground !==
        saved.primaryForeground ||
      current.secondaryColor !==
        saved.secondaryColor ||
      current.secondaryForeground !==
        saved.secondaryForeground ||
      current.accentColor !==
        saved.accentColor ||
      current.accentForeground !==
        saved.accentForeground ||
      current.backgroundColor !==
        saved.backgroundColor ||
      current.foregroundColor !==
        saved.foregroundColor ||
      current.mutedColor !==
        saved.mutedColor ||
      current.mutedForeground !==
        saved.mutedForeground ||
      current.logoUrl !==
        saved.logoUrl
    );
  };

  const hasUnsavedChanges =
    tenant !== null &&
    savedBranding !== null &&
    brandingHasChanged(
      tenant.branding,
      savedBranding,
    );

  /* =======================================================
     CATALOG SETTINGS
     ======================================================= */

  const updateCatalogSettings = (
    settings: Partial<TenantCatalogSettings>,
  ) => {
    setCatalogSettings(
      (current) =>
        normalizeCatalogSettings({
          ...current,
          ...settings,
        }),
    );
  };

  /* =======================================================
     UPDATE ONE SETTING
     ======================================================= */

  const updateCatalogSetting = <
    K extends keyof TenantCatalogSettings,
  >(
    key: K,
    value: TenantCatalogSettings[K],
  ) => {
    setCatalogSettings(
      (current) =>
        normalizeCatalogSettings({
          ...current,
          [key]: value,
        }),
    );
  };

  /* =======================================================
     TOGGLE CATEGORY
     ======================================================= */

  const toggleCatalogCategory = (
    category: ProductCategory,
  ) => {
    setCatalogSettings(
      (current) => {
        const categories =
          current.categories ?? [];

        const exists =
          categories.includes(category);

        return normalizeCatalogSettings({
          ...current,

          categories: exists
            ? categories.filter(
                (item) =>
                  item !== category,
              )
            : [
                ...categories,
                category,
              ],
        });
      },
    );
  };

  /* =======================================================
     CHARACTERISTICS
     ======================================================= */

  const setCatalogCharacteristics = (
    characteristics: TenantCharacteristic[],
  ) => {
    setCatalogSettings(
      (current) =>
        normalizeCatalogSettings({
          ...current,

          characteristics:
            cloneCharacteristics(
              characteristics,
            ),
        }),
    );
  };

  /* =======================================================
     SAVE CATALOG SETTINGS
     ======================================================= */

  const saveCatalogSettings = async () => {
    if (
      isSavingCatalog ||
      !tenant
    ) {
      return;
    }

    try {
      setIsSavingCatalog(true);

      /*
       * TEMPORARY FRONTEND PERSISTENCE BOUNDARY
       *
       * This is intentionally isolated here.
       *
       * The backend service will replace this section
       * with:
       *
       * await updateTenantCatalogSettings(
       *   catalogSettings,
       * );
       *
       * Once that service exists, the returned server
       * representation should become the saved state.
       */

      const normalized =
        cloneCatalogSettings(
          catalogSettings,
        );

      /*
       * Keep the tenant object synchronized with the
       * catalog settings as well.
       *
       * This means any frontend consumer reading tenant
       * data during the current session sees the same
       * configuration.
       */

      setTenant(
        (currentTenant) => {
          if (!currentTenant) {
            return currentTenant;
          }

          return {
            ...currentTenant,

            catalogSettings:
              normalized,
          } as Tenant & {
            catalogSettings: TenantCatalogSettings;
          };
        },
      );

      setCatalogSettings(
        normalized,
      );

      setSavedCatalogSettings(
        cloneCatalogSettings(
          normalized,
        ),
      );
    } finally {
      setIsSavingCatalog(false);
    }
  };

  /* =======================================================
     RESET
     ======================================================= */

  const resetCatalogSettings = () => {
    setCatalogSettings(
      cloneCatalogSettings(
        savedCatalogSettings,
      ),
    );
  };

  /* =======================================================
     DETECT CHANGES
     ======================================================= */

  const hasUnsavedCatalogChanges =
    useMemo(() => {
      return (
        JSON.stringify(
          catalogSettings,
        ) !==
        JSON.stringify(
          savedCatalogSettings,
        )
      );
    }, [
      catalogSettings,
      savedCatalogSettings,
    ]);

  /* =======================================================
     LOADING
     ======================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/[0.02]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading T.Fundi...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error || !tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Workspace unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error ??
              "We couldn't find this workspace."}
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     TENANT THEME
     ======================================================= */

  const themeStyles = {
    "--color-primary":
      tenant.branding.primaryColor,

    "--color-primary-foreground":
      tenant.branding.primaryForeground,

    "--color-secondary":
      tenant.branding.secondaryColor,

    "--color-secondary-foreground":
      tenant.branding.secondaryForeground,

    "--color-accent":
      tenant.branding.accentColor,

    "--color-accent-foreground":
      tenant.branding.accentForeground,

    "--color-background":
      tenant.branding.backgroundColor,

    "--color-foreground":
      tenant.branding.foregroundColor,

    "--color-muted":
      tenant.branding.mutedColor,

    "--color-muted-foreground":
      tenant.branding.mutedForeground,
  } as CSSProperties;

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <TenantContext.Provider
      value={{
        tenant,

        isLoading,

        error,

        /* Branding */
        updateBranding,
        saveBranding,
        resetBranding,
        hasUnsavedChanges,

        /* Catalog */
        catalogSettings,
        updateCatalogSettings,
        updateCatalogSetting,
        toggleCatalogCategory,
        setCatalogCharacteristics,
        saveCatalogSettings,
        resetCatalogSettings,
        hasUnsavedCatalogChanges,
        isSavingCatalog,
      }}
    >
      <div
        style={themeStyles}
        className="min-h-screen"
      >
        <Toaster
          position="top-right"
          richColors
        />

        {children}
      </div>
    </TenantContext.Provider>
  );
};

/* =========================================================
   HOOK
   ========================================================= */

export const useTenant = () => {
  const context =
    useContext(TenantContext);

  if (!context) {
    throw new Error(
      "useTenant must be used inside TenantProvider",
    );
  }

  return context;
};

export default TenantProvider;
