import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { StatusCards } from "@/components/status-cards";
import { SystemHealth } from "@/components/system-health";
import { DeploymentChart } from "@/components/deployment-chart";
import { RecentDeployments } from "@/components/recent-deployments";
import { ActiveAlerts } from "@/components/active-alerts";
import { useWebSocket } from "@/hooks/use-websocket";
import { queryClient } from "@/lib/queryClient";
import type { RealtimeData } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: realtimeData, isConnected } = useWebSocket();
  
  const { data: initialData, isLoading } = useQuery<RealtimeData>({
    queryKey: ["/api/dashboard"],
    staleTime: 30000, // 30 seconds
  });

  // Use real-time data if available, otherwise fall back to initial data
  const data = realtimeData || initialData;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
  };

  if (isLoading && !data) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin" />
              <p>Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <p>Failed to load dashboard data</p>
              <Button onClick={handleRefresh} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">System Overview</h2>
              <p className="text-slate-400 mt-1">Real-time monitoring dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse-green' : 'bg-red-500'}`}></div>
                <span className="text-slate-300">
                  {isConnected ? 'Live Updates' : 'Disconnected'}
                </span>
              </div>
              <Button 
                onClick={handleRefresh}
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <StatusCards stats={data.stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SystemHealth metrics={data.metrics} />
            <DeploymentChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentDeployments deployments={data.recentDeployments} />
            <ActiveAlerts alerts={data.activeAlerts} />
          </div>
        </div>
      </main>
    </div>
  );
}
