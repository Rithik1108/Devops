import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatTimeAgo, getStatusColor } from "@/lib/utils";
import type { Deployment } from "@shared/schema";

interface RecentDeploymentsProps {
  deployments: Deployment[];
}

export function RecentDeployments({ deployments }: RecentDeploymentsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-500" />;
      case "failed":
        return <XCircle className="text-red-500" />;
      case "in_progress":
        return <Loader2 className="text-blue-500 animate-spin" />;
      default:
        return <CheckCircle className="text-slate-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10";
      case "failed":
        return "bg-red-500/10";
      case "in_progress":
        return "bg-blue-500/10";
      default:
        return "bg-slate-500/10";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Success";
      case "failed":
        return "Failed";
      case "in_progress":
        return "In Progress";
      default:
        return status;
    }
  };

  return (
    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Deployments</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {deployments.map((deployment) => (
          <div 
            key={deployment.id}
            className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${getStatusBg(deployment.status)} rounded-lg flex items-center justify-center`}>
                {getStatusIcon(deployment.status)}
              </div>
              <div>
                <p className="font-medium text-white">{deployment.service}</p>
                <p className="text-sm text-slate-400">{deployment.version}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${getStatusColor(deployment.status)}`}>
                {getStatusText(deployment.status)}
              </p>
              <p className="text-xs text-slate-400">
                {formatTimeAgo(new Date(deployment.timestamp))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
