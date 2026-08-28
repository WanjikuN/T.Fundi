-- CreateTable
CREATE TABLE "TenantCatalogSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categories" JSONB,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'KES',
    "allowCustomCategories" BOOLEAN NOT NULL DEFAULT false,
    "allowCustomCharacteristics" BOOLEAN NOT NULL DEFAULT false,
    "requireDimensions" BOOLEAN NOT NULL DEFAULT false,
    "requirePrice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantCatalogSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantCharacteristic" (
    "id" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantCharacteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantCharacteristicValue" (
    "id" TEXT NOT NULL,
    "characteristicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hexCode" TEXT,
    "imageUrl" TEXT,
    "images" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantCharacteristicValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantCatalogSettings_tenantId_key" ON "TenantCatalogSettings"("tenantId");

-- CreateIndex
CREATE INDEX "TenantCharacteristic_settingsId_idx" ON "TenantCharacteristic"("settingsId");

-- CreateIndex
CREATE INDEX "TenantCharacteristic_settingsId_sequence_idx" ON "TenantCharacteristic"("settingsId", "sequence");

-- CreateIndex
CREATE INDEX "TenantCharacteristicValue_characteristicId_idx" ON "TenantCharacteristicValue"("characteristicId");

-- AddForeignKey
ALTER TABLE "TenantCatalogSettings" ADD CONSTRAINT "TenantCatalogSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantCharacteristic" ADD CONSTRAINT "TenantCharacteristic_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "TenantCatalogSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantCharacteristicValue" ADD CONSTRAINT "TenantCharacteristicValue_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "TenantCharacteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
