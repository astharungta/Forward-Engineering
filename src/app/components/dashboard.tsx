import { Car, Users, Shield, TrendingUp, Clock, AlertCircle, Calendar } from 'lucide-react';
import { KPICard } from './kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const salesData = [
  { month: 'Jan', warranties: 45, revenue: 2250 },
  { month: 'Feb', warranties: 52, revenue: 2600 },
  { month: 'Mar', warranties: 61, revenue: 3050 },
  { month: 'Apr', warranties: 58, revenue: 2900 },
  { month: 'May', warranties: 70, revenue: 3500 },
  { month: 'Jun', warranties: 85, revenue: 4250 }
];

const planDistribution = [
  { name: 'Platinum', value: 35, color: '#3E378F' },
  { name: 'Royal Platinum', value: 45, color: '#6B64C8' },
  { name: 'Solitaire', value: 20, color: '#9C97E5' }
];

const expiringWarranties = [
  { id: 1, customer: 'Rahul Verma', vehicle: 'Swift LXI', registration: 'DL-02-AB-4567', expiryDays: 8 },
  { id: 2, customer: 'Priya Singh', vehicle: 'Baleno VXI', registration: 'DL-03-CD-7890', expiryDays: 12 },
  { id: 3, customer: 'Sanjay Kumar', vehicle: 'Dzire ZXI', registration: 'DL-04-EF-1234', expiryDays: 15 },
  { id: 4, customer: 'Anita Sharma', vehicle: 'Ertiga VXI', registration: 'DL-05-GH-5678', expiryDays: 18 }
];

const recentActivities = [
  { id: 1, action: 'New warranty purchased', customer: 'Amit Sharma', time: '5 mins ago', type: 'success' },
  { id: 2, action: 'Eligibility check failed', customer: 'Rajesh Patel', time: '15 mins ago', type: 'warning' },
  { id: 3, action: 'Payment completed', customer: 'Neha Gupta', time: '32 mins ago', type: 'success' },
  { id: 4, action: 'KYC verification pending', customer: 'Vijay Kumar', time: '1 hour ago', type: 'info' }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your extended warranty overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#3E378F] hover:bg-[#3E378F]/90">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Warranties"
          value="342"
          icon={Shield}
          trend={{ value: "+12.5%", isPositive: true }}
          iconColor="text-[#3E378F]"
          iconBgColor="bg-[#3E378F]/10"
        />
        <KPICard
          title="Vehicles in Service"
          value="12"
          icon={Car}
          trend={{ value: "+3", isPositive: true }}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <KPICard
          title="Expiring Soon"
          value="8"
          icon={AlertCircle}
          trend={{ value: "Within 10 days", isPositive: false }}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
        <KPICard
          title="Monthly Revenue"
          value="₹4.25L"
          icon={TrendingUp}
          trend={{ value: "+18.2%", isPositive: true }}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Warranty Sales Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Warranty Sales Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly warranty sales and revenue</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis yAxisId="left" stroke="#666" />
                <YAxis yAxisId="right" orientation="right" stroke="#666" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="warranties" 
                  stroke="#3E378F" 
                  strokeWidth={2}
                  name="Warranties Sold"
                  dot={{ fill: '#3E378F', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Revenue (₹'000)"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Current month breakdown</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expiring Warranties */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Standard Warranty Expiring Soon</CardTitle>
                <p className="text-sm text-muted-foreground">Within next 30 days</p>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {expiringWarranties.length} vehicles
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringWarranties.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.vehicle} • {item.registration}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {item.expiryDays} days
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="text-[#3E378F]">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Expiring Warranties
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <p className="text-sm text-muted-foreground">Latest warranty transactions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.customer} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
