import type { SystemMetrics } from "@shared/schema";

interface SystemHealthProps {
  metrics: SystemMetrics;
}

export function SystemHealth({ metrics }: SystemHealthProps) {
  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "bg-red-500";
    if (usage >= 60) return "bg-amber-500";
    return "bg-green-500";
  };

  const getUsageColorText = (usage: number) => {
    if (usage >= 80) return "text-red-400";
    if (usage >= 60) return "text-amber-400";
    return "text-green-400";
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">System Health</h3>
        <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">CPU Usage</span>
            <span className={`text-sm font-mono ${getUsageColorText(metrics.cpuUsage)}`}>
              {metrics.cpuUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getUsageColor(metrics.cpuUsage)}`}
              style={{ width: `${metrics.cpuUsage}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Memory Usage</span>
            <span className={`text-sm font-mono ${getUsageColorText(metrics.memoryUsage)}`}>
              {metrics.memoryUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getUsageColor(metrics.memoryUsage)}`}
              style={{ width: `${metrics.memoryUsage}%` }}
            />
          </div>
        </div>

        {/* Disk Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Disk Usage</span>
            <span className={`text-sm font-mono ${getUsageColorText(metrics.diskUsage)}`}>
              {metrics.diskUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getUsageColor(metrics.diskUsage)}`}
              style={{ width: `${metrics.diskUsage}%` }}
            />
          </div>
        </div>

        {/* Network I/O */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Network I/O</span>
            <span className="text-sm font-mono text-purple-400">
              {metrics.networkIO.toFixed(1)} MB/s
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, (metrics.networkIO / 500) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
