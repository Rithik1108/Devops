import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/dashboard", async (req, res) => {
    try {
      const data = await storage.getRealtimeData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/deployments", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const deployments = await storage.getDeployments(limit);
      res.json(deployments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deployments" });
    }
  });

  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getLatestMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/metrics/history", async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const history = await storage.getMetricsHistory(hours);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics history" });
    }
  });

  app.get("/api/pipelines", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const pipelines = await storage.getPipelineRuns(limit);
      res.json(pipelines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pipeline runs" });
    }
  });

  app.get("/api/logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const level = req.query.level as string;
      const logs = await storage.getSystemLogs(limit, level);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system logs" });
    }
  });

  app.get("/api/performance", async (req, res) => {
    try {
      const service = req.query.service as string;
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const metrics = await storage.getPerformanceMetrics(service, hours);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance metrics" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Simulate real-time data updates
  const broadcastUpdate = async () => {
    if (wss.clients.size === 0) return;

    try {
      const data = await storage.getRealtimeData();
      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'dashboard_update',
            data
          }));
        }
      });
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  };

  // Generate mock real-time data
  const generateMockData = async () => {
    // Update system metrics with random variations
    const latest = await storage.getLatestMetrics();
    if (latest) {
      await storage.createMetrics({
        timestamp: new Date(),
        cpuUsage: Math.max(0, Math.min(100, latest.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, latest.memoryUsage + (Math.random() - 0.5) * 5)),
        diskUsage: Math.max(0, Math.min(100, latest.diskUsage + (Math.random() - 0.5) * 2)),
        networkIO: Math.max(0, latest.networkIO + (Math.random() - 0.5) * 50),
      });
    }

    // Occasionally create new deployments
    if (Math.random() < 0.1) {
      const services = ["api-gateway", "user-service", "payment-service", "notification-service", "auth-service"];
      const statuses = ["success", "failed", "in_progress"];
      const service = services[Math.floor(Math.random() * services.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      await storage.createDeployment({
        service,
        version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        status,
        timestamp: new Date(),
        duration: status === "in_progress" ? null : Math.floor(Math.random() * 300) + 30,
      });
    }

    // Occasionally create new alerts
    if (Math.random() < 0.05) {
      const titles = ["High CPU Usage", "Memory Leak Detected", "Disk Space Low", "Service Timeout", "Database Connection Failed"];
      const severities = ["critical", "warning", "info"];
      const services = ["api-gateway", "user-service", "payment-service", "notification-service"];
      
      await storage.createAlert({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: "Automated alert generated by monitoring system",
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: "active",
        timestamp: new Date(),
        service: services[Math.floor(Math.random() * services.length)],
      });
    }
  };

  // Start real-time data generation and broadcasting
  setInterval(async () => {
    await generateMockData();
    await broadcastUpdate();
  }, 5000); // Update every 5 seconds

  return httpServer;
}
