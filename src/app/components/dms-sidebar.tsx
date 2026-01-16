import { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  ClipboardList, 
  Wrench, 
  BarChart3, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from './ui/utils';

interface DMSSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'warranty', label: 'Extended Warranty', icon: Shield },
  { id: 'inventory', label: 'Inventory', icon: Car },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'sales', label: 'Sales', icon: ClipboardList },
  { id: 'service', label: 'Service', icon: Wrench },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function DMSSidebar({ collapsed, onToggle, activeSection, onSectionChange }: DMSSidebarProps) {
  return (
    <div 
      className={cn(
        "h-screen bg-[#1A1535] text-white flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-[#2A2450] px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center text-[#3E378F] font-bold text-sm">
              MS
            </div>
            <span className="text-white font-semibold">Maruti Suzuki</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-[#3E378F] rounded flex items-center justify-center text-white">
            MS
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-[#3E378F] text-white" 
                      : "text-gray-300 hover:bg-[#2A2450] hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-4 border-t border-[#2A2450]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#2A2450] hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
