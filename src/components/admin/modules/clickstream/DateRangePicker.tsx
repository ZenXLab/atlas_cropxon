import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, X } from "lucide-react";
import { format, subDays, subHours, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value: string;
  onChange: (value: string, customRange?: { from: Date; to: Date }) => void;
  customRange?: { from: Date; to: Date } | null;
}

export const DateRangePicker = ({ value, onChange, customRange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    customRange ? { from: customRange.from, to: customRange.to } : undefined
  );

  const presets = [
    { label: "Last Hour", value: "1h", getRange: () => ({ from: subHours(new Date(), 1), to: new Date() }) },
    { label: "Last 24h", value: "24h", getRange: () => ({ from: subDays(new Date(), 1), to: new Date() }) },
    { label: "Last 7 Days", value: "7d", getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 Days", value: "30d", getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "Last 90 Days", value: "90d", getRange: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getRange();
    setSelectedRange({ from: range.from, to: range.to });
    onChange(preset.value);
    setIsOpen(false);
  };

  const handleApplyCustomRange = () => {
    if (selectedRange?.from && selectedRange?.to) {
      onChange("custom", { 
        from: startOfDay(selectedRange.from), 
        to: endOfDay(selectedRange.to) 
      });
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (value === "custom" && customRange) {
      return `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d, yyyy")}`;
    }
    const preset = presets.find(p => p.value === value);
    return preset?.label || "Select Range";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 min-w-40">
          <CalendarIcon className="h-4 w-4" />
          <span className="truncate">{getDisplayText()}</span>
          {value === "custom" && (
            <Badge variant="secondary" className="ml-1 text-[10px] px-1">Custom</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          {/* Presets */}
          <div className="border-r p-3 space-y-1 min-w-36">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Quick Select</p>
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant={value === preset.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => handlePresetClick(preset)}
              >
                <Clock className="h-3 w-3 mr-2" />
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Custom Range</p>
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={setSelectedRange}
              numberOfMonths={2}
              defaultMonth={subDays(new Date(), 30)}
              disabled={{ after: new Date() }}
              className={cn("p-3 pointer-events-auto")}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                {selectedRange?.from && selectedRange?.to ? (
                  <span>
                    {format(selectedRange.from, "MMM d, yyyy")} - {format(selectedRange.to, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span>Select start and end dates</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedRange(undefined);
                    onChange("24h");
                    setIsOpen(false);
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  disabled={!selectedRange?.from || !selectedRange?.to}
                  onClick={handleApplyCustomRange}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
