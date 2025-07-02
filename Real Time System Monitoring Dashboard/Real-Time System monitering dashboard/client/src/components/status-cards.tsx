import { CheckCircle, Rocket, TrendingUp, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import type { DashboardStats } from "@shared/schema";

interface StatusCardsProps {
  stats: DashboardStats;
}

export function StatusCards({ stats }: StatusCardsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return <CheckCircle className="text-green-500 text-xl" />;
      case "warning":
        return <AlertTriangle className="text-amber-500 text-xl" />;
      case "critical":
        return <AlertTriangle className="text-red-500 text-xl" />;
      default:
        return <CheckCircle className="text-slate-400 text-xl" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* System Status */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">System Status</p>
            <p className={`text-2xl font-semibold mt-1 ${getStatusColor(stats.systemStatus)}`}>
              {stats.systemStatus}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            {getStatusIcon(stats.systemStatus)}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-400">
          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          <span>{stats.uptime}% uptime</span>
        </div>
      </div>

      {/* Active Deployments */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Active Deployments</p>
            <p className="text-2xl font-semibold mt-1 text-white">{stats.activeDeployments}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Rocket className="text-blue-500 text-xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-400">
          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          <span>3 completed today</span>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Success Rate</p>
            <p className="text-2xl font-semibold mt-1 text-white">{stats.successRate}%</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-amber-500 text-xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-400">
          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          <span>2.1% from last week</span>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Active Alerts</p>
            <p className="text-2xl font-semibold text-red-500 mt-1">{stats.activeAlerts}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="text-red-500 text-xl" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-400">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          <span>{stats.criticalAlerts} critical, {stats.warningAlerts} warning</span>
        </div>
      </div>
    </div>
  );
}
