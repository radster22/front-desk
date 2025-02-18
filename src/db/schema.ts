import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(), // Nullable since some providers don't return emails
    passwordHash: varchar("password_hash", { length: 255 }), // Only for email/password users
    provider: varchar("provider", { length: 50 }).notNull(), // "github", "google", "apple", "credentials"
    providerId: varchar("provider_id", { length: 255 }).unique().notNull(), // GitHub/Google/Apple ID
    role: varchar("role", { length: 50 }).default("external"), // internal/external
    createdAt: timestamp("created_at").defaultNow(),
  });  
  

  export const requests = mysqlTable("requests", {
    id: serial("submit_id").primaryKey(),
    name: varchar("submitter", { length: 255 }).notNull(),
    type: varchar("request_type", { length: 50 }).default("service"), // "service", "technical"
    priority: varchar("priority", { length: 50 }).default("unassigned"), // "unassigned", "high", "low", "medium"
    status: varchar("status", { length: 50 }).default("new"), // "new", "open", "resolved", "closed"
    createdAt: timestamp("created_at").defaultNow(),
    changedAt: timestamp("changed_at").defaultNow(),
    details: varchar("details", { length: 1000 }), // Add the details column
    phone: varchar("phone", { length: 255 }), // Add the phone column
    requestTitle: varchar("request_title", { length: 255 }).notNull(), // New field for requestTitle
  });
  