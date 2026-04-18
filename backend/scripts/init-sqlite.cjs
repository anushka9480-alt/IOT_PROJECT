const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function resolveDatabasePath() {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

  if (!databaseUrl.startsWith('file:')) {
    throw new Error(`Unsupported DATABASE_URL for sqlite init: ${databaseUrl}`);
  }

  const filePath = databaseUrl.slice('file:'.length);
  const normalizedFilePath =
    process.platform === 'win32' && /^\/[A-Za-z]:\//.test(filePath)
      ? filePath.slice(1)
      : filePath;

  if (path.isAbsolute(normalizedFilePath)) {
    return normalizedFilePath;
  }

  return path.resolve(__dirname, '..', 'prisma', normalizedFilePath);
}

const databasePath = resolveDatabasePath();
fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const db = new sqlite3.Database(databasePath);

const statements = [
  'PRAGMA foreign_keys = ON;',
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "age" INTEGER,
    "caregiverName" TEXT,
    "caregiverPhone" TEXT,
    "caregiverEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "Medication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "scheduleTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Medication_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS "Log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "takenAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "visionVerified" BOOLEAN NOT NULL DEFAULT false,
    "voiceVerified" BOOLEAN NOT NULL DEFAULT false,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Log_medicationId_fkey"
      FOREIGN KEY ("medicationId") REFERENCES "Medication" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS "RiskScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "missedDoses" INTEGER NOT NULL DEFAULT 0,
    "totalDelayMinutes" INTEGER NOT NULL DEFAULT 0,
    "historyFactor" REAL NOT NULL DEFAULT 0,
    "weight1" REAL NOT NULL DEFAULT 1,
    "weight2" REAL NOT NULL DEFAULT 1,
    "weight3" REAL NOT NULL DEFAULT 1,
    "score" REAL NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL DEFAULT 'low',
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskScore_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  );`,
  'CREATE INDEX IF NOT EXISTS "Medication_userId_idx" ON "Medication"("userId");',
  'CREATE INDEX IF NOT EXISTS "Log_userId_idx" ON "Log"("userId");',
  'CREATE INDEX IF NOT EXISTS "Log_medicationId_idx" ON "Log"("medicationId");',
  'CREATE INDEX IF NOT EXISTS "Log_scheduledAt_idx" ON "Log"("scheduledAt");',
  'CREATE UNIQUE INDEX IF NOT EXISTS "RiskScore_userId_key" ON "RiskScore"("userId");',
];

db.serialize(() => {
  for (const statement of statements) {
    db.run(statement);
  }
});

db.close((error) => {
  if (error) {
    console.error(error);
    process.exitCode = 1;
    return;
  }

  console.log(`SQLite database initialized at ${databasePath}`);
});
