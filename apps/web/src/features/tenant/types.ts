export interface TenantBranding {
  primaryColor: string;
  primaryForeground: string;
  secondaryColor: string;
  secondaryForeground: string;
  accentColor: string;
  accentForeground: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  mutedForeground: string;
  logoUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  branding: TenantBranding;
}