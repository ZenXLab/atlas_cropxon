import React from "react";
import { WorkforceWidget } from "@/components/tenant/widgets/WorkforceWidget";
import { AttendanceWidget } from "@/components/tenant/widgets/AttendanceWidget";
import { TasksProjectsWidget } from "@/components/tenant/widgets/TasksProjectsWidget";
import { PayrollWidget } from "@/components/tenant/widgets/PayrollWidget";
import { RecruitmentWidget } from "@/components/tenant/widgets/RecruitmentWidget";
import { FinanceWidget } from "@/components/tenant/widgets/FinanceWidget";
import { BGVWidget } from "@/components/tenant/widgets/BGVWidget";
import { InsuranceWidget } from "@/components/tenant/widgets/InsuranceWidget";
import { ComplianceWidget } from "@/components/tenant/widgets/ComplianceWidget";
import { ProximaAIWidget } from "@/components/tenant/widgets/ProximaAIWidget";

const TenantDashboard: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Dashboard</h1>
          <p className="text-sm text-[#6B7280]">Welcome back! Here's your organization overview.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1 */}
        <div className="space-y-5">
          <WorkforceWidget />
          <RecruitmentWidget />
          <ComplianceWidget />
        </div>

        {/* Column 2 */}
        <div className="space-y-5">
          <AttendanceWidget />
          <PayrollWidget />
          <BGVWidget />
        </div>

        {/* Column 3 */}
        <div className="space-y-5">
          <TasksProjectsWidget />
          <FinanceWidget />
          <InsuranceWidget />
        </div>
      </div>

      {/* Full Width AI Widget */}
      <div className="grid grid-cols-1">
        <ProximaAIWidget />
      </div>
    </div>
  );
};

export default TenantDashboard;
