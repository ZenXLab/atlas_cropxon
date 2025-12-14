import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Download, TrendingUp, TrendingDown, Minus, Eye, EyeOff } from "lucide-react";

export const PayslipWidget = () => {
  const [showSalary, setShowSalary] = useState(false);

  // Mock data - would come from API
  const payslipData = {
    month: "November 2024",
    gross: 85000,
    deductions: 12500,
    net: 72500,
    previousNet: 71000,
    components: [
      { name: "Basic Salary", amount: 45000, type: "earning" },
      { name: "HRA", amount: 18000, type: "earning" },
      { name: "Special Allowance", amount: 15000, type: "earning" },
      { name: "PF", amount: 5400, type: "deduction" },
      { name: "Tax (TDS)", amount: 5100, type: "deduction" },
      { name: "Professional Tax", amount: 200, type: "deduction" },
    ],
  };

  const percentChange = ((payslipData.net - payslipData.previousNet) / payslipData.previousNet * 100).toFixed(1);
  const isIncrease = payslipData.net > payslipData.previousNet;
  const isDecrease = payslipData.net < payslipData.previousNet;

  const formatAmount = (amount: number) => {
    if (!showSalary) return "₹••,•••";
    return `₹${amount.toLocaleString()}`;
  };

  const formatSign = (amount: number, type: string) => {
    if (!showSalary) return `${type === "deduction" ? "-" : "+"}₹••,•••`;
    return `${type === "deduction" ? "-" : "+"}₹${amount.toLocaleString()}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            Payslip - {payslipData.month}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => setShowSalary(!showSalary)}
              title={showSalary ? "Hide salary" : "Show salary"}
            >
              {showSalary ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              <Download className="w-3 h-3" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Net Salary */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 text-center relative">
          <p className="text-xs text-muted-foreground mb-1">Net Salary</p>
          <p className="text-2xl font-bold text-foreground">
            {formatAmount(payslipData.net)}
          </p>
          {showSalary && (
            <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
              isIncrease ? "text-green-600" : isDecrease ? "text-red-600" : "text-muted-foreground"
            }`}>
              {isIncrease ? <TrendingUp className="w-3 h-3" /> : isDecrease ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {percentChange}% from last month
            </div>
          )}
          {!showSalary && (
            <p className="text-xs text-muted-foreground mt-1">Click eye icon to reveal</p>
          )}
        </div>

        {/* Gross & Deductions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Gross</p>
            <p className="text-lg font-bold text-green-600">{formatAmount(payslipData.gross)}</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Deductions</p>
            <p className="text-lg font-bold text-red-600">{formatAmount(payslipData.deductions)}</p>
          </div>
        </div>

        {/* Components Preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Breakdown</p>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
            {payslipData.components.slice(0, 4).map((component, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{component.name}</span>
                <span className={component.type === "earning" ? "text-green-600" : "text-red-600"}>
                  {formatSign(component.amount, component.type)}
                </span>
              </div>
            ))}
          </div>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            View Full Payslip →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
