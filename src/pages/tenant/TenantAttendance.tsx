import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, Download, Filter, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Coffee, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const attendanceData = [
  { id: 1, name: "Priya Sharma", department: "Engineering", status: "present", checkIn: "09:02 AM", checkOut: "06:15 PM", location: "Office" },
  { id: 2, name: "Rahul Verma", department: "Sales", status: "late", checkIn: "10:45 AM", checkOut: "-", location: "Remote" },
  { id: 3, name: "Anjali Patel", department: "HR", status: "absent", checkIn: "-", checkOut: "-", location: "-" },
  { id: 4, name: "Vikram Singh", department: "Engineering", status: "present", checkIn: "08:55 AM", checkOut: "06:00 PM", location: "Office" },
  { id: 5, name: "Neha Gupta", department: "Marketing", status: "on-leave", checkIn: "-", checkOut: "-", location: "-" },
  { id: 6, name: "Amit Kumar", department: "Finance", status: "present", checkIn: "09:10 AM", checkOut: "-", location: "Office" },
];

const leaveRequests = [
  { id: 1, name: "Neha Gupta", type: "Annual Leave", from: "Dec 10", to: "Dec 15", days: 5, status: "approved" },
  { id: 2, name: "Rohit Jain", type: "Sick Leave", from: "Dec 8", to: "Dec 8", days: 1, status: "pending" },
  { id: 3, name: "Sanya Kapoor", type: "Work From Home", from: "Dec 9", to: "Dec 11", days: 3, status: "pending" },
];

const TenantAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20"><CheckCircle2 className="w-3 h-3 mr-1" />Present</Badge>;
      case "late": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
      case "absent": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>;
      case "on-leave": return <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20"><Plane className="w-3 h-3 mr-1" />On Leave</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Attendance & Leave</h1>
          <p className="text-sm text-[#6B7280] mt-1">Track employee attendance and manage leave requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
            <Clock className="w-4 h-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">156</p>
                <p className="text-xs text-[#6B7280]">Present Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">12</p>
                <p className="text-xs text-[#6B7280]">Late Arrivals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E23E57]/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#E23E57]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">8</p>
                <p className="text-xs text-[#6B7280]">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Plane className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">8</p>
                <p className="text-xs text-[#6B7280]">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="policies">Leave Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-[#F7F9FC]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-[#0F1E3A]">December 7, 2025</span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F9FC]">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Employee</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Department</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Check In</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Check Out</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((emp, idx) => (
                      <tr key={emp.id} className="border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white text-xs font-bold">
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="font-medium text-[#0F1E3A]">{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#6B7280]">{emp.department}</td>
                        <td className="p-4">{getStatusBadge(emp.status)}</td>
                        <td className="p-4 text-sm text-[#0F1E3A]">{emp.checkIn}</td>
                        <td className="p-4 text-sm text-[#0F1E3A]">{emp.checkOut}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                            <MapPin className="w-3 h-3" />
                            {emp.location}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white text-sm font-bold">
                      {request.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-[#0F1E3A]">{request.name}</p>
                      <p className="text-sm text-[#6B7280]">{request.type} • {request.from} - {request.to} ({request.days} days)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === "pending" ? (
                      <>
                        <Button size="sm" variant="outline" className="text-[#E23E57] border-[#E23E57]/20 hover:bg-[#E23E57]/10">Reject</Button>
                        <Button size="sm" className="bg-[#0FB07A] hover:bg-[#0FB07A]/90">Approve</Button>
                      </>
                    ) : (
                      <Badge className="bg-[#0FB07A]/10 text-[#0FB07A]">Approved</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Leave policies configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantAttendance;
