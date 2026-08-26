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
    const loadTenant = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const host = resolveTenantHost();

        const tenantData =
          await getTenantByHost(host);

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
         * Catalog settings may not yet be part
         * of the Tenant type/backend response.
         *
         * This compatibility read allows us to
         * continue developing the frontend.
         */
        const tenantWithCatalog =
          tenantData as Tenant & {
            catalogSettings?: TenantCatalogSettings;
          };

        const loaded =
          tenantWithCatalog.catalogSettings ??
          DEFAULT_CATALOG_SETTINGS;

        const normalizedCatalogSettings: TenantCatalogSettings =
          {
            ...DEFAULT_CATALOG_SETTINGS,

            ...loaded,

            categories:
              loaded.categories?.length
                ? [...loaded.categories]
                : [...DEFAULT_CATEGORIES],

            characteristics:
              loaded.characteristics
                ? cloneCharacteristics(
                    loaded.characteristics,
                  )
                : [],

            defaultCurrency:
              loaded.defaultCurrency ||
              DEFAULT_CATALOG_SETTINGS.defaultCurrency,

            allowCustomCategories:
              loaded.allowCustomCategories ??
              DEFAULT_CATALOG_SETTINGS.allowCustomCategories,

            allowCustomCharacteristics:
              loaded.allowCustomCharacteristics ??
              DEFAULT_CATALOG_SETTINGS.allowCustomCharacteristics,

            requireDimensions:
              loaded.requireDimensions ??
              DEFAULT_CATALOG_SETTINGS.requireDimensions,

            requirePrice:
              loaded.requirePrice ??
              DEFAULT_CATALOG_SETTINGS.requirePrice,
          };

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

        setError(
          "We couldn't load this workspace.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadTenant();
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
      current.logoUrl !== saved.logoUrl
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
      (current) => ({
        ...current,

        ...settings,

        categories:
          settings.categories ??
          current.categories,

        characteristics:
          settings.characteristics ??
          current.characteristics,
      }),
    );
  };

  /* -------------------------------------------------------
     Update ONE catalog setting
     ------------------------------------------------------- */

  const updateCatalogSetting = <
    K extends keyof TenantCatalogSettings,
  >(
    key: K,
    value: TenantCatalogSettings[K],
  ) => {
    setCatalogSettings(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  };

  /* -------------------------------------------------------
     Toggle category
     ------------------------------------------------------- */

  const toggleCatalogCategory = (
    category: ProductCategory,
  ) => {
    setCatalogSettings(
      (current) => {
        const categories =
          current.categories ??
          [];

        const exists =
          categories.includes(
            category,
          );

        return {
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
        };
      },
    );
  };

  /* -------------------------------------------------------
     Characteristics
     ------------------------------------------------------- */

  const setCatalogCharacteristics = (
    characteristics: TenantCharacteristic[],
  ) => {
    setCatalogSettings(
      (current) => ({
        ...current,

        characteristics:
          cloneCharacteristics(
            characteristics,
          ),
      }),
    );
  };

  /* -------------------------------------------------------
     Save catalog settings
     ------------------------------------------------------- */

  const saveCatalogSettings = async () => {
    if (isSavingCatalog) {
      return;
    }

    try {
      setIsSavingCatalog(true);

      /*
       * Backend persistence will be connected here.
       *
       * Example:
       *
       * await updateTenantCatalogSettings(
       *   catalogSettings,
       * );
       */

      /*
       * For now we treat the current settings
       * as persisted locally.
       */
      setSavedCatalogSettings(
        cloneCatalogSettings(
          catalogSettings,
        ),
      );
    } finally {
      setIsSavingCatalog(false);
    }
  };

  /* -------------------------------------------------------
     Reset catalog settings
     ------------------------------------------------------- */

  const resetCatalogSettings = () => {
    setCatalogSettings(
      cloneCatalogSettings(
        savedCatalogSettings,
      ),
    );
  };

  /* -------------------------------------------------------
     Detect changes
     ------------------------------------------------------- */

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