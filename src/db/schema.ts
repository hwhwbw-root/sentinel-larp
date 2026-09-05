import {
  pgTable,
  uuid,
  text,
  doublePrecision,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "Superadmin",
  "Admin",
  "Viewer",
]);

export const deviceTypeEnum = pgEnum("device_type", ["CO2", "H2"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("Viewer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Devices table. Column names fix the original schema's `treshold_alert` /
// `treshold_dangerous` typo — the device-facing threshold endpoint translates
// these back to the old misspelled keys so the ESP32 firmware's literal
// string search still matches without any firmware changes.
export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  boxId: text("box_id").notNull().unique(),
  deviceType: deviceTypeEnum("device_type").notNull(),
  status: text("status").notNull().default("Active"),
  alias: text("alias"),
  alertThreshold: doublePrecision("alert_threshold"),
  dangerousThreshold: doublePrecision("dangerous_threshold"),
  calA: doublePrecision("cal_a"),
  calB: doublePrecision("cal_b"),
  // Hashed per-device API key used to authenticate the ESP32 ingest calls.
  // The plaintext key is only ever shown once, at device creation.
  apiKeyHash: text("api_key_hash").notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const environmentData = pgTable(
  "environment_data",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    boxId: text("box_id").notNull(),
    gasValue: doublePrecision("gas_value").notNull(),
    temperature: doublePrecision("temperature"),
    humidity: doublePrecision("humidity"),
    // 0 = normal, 1 = alert, 2 = dangerous. Always computed server-side in
    // the ingest route from the device's thresholds - never trusted from
    // the device payload.
    alert: integer("alert").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    receiveAt: timestamp("receive_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("environment_data_box_id_created_at_idx").on(
      table.boxId,
      table.createdAt,
    ),
  ],
);

// Device-side debug/diagnostic logs (gas sensor TX/RX, module info, etc.),
// posted by MAIN/RemoteLogger.cpp. Replaces the original's separate,
// second Supabase project used only for this.
export const deviceLogs = pgTable(
  "device_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    boxId: text("box_id").notNull(),
    level: text("level").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("device_logs_box_id_created_at_idx").on(table.boxId, table.createdAt)],
);

export const firmwareVersions = pgTable("firmware_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  version: text("version").notNull().unique(),
  blobUrl: text("blob_url").notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
