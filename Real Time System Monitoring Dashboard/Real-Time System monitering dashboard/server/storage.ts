import { 
  deployments, 
  alerts, 
  systemMetrics,
  pipelineRuns,
  systemLogs,
  performanceMetrics,
  type Deployment, 
  type InsertDeployment,
  type Alert,
  type InsertAlert,
  type SystemMetrics,
  type InsertSystemMetrics,
  type PipelineRun,
  type InsertPipelineRun,
  type SystemLog,
  type InsertSystemLog,
  type PerformanceMetrics,
  type InsertPerformanceMetrics,
  type DashboardStats,
  type RealtimeData
} from "@shared/schema";

export interface IStorage {
  // Deployments
  getDeployments(limit?: number): Promise<Deployment[]>;
  createDeployment(deployment: InsertDeployment): Promise<Deployment>;
  
  // Alerts
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<void>;
  
  // System Metrics
  getLatestMetrics(): Promise<SystemMetrics | undefined>;
  createMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics>;
  getMetricsHistory(hours: number): Promise<SystemMetrics[]>;
  
  // Pipeline Runs
  getPipelineRuns(limit?: number): Promise<PipelineRun[]>;
  createPipelineRun(pipelineRun: InsertPipelineRun): Promise<PipelineRun>;
  updatePipelineRun(id: number, updates: Partial<PipelineRun>): Promise<void>;
  
  // System Logs
  getSystemLogs(limit?: number, level?: string): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  
  // Performance Metrics
  getPerformanceMetrics(service?: string, hours?: number): Promise<PerformanceMetrics[]>;
  createPerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics>;
  
  // Dashboard aggregates
  getDashboardStats(): Promise<DashboardStats>;
  getRealtimeData(): Promise<RealtimeData>;
}

export class MemStorage implements IStorage {
  private deployments: Map<number, Deployment>;
  private alerts: Map<number, Alert>;
  private metrics: Map<number, SystemMetrics>;
  private pipelineRuns: Map<number, PipelineRun>;
  private systemLogs: Map<number, SystemLog>;
  private performanceMetrics: Map<number, PerformanceMetrics>;
  private currentId: { 
    deployments: number; 
    alerts: number; 
    metrics: number; 
    pipelineRuns: number; 
    systemLogs: number; 
    performanceMetrics: number; 
  };

  constructor() {
    this.deployments = new Map();
    this.alerts = new Map();
    this.metrics = new Map();
    this.pipelineRuns = new Map();
    this.systemLogs = new Map();
    this.performanceMetrics = new Map();
    this.currentId = { 
      deployments: 1, 
      alerts: 1, 
      metrics: 1, 
      pipelineRuns: 1, 
      systemLogs: 1, 
      performanceMetrics: 1 
    };

    // Initialize with some sample data
    this.initializeData();
  }

  // Pipeline Runs methods
  async getPipelineRuns(limit = 20): Promise<PipelineRun[]> {
    return Array.from(this.pipelineRuns.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  async createPipelineRun(insertPipelineRun: InsertPipelineRun): Promise<PipelineRun> {
    const id = this.currentId.pipelineRuns++;
    const pipelineRun: PipelineRun = { 
      id,
      pipelineName: insertPipelineRun.pipelineName,
      branch: insertPipelineRun.branch,
      commit: insertPipelineRun.commit,
      status: insertPipelineRun.status,
      startTime: insertPipelineRun.startTime,
      endTime: insertPipelineRun.endTime ?? null,
      duration: insertPipelineRun.duration ?? null,
      stages: insertPipelineRun.stages ?? null,
      triggeredBy: insertPipelineRun.triggeredBy
    };
    this.pipelineRuns.set(id, pipelineRun);
    return pipelineRun;
  }

  async updatePipelineRun(id: number, updates: Partial<PipelineRun>): Promise<void> {
    const pipelineRun = this.pipelineRuns.get(id);
    if (pipelineRun) {
      const updated = { ...pipelineRun, ...updates };
      this.pipelineRuns.set(id, updated);
    }
  }

  // System Logs methods
  async getSystemLogs(limit = 50, level?: string): Promise<SystemLog[]> {
    let logs = Array.from(this.systemLogs.values());
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createSystemLog(insertLog: InsertSystemLog): Promise<SystemLog> {
    const id = this.currentId.systemLogs++;
    const log: SystemLog = { 
      ...insertLog, 
      id,
      metadata: insertLog.metadata ?? null
    };
    this.systemLogs.set(id, log);
    return log;
  }

  // Performance Metrics methods
  async getPerformanceMetrics(service?: string, hours = 24): Promise<PerformanceMetrics[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    let metrics = Array.from(this.performanceMetrics.values())
      .filter(m => m.timestamp >= cutoff);
    
    if (service) {
      metrics = metrics.filter(m => m.service === service);
    }
    
    return metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createPerformanceMetrics(insertMetrics: InsertPerformanceMetrics): Promise<PerformanceMetrics> {
    const id = this.currentId.performanceMetrics++;
    const metrics: PerformanceMetrics = { ...insertMetrics, id };
    this.performanceMetrics.set(id, metrics);
    return metrics;
  }

  private async initializeData() {
    // Create initial deployments
    await this.createDeployment({
      service: "user-service",
      version: "v2.1.4",
      status: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      duration: 180,
    });

    await this.createDeployment({
      service: "api-gateway",
      version: "v1.8.2",
      status: "in_progress",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      duration: null,
    });

    await this.createDeployment({
      service: "notification-service",
      version: "v3.2.1",
      status: "failed",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      duration: 45,
    });

    // Create initial alerts
    await this.createAlert({
      title: "High Memory Usage",
      description: "Memory usage above 85% threshold",
      severity: "critical",
      status: "active",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      service: "api-gateway",
    });

    await this.createAlert({
      title: "Slow Response Time",
      description: "API response time over 2s",
      severity: "warning",
      status: "active",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      service: "user-service",
    });

    await this.createAlert({
      title: "Service Down",
      description: "Payment service unavailable",
      severity: "critical",
      status: "active",
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      service: "payment-service",
    });

    // Create initial metrics
    await this.createMetrics({
      timestamp: new Date(),
      cpuUsage: 68.5,
      memoryUsage: 45.2,
      diskUsage: 82.1,
      networkIO: 124.5,
    });

    // Create initial pipeline runs
    await this.createPipelineRun({
      pipelineName: "main-pipeline",
      branch: "main",
      commit: "abc123def456",
      status: "success",
      startTime: new Date(Date.now() - 10 * 60 * 1000),
      endTime: new Date(Date.now() - 5 * 60 * 1000),
      duration: 300,
      stages: ["build", "test", "deploy"],
      triggeredBy: "john.doe@company.com",
    });

    await this.createPipelineRun({
      pipelineName: "feature-auth",
      branch: "feature/auth-improvements",
      commit: "def456ghi789",
      status: "running",
      startTime: new Date(Date.now() - 3 * 60 * 1000),
      endTime: null,
      duration: null,
      stages: ["build", "test"],
      triggeredBy: "jane.smith@company.com",
    });

    // Create initial system logs
    await this.createSystemLog({
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      level: "error",
      service: "api-gateway",
      message: "Connection timeout to database",
      metadata: JSON.stringify({ connectionString: "***", timeout: 5000 }),
    });

    await this.createSystemLog({
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      level: "warn",
      service: "user-service",
      message: "High memory usage detected",
      metadata: JSON.stringify({ memoryUsage: "85%", threshold: "80%" }),
    });

    // Create initial performance metrics
    await this.createPerformanceMetrics({
      timestamp: new Date(),
      service: "api-gateway",
      responseTime: 145.2,
      throughput: 1250.5,
      errorRate: 2.1,
    });

    await this.createPerformanceMetrics({
      timestamp: new Date(),
      service: "user-service",
      responseTime: 89.3,
      throughput: 890.2,
      errorRate: 0.8,
    });
  }

  async getDeployments(limit = 10): Promise<Deployment[]> {
    return Array.from(this.deployments.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createDeployment(insertDeployment: InsertDeployment): Promise<Deployment> {
    const id = this.currentId.deployments++;
    const deployment: Deployment = { 
      ...insertDeployment, 
      id,
      duration: insertDeployment.duration ?? null 
    };
    this.deployments.set(id, deployment);
    return deployment;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === "active")
      .sort((a, b) => {
        // Sort by severity first (critical > warning > info), then by timestamp
        const severityOrder = { critical: 3, warning: 2, info: 1 };
        const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
                            (severityOrder[a.severity as keyof typeof severityOrder] || 0);
        if (severityDiff !== 0) return severityDiff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentId.alerts++;
    const alert: Alert = { 
      ...insertAlert, 
      id,
      service: insertAlert.service ?? null 
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async resolveAlert(id: number): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.status = "resolved";
      this.alerts.set(id, alert);
    }
  }

  async getLatestMetrics(): Promise<SystemMetrics | undefined> {
    const metrics = Array.from(this.metrics.values());
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async createMetrics(insertMetrics: InsertSystemMetrics): Promise<SystemMetrics> {
    const id = this.currentId.metrics++;
    const metrics: SystemMetrics = { ...insertMetrics, id };
    this.metrics.set(id, metrics);
    return metrics;
  }

  async getMetricsHistory(hours: number): Promise<SystemMetrics[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.metrics.values())
      .filter(m => m.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const activeAlerts = await this.getActiveAlerts();
    const recentDeployments = await this.getDeployments(50);
    
    const successfulDeployments = recentDeployments.filter(d => d.status === "success").length;
    const totalCompletedDeployments = recentDeployments.filter(d => d.status !== "in_progress").length;
    const successRate = totalCompletedDeployments > 0 ? (successfulDeployments / totalCompletedDeployments) * 100 : 0;
    
    const criticalAlerts = activeAlerts.filter(a => a.severity === "critical").length;
    const warningAlerts = activeAlerts.filter(a => a.severity === "warning").length;
    
    return {
      systemStatus: criticalAlerts > 0 ? "Critical" : warningAlerts > 0 ? "Warning" : "Healthy",
      uptime: 99.9,
      activeDeployments: recentDeployments.filter(d => d.status === "in_progress").length,
      successRate: Number(successRate.toFixed(1)),
      activeAlerts: activeAlerts.length,
      criticalAlerts,
      warningAlerts,
    };
  }

  async getRealtimeData(): Promise<RealtimeData> {
    const [stats, metrics, recentDeployments, activeAlerts] = await Promise.all([
      this.getDashboardStats(),
      this.getLatestMetrics(),
      this.getDeployments(10),
      this.getActiveAlerts(),
    ]);

    return {
      stats,
      metrics: metrics || {
        id: 0,
        timestamp: new Date(),
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkIO: 0,
      },
      recentDeployments,
      activeAlerts,
    };
  }
}

export const storage = new MemStorage();
