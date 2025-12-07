import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Server, 
  Printer,
  Car,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  QrCode,
  Download,
  Filter,
  MoreVertical
} from "lucide-react";

const TenantEMS: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const assetStats = [
    { label: "Total Assets", value: "1,248", icon: Package, color: "bg-blue-500" },
    { label: "In Use", value: "1,089", icon: CheckCircle, color: "bg-green-500" },
    { label: "Available", value: "98", icon: Clock, color: "bg-amber-500" },
    { label: "Under Maintenance", value: "61", icon: Wrench, color: "bg-red-500" },
  ];

  const assetCategories = [
    { name: "Laptops", count: 456, icon: Laptop },
    { name: "Desktops", count: 234, icon: Monitor },
    { name: "Mobiles", count: 189, icon: Smartphone },
    { name: "Servers", count: 45, icon: Server },
    { name: "Printers", count: 67, icon: Printer },
    { name: "Vehicles", count: 23, icon: Car },
  ];

  const assets = [
    { 
      id: "AST-001", 
      name: "MacBook Pro 14\"", 
      category: "Laptop", 
      assignedTo: "John Smith", 
      department: "Engineering",
      status: "In Use", 
      purchaseDate: "2024-01-15",
      value: "$2,499"
    },
    { 
      id: "AST-002", 
      name: "Dell XPS 15", 
      category: "Laptop", 
      assignedTo: "Sarah Johnson", 
      department: "Design",
      status: "In Use", 
      purchaseDate: "2024-02-20",
      value: "$1,899"
    },
    { 
      id: "AST-003", 
      name: "iPhone 15 Pro", 
      category: "Mobile", 
      assignedTo: "Mike Chen", 
      department: "Sales",
      status: "In Use", 
      purchaseDate: "2024-03-10",
      value: "$999"
    },
    { 
      id: "AST-004", 
      name: "HP LaserJet Pro", 
      category: "Printer", 
      assignedTo: "Floor 3", 
      department: "Shared",
      status: "Maintenance", 
      purchaseDate: "2023-06-05",
      value: "$649"
    },
    { 
      id: "AST-005", 
      name: "ThinkPad X1 Carbon", 
      category: "Laptop", 
      assignedTo: "Unassigned", 
      department: "-",
      status: "Available", 
      purchaseDate: "2024-04-01",
      value: "$1,749"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Use": return "bg-green-100 text-green-700";
      case "Available": return "bg-blue-100 text-blue-700";
      case "Maintenance": return "bg-amber-100 text-amber-700";
      case "Retired": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">EMS / Assets</h1>
          <p className="text-sm text-[#6B7280] mt-1">Enterprise asset management and tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <QrCode className="w-4 h-4" />
            Scan Asset
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2 bg-[#0F1E3A] hover:bg-[#1a2d4f]">
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {assetStats.map((stat, index) => (
          <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0F1E3A] mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Asset Categories */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#0F1E3A]">Asset Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {assetCategories.map((category, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl border border-gray-100 hover:border-[#0F1E3A]/20 hover:bg-[#F7F9FC] transition-all cursor-pointer text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] mx-auto mb-2 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-[#0F1E3A]" />
                </div>
                <p className="text-sm font-medium text-[#0F1E3A]">{category.name}</p>
                <p className="text-xs text-[#6B7280]">{category.count} items</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset List */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0F1E3A]">Asset Inventory</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-3 h-7">All</TabsTrigger>
                <TabsTrigger value="in-use" className="text-xs px-3 h-7">In Use</TabsTrigger>
                <TabsTrigger value="available" className="text-xs px-3 h-7">Available</TabsTrigger>
                <TabsTrigger value="maintenance" className="text-xs px-3 h-7">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Search assets by ID, name, or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Asset Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Asset ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Assigned To</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Value</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-[#0F1E3A]">{asset.id}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#0F1E3A]">{asset.name}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{asset.category}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{asset.assignedTo}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{asset.department}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(asset.status)} text-xs font-medium`}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-[#0F1E3A]">{asset.value}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantEMS;
