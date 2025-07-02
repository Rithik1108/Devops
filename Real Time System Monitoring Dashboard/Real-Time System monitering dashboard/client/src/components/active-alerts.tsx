import { AlertTriangle } from "lucide-react";
import { formatTimeAgo, getSeverityColor, getSeverityBadgeColor } from "@/lib/utils";
import type { Alert } from "@shared/schema";

interface ActiveAlertsProps {
  alerts: Alert[];
}

export function ActiveAlerts({ alerts }: ActiveAlertsProps) {
  const getAlertBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/20";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "info":
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6 text-white">Active Alerts</h3>
      
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 border rounded-lg ${getAlertBg(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`mt-1 ${getSeverityColor(alert.severity)}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.title}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {alert.description}
                    </p>
                    {alert.service && (
                      <p className="text-xs text-slate-500 mt-1">
                        Service: {alert.service}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      {formatTimeAgo(new Date(alert.timestamp))}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getSeverityBadgeColor(alert.severity)}`}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
