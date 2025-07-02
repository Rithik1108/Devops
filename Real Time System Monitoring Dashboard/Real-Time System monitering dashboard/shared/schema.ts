import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  service: text("service").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull(), // "success", "failed", "in_progress"
  timestamp: timestamp("timestamp").notNull(),
  duration: integer("duration"), // in seconds
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // "critical", "warning", "info"
  status: text("status").notNull(), // "active", "resolved"
  timestamp: timestamp("timestamp").notNull(),
  service: text("service"),
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  cpuUsage: real("cpu_usage").notNull(),
  memoryUsage: real("memory_usage").notNull(),
  diskUsage: real("disk_usage").notNull(),
  networkIO: real("network_io").notNull(),
});

export const pipelineRuns = pgTable("pipeline_runs", {
  id: serial("id").primaryKey(),
  pipelineName: text("pipeline_name").notNull(),
  branch: text("branch").notNull(),
  commit: text("commit").notNull(),
  status: text("status").notNull(), // "running", "success", "failed", "cancelled"
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  stages: text("stages").array(), // ["build", "test", "deploy"]
  triggeredBy: text("triggered_by").notNull(),
});

export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  level: text("level").notNull(), // "error", "warn", "info", "debug"
  service: text("service").notNull(),
  message: text("message").notNull(),
  metadata: text("metadata"), // JSON string
});

export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  service: text("service").notNull(),
  responseTime: real("response_time").notNull(), // in ms
  throughput: real("throughput").notNull(), // requests per second
  errorRate: real("error_rate").notNull(), // percentage
});

export const insertDeploymentSchema = createInsertSchema(deployments).omit({
  id: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
});

export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).omit({
  id: true,
});

export const insertPipelineRunSchema = createInsertSchema(pipelineRuns).omit({
  id: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
});

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
});

export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type Deployment = typeof deployments.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;
export type SystemMetrics = typeof systemMetrics.$inferSelect;

export type InsertPipelineRun = z.infer<typeof insertPipelineRunSchema>;
export type PipelineRun = typeof pipelineRuns.$inferSelect;

export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

export type InsertPerformanceMetrics = z.infer<typeof insertPerformanceMetricsSchema>;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;

// Dashboard data aggregated types
export type DashboardStats = {
  systemStatus: string;
  uptime: number;
  activeDeployments: number;
  successRate: number;
  activeAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
};

export type RealtimeData = {
  stats: DashboardStats;
  metrics: SystemMetrics;
  recentDeployments: Deployment[];
  activeAlerts: Alert[];
};
