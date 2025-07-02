import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Server, Activity, HardDrive, Wifi } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { SystemMetrics } from "@shared/schema";

export default function SystemHealth() {
  const { data: metrics, isLoading, refetch } = useQuery<SystemMetrics[]>({
    queryKey: ["/api/metrics/history"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: latestMetrics } = useQuery<SystemMetrics>({
    queryKey: ["/api/metrics"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { status: "Critical", color: "bg-red-500" };
    if (value >= thresholds.warning) return { status: "Warning", color: "bg-amber-500" };
    return { status: "Healthy", color: "bg-green-500" };
  };

  const formatChartData = () => {
    if (!metrics) return [];
    return metrics.map(m => ({
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: m.cpuUsage,
      memory: m.memoryUsage,
      disk: m.diskUsage,
      network: m.networkIO
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin" />
              <p>Loading system health data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const chartData = formatChartData();

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">System Health</h2>
              <p className="text-slate-400 mt-1">Real-time system resource monitoring</p>
            </div>
            <Button onClick={() => refetch()} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Current Status Cards */}
          {latestMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">CPU Usage</CardTitle>
                  <Server className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{latestMetrics.cpuUsage.toFixed(1)}%</div>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getHealthStatus(latestMetrics.cpuUsage, { warning: 70, critical: 85 }).color}`}></div>
                    <Badge variant="secondary" className={`text-xs ${getHealthStatus(latestMetrics.cpuUsage, { warning: 70, critical: 85 }).color} text-white`}>
                      {getHealthStatus(latestMetrics.cpuUsage, { warning: 70, critical: 85 }).status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Memory Usage</CardTitle>
                  <Activity className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{latestMetrics.memoryUsage.toFixed(1)}%</div>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getHealthStatus(latestMetrics.memoryUsage, { warning: 75, critical: 90 }).color}`}></div>
                    <Badge variant="secondary" className={`text-xs ${getHealthStatus(latestMetrics.memoryUsage, { warning: 75, critical: 90 }).color} text-white`}>
                      {getHealthStatus(latestMetrics.memoryUsage, { warning: 75, critical: 90 }).status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Disk Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{latestMetrics.diskUsage.toFixed(1)}%</div>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getHealthStatus(latestMetrics.diskUsage, { warning: 80, critical: 95 }).color}`}></div>
                    <Badge variant="secondary" className={`text-xs ${getHealthStatus(latestMetrics.diskUsage, { warning: 80, critical: 95 }).color} text-white`}>
                      {getHealthStatus(latestMetrics.diskUsage, { warning: 80, critical: 95 }).status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Network I/O</CardTitle>
                  <Wifi className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{latestMetrics.networkIO.toFixed(1)} MB/s</div>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                    <span className="text-xs text-slate-400">Active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Historical Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">CPU & Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                      />
                      <Line type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} name="CPU %" />
                      <Line type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={2} name="Memory %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Disk & Network Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                      />
                      <Area type="monotone" dataKey="disk" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Disk %" />
                      <Area type="monotone" dataKey="network" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Network MB/s" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Server Details</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>OS: Ubuntu 22.04 LTS</p>
                    <p>Kernel: 5.15.0-72-generic</p>
                    <p>Architecture: x86_64</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Resources</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>CPU: 8 cores @ 2.4 GHz</p>
                    <p>RAM: 32 GB DDR4</p>
                    <p>Storage: 1 TB NVMe SSD</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Last Updated</h4>
                  <div className="space-y-1 text-sm text-slate-300">
                    {latestMetrics && <p>{formatTimeAgo(new Date(latestMetrics.timestamp))}</p>}
                    <p>Monitoring: Active</p>
                    <p>Alerts: Enabled</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}