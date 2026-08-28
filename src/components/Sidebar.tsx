import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Settings2, 
  BarChart2, 
  Briefcase, 
  BrainCircuit, 
  IndianRupee, 
  FileText, 
  Info,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dataset', label: 'Dataset View', icon: Database },
  { path: '/preprocessing', label: 'Preprocessing', icon: Settings2 },
  { path: '/exploratory', label: 'Exploratory EDA', icon: BarChart2 },
  { path: '/placement-insights', label: 'Placement Insights', icon: Briefcase },
  { path: '/prediction', label: 'Model Prediction', icon: BrainCircuit },
  { path: '/salary', label: 'Salary Analysis', icon: IndianRupee },
  { path: '/reports', label: 'Export Reports', icon: FileText },
  { path: '/about', label: 'About Project', icon: Info },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight leading-tight">SEAP Prediction</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors my-0.5",
                isActive 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Status</div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-indigo-400">System</span>
            <span className="text-[10px] text-green-400">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
