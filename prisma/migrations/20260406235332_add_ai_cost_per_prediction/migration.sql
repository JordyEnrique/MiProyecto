-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_predictor_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'paper',
    "paperBalance" REAL NOT NULL DEFAULT 1000.0,
    "maxBetPct" REAL NOT NULL DEFAULT 5.0,
    "autoBet" BOOLEAN NOT NULL DEFAULT false,
    "minConfidence" REAL NOT NULL DEFAULT 0.65,
    "aiCostPerPrediction" REAL NOT NULL DEFAULT 0.10,
    "polyApiKey" TEXT,
    "polyApiSecret" TEXT,
    "polyPassphrase" TEXT,
    "polyAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "predictor_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_predictor_settings" ("autoBet", "createdAt", "id", "maxBetPct", "minConfidence", "mode", "paperBalance", "polyAddress", "polyApiKey", "polyApiSecret", "polyPassphrase", "updatedAt", "userId") SELECT "autoBet", "createdAt", "id", "maxBetPct", "minConfidence", "mode", "paperBalance", "polyAddress", "polyApiKey", "polyApiSecret", "polyPassphrase", "updatedAt", "userId" FROM "predictor_settings";
DROP TABLE "predictor_settings";
ALTER TABLE "new_predictor_settings" RENAME TO "predictor_settings";
CREATE UNIQUE INDEX "predictor_settings_userId_key" ON "predictor_settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
