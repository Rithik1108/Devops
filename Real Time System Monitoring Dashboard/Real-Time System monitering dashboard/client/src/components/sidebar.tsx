import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { 
  BarChart3, 
  Server, 
  GitBranch, 
  AlertTriangle, 
  Activity, 
  FileText,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: BarChart3, href: "/" },
  { name: "System Health", icon: Server, href: "/system-health" },
  { name: "CI/CD Pipeline", icon: GitBranch, href: "/cicd-pipeline" },
  { name: "Incidents", icon: AlertTriangle, href: "/incidents" },
  { name: "Analytics", icon: Activity, href: "/analytics" },
  { name: "Logs", icon: FileText, href: "/logs" },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">DevOps Monitor</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <button
              key={item.name}
              onClick={() => setLocation(item.href)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-slate-400">DevOps Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
