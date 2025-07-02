import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, GitBranch, Play, CheckCircle, XCircle, Clock, User, GitCommit } from "lucide-react";
import { formatTimeAgo, formatDuration } from "@/lib/utils";
import type { PipelineRun } from "@shared/schema";

export default function CICDPipeline() {
  const { data: pipelines, isLoading, refetch } = useQuery<PipelineRun[]>({
    queryKey: ["/api/pipelines"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "running":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "cancelled":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStageStatus = (stage: string, stages: string[] | null, status: string) => {
    if (!stages) return "pending";
    const stageIndex = stages.indexOf(stage);
    if (stageIndex === -1) return "pending";
    
    if (status === "success") return "success";
    if (status === "failed" && stageIndex <= stages.length - 1) return "failed";
    if (status === "running" && stageIndex <= stages.length - 1) return "running";
    return "pending";
  };

  const getStageColor = (stageStatus: string) => {
    switch (stageStatus) {
      case "success":
        return "bg-green-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "running":
        return "bg-blue-500 text-white animate-pulse";
      default:
        return "bg-slate-600 text-slate-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin" />
              <p>Loading pipeline data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const runningPipelines = pipelines?.filter(p => p.status === "running") || [];
  const recentPipelines = pipelines?.slice(0, 10) || [];
  const successRate = pipelines ? (pipelines.filter(p => p.status === "success").length / pipelines.length * 100) : 0;

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">CI/CD Pipeline</h2>
              <p className="text-slate-400 mt-1">Monitor deployment pipelines and build status</p>
            </div>
            <Button onClick={() => refetch()} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Pipeline Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Active Pipelines</CardTitle>
                <Play className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{runningPipelines.length}</div>
                <p className="text-xs text-slate-400">Currently running</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</div>
                <p className="text-xs text-slate-400">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Runs</CardTitle>
                <GitBranch className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{pipelines?.length || 0}</div>
                <p className="text-xs text-slate-400">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Avg Duration</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">4m 32s</div>
                <p className="text-xs text-slate-400">Completed builds</p>
              </CardContent>
            </Card>
          </div>

          {/* Running Pipelines */}
          {runningPipelines.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Play className="w-5 h-5 mr-2 text-blue-500 animate-pulse" />
                  Currently Running
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {runningPipelines.map((pipeline) => (
                    <div key={pipeline.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">{pipeline.pipelineName}</h4>
                          <p className="text-sm text-slate-400">{pipeline.branch}</p>
                        </div>
                        <Badge className={`${getStatusColor(pipeline.status)} border`}>
                          <Play className="w-3 h-3 mr-1" />
                          Running
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-slate-400">
                          <GitCommit className="w-4 h-4 mr-1" />
                          {pipeline.commit.substring(0, 8)}
                        </div>
                        <div className="flex items-center text-sm text-slate-400">
                          <User className="w-4 h-4 mr-1" />
                          {pipeline.triggeredBy}
                        </div>
                        <div className="flex items-center text-sm text-slate-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(new Date(pipeline.startTime))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {["build", "test", "deploy"].map((stage) => (
                          <div key={stage} className={`px-2 py-1 rounded text-xs ${getStageColor(getStageStatus(stage, pipeline.stages, pipeline.status))}`}>
                            {stage}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Pipeline Runs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Pipeline Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPipelines.map((pipeline) => (
                  <div key={pipeline.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <h4 className="text-white font-medium">{pipeline.pipelineName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="flex items-center">
                            <GitBranch className="w-3 h-3 mr-1" />
                            {pipeline.branch}
                          </span>
                          <span className="flex items-center">
                            <GitCommit className="w-3 h-3 mr-1" />
                            {pipeline.commit.substring(0, 8)}
                          </span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {pipeline.triggeredBy.split('@')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(pipeline.status)} border mb-1`}>
                        {pipeline.status}
                      </Badge>
                      <div className="text-xs text-slate-400">
                        <div>{formatTimeAgo(new Date(pipeline.startTime))}</div>
                        {pipeline.duration && <div>{formatDuration(pipeline.duration)}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}