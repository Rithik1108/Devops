import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { RefreshCw, TrendingUp, Activity, Zap, Target } from "lucide-react";
import type { PerformanceMetrics } from "@shared/schema";

export default function Analytics() {
  const { data: performanceData, isLoading, refetch } = useQuery<PerformanceMetrics[]>({
    queryKey: ["/api/performance"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const services = Array.from(new Set(performanceData?.map(p => p.service) || []));
  
  const getServiceMetrics = (service: string) => {
    const serviceData = performanceData?.filter(p => p.service === service) || [];
    if (serviceData.length === 0) return { avgResponseTime: 0, avgThroughput: 0, avgErrorRate: 0 };
    
    return {
      avgResponseTime: serviceData.reduce((sum, p) => sum + p.responseTime, 0) / serviceData.length,
      avgThroughput: serviceData.reduce((sum, p) => sum + p.throughput, 0) / serviceData.length,
      avgErrorRate: serviceData.reduce((sum, p) => sum + p.errorRate, 0) / serviceData.length,
    };
  };

  const formatChartData = () => {
    if (!performanceData) return [];
    return performanceData.slice(-20).map(p => ({
      time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTime: p.responseTime,
      throughput: p.throughput,
      errorRate: p.errorRate,
      service: p.service
    }));
  };

  const getServiceDistribution = () => {
    const distribution = services.map(service => {
      const serviceData = performanceData?.filter(p => p.service === service) || [];
      return {
        name: service,
        value: serviceData.length,
        color: getServiceColor(service)
      };
    });
    return distribution;
  };

  const getServiceColor = (service: string) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const hash = service.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const getPerformanceScore = () => {
    if (!performanceData || performanceData.length === 0) return 0;
    
    const avgResponseTime = performanceData.reduce((sum, p) => sum + p.responseTime, 0) / performanceData.length;
    const avgErrorRate = performanceData.reduce((sum, p) => sum + p.errorRate, 0) / performanceData.length;
    
    // Score based on response time (lower is better) and error rate (lower is better)
    const responseTimeScore = Math.max(0, 100 - (avgResponseTime / 10)); // 100ms = 90 points
    const errorRateScore = Math.max(0, 100 - (avgErrorRate * 10)); // 1% error = 90 points
    
    return Math.round((responseTimeScore + errorRateScore) / 2);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin" />
              <p>Loading analytics data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const chartData = formatChartData();
  const serviceDistribution = getServiceDistribution();
  const performanceScore = getPerformanceScore();

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Analytics</h2>
              <p className="text-slate-400 mt-1">Performance insights and system analytics</p>
            </div>
            <Button onClick={() => refetch()} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Performance Score</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{performanceScore}/100</div>
                <p className="text-xs text-slate-400">Overall system health</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Avg Response Time</CardTitle>
                <Zap className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceData && performanceData.length > 0 
                    ? (performanceData.reduce((sum, p) => sum + p.responseTime, 0) / performanceData.length).toFixed(1)
                    : '0'
                  }ms
                </div>
                <p className="text-xs text-slate-400">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Throughput</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceData && performanceData.length > 0 
                    ? (performanceData.reduce((sum, p) => sum + p.throughput, 0) / performanceData.length).toFixed(0)
                    : '0'
                  } req/s
                </div>
                <p className="text-xs text-slate-400">Requests per second</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Error Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceData && performanceData.length > 0 
                    ? (performanceData.reduce((sum, p) => sum + p.errorRate, 0) / performanceData.length).toFixed(2)
                    : '0'
                  }%
                </div>
                <p className="text-xs text-slate-400">Average error rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Response Time Trends</CardTitle>
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
                      <Line type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={2} name="Response Time (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Throughput & Error Rate</CardTitle>
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
                      <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} name="Throughput (req/s)" />
                      <Line type="monotone" dataKey="errorRate" stroke="#EF4444" strokeWidth={2} name="Error Rate %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Service Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map(service => {
                    const metrics = getServiceMetrics(service);
                    return (
                      <div key={service} className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{service}</h4>
                          <div className="flex space-x-4 text-sm">
                            <span className="text-blue-400">{metrics.avgResponseTime.toFixed(1)}ms</span>
                            <span className="text-green-400">{metrics.avgThroughput.toFixed(0)} req/s</span>
                            <span className="text-red-400">{metrics.avgErrorRate.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Response Time</div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (metrics.avgResponseTime / 200) * 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Throughput</div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (metrics.avgThroughput / 2000) * 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Error Rate</div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (metrics.avgErrorRate / 5) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">Optimization Opportunities</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Consider caching for frequently accessed endpoints</li>
                    <li>• Monitor database query performance</li>
                    <li>• Implement request rate limiting</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">System Health</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Response times within acceptable range</li>
                    <li>• Error rates below 5% threshold</li>
                    <li>• All services responding normally</li>
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h4 className="text-amber-400 font-medium mb-2">Recommendations</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Set up automated scaling rules</li>
                    <li>• Configure performance alerts</li>
                    <li>• Regular performance testing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}