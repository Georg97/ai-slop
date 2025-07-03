-- CreateTable
CREATE TABLE "TentCalculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "targetFloorWidth" REAL,
    "targetFootHeight" REAL,
    "targetHeadHeight" REAL,
    "verticalPadding" REAL NOT NULL,
    "horizontalPadding" REAL NOT NULL,
    "endPadding" REAL NOT NULL,
    "actualFootHeight" REAL,
    "actualHeadHeight" REAL,
    "actualFloorWidth" REAL,
    "calculationMode" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "warnings" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PaddingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "verticalPadding" REAL NOT NULL,
    "horizontalPadding" REAL NOT NULL,
    "endPadding" REAL NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "TentCalculation_name_idx" ON "TentCalculation"("name");

-- CreateIndex
CREATE INDEX "TentCalculation_createdAt_idx" ON "TentCalculation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaddingProfile_name_key" ON "PaddingProfile"("name");

-- CreateIndex
CREATE INDEX "PaddingProfile_name_idx" ON "PaddingProfile"("name");
