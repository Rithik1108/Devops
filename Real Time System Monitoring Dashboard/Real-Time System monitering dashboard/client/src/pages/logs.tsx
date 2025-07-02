import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, AlertCircle, AlertTriangle, Info, Bug } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { SystemLog } from "@shared/schema";

export default function Logs() {
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: logs, isLoading, refetch } = useQuery<SystemLog[]>({
    queryKey: ["/api/logs", levelFilter],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warn":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      case "debug":
        return <Bug className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "warn":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "info":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "debug":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getServiceColor = (service: string) => {
    const colors = [
      "bg-blue-500/10 text-blue-400",
      "bg-green-500/10 text-green-400",
      "bg-purple-500/10 text-purple-400",
      "bg-amber-500/10 text-amber-400",
      "bg-pink-500/10 text-pink-400",
      "bg-indigo-500/10 text-indigo-400",
    ];
    const hash = service.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = !searchQuery || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const logStats = logs ? {
    total: logs.length,
    error: logs.filter(l => l.level === "error").length,
    warn: logs.filter(l => l.level === "warn").length,
    info: logs.filter(l => l.level === "info").length,
    debug: logs.filter(l => l.level === "debug").length,
  } : { total: 0, error: 0, warn: 0, info: 0, debug: 0 };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 animate-spin" />
              <p>Loading system logs...</p>
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
              <h2 className="text-2xl font-semibold text-white">System Logs</h2>
              <p className="text-slate-400 mt-1">Monitor system events and troubleshoot issues</p>
            </div>
            <Button onClick={() => refetch()} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Log Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Logs</p>
                    <p className="text-xl font-semibold text-white">{logStats.total}</p>
                  </div>
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Errors</p>
                    <p className="text-xl font-semibold text-red-400">{logStats.error}</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Warnings</p>
                    <p className="text-xl font-semibold text-amber-400">{logStats.warn}</p>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Info</p>
                    <p className="text-xl font-semibold text-blue-400">{logStats.info}</p>
                  </div>
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Debug</p>
                    <p className="text-xl font-semibold text-purple-400">{logStats.debug}</p>
                  </div>
                  <Bug className="w-5 h-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Log Entries */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Log Entries ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No logs match your filter criteria</p>
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getLevelIcon(log.level)}
                          <Badge className={`${getLevelColor(log.level)} border text-xs`}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <Badge className={`${getServiceColor(log.service)} text-xs`}>
                            {log.service}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-400">{formatTimeAgo(new Date(log.timestamp))}</span>
                      </div>
                      <p className="text-white text-sm leading-relaxed mb-2">{log.message}</p>
                      {log.metadata && (
                        <details className="mt-2">
                          <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                            Show metadata
                          </summary>
                          <pre className="text-xs text-slate-400 mt-2 bg-slate-900/50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Services */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Active Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(logs?.map(log => log.service) || [])).map(service => (
                  <Badge key={service} className={`${getServiceColor(service)} border-0`}>
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}