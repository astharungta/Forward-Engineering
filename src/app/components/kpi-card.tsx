import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { cn } from './ui/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  loading?: boolean;
  iconColor?: string;
  iconBgColor?: string;
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading = false,
  iconColor = "text-[#3E378F]",
  iconBgColor = "bg-[#3E378F]/10"
}: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl">{value}</h3>
            {trend && (
              <p className={cn(
                "text-sm",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
