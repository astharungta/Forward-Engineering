import { Search, Bell, User, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface DMSTopbarProps {
  userName?: string;
  userRole?: string;
  onMenuToggle?: () => void;
}

export function DMSTopbar({ 
  userName = "Rajesh Kumar", 
  userRole = "Service Advisor",
  onMenuToggle 
}: DMSTopbarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search customers, vehicles, invoices..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#3E378F] text-white border-white"
              >
                3
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm">New warranty request from Amit Sharma</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm">8 vehicles eligible for extended warranty</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm">Extended Warranty Campaign launched</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-3 h-10 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-[#3E378F] text-white rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm">{userName}</span>
                <span className="text-xs text-muted-foreground">{userRole}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}