import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, Calendar as CalendarIcon, Clock, Link, X, Search } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export interface SessionFilters {
  pageUrl: string;
  minDuration: number | null;
  maxDuration: number | null;
  dateRange: DateRange | undefined;
  hasRageClicks: boolean;
  hasDeadClicks: boolean;
  hasFormAbandonment: boolean;
}

interface SessionFiltersProps {
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
  onClear: () => void;
}

export const defaultFilters: SessionFilters = {
  pageUrl: "",
  minDuration: null,
  maxDuration: null,
  dateRange: undefined,
  hasRageClicks: false,
  hasDeadClicks: false,
  hasFormAbandonment: false,
};

export const SessionFiltersPanel = ({ filters, onFiltersChange, onClear }: SessionFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = [
    filters.pageUrl,
    filters.minDuration,
    filters.maxDuration,
    filters.dateRange,
    filters.hasRageClicks,
    filters.hasDeadClicks,
    filters.hasFormAbandonment,
  ].filter(Boolean).length;

  const updateFilter = <K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Session Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClear}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Page URL Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-sm">
                <Link className="h-3 w-3" />
                Page URL Contains
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="/pricing, /contact..."
                  value={filters.pageUrl}
                  onChange={(e) => updateFilter("pageUrl", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Duration Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3" />
                Duration (seconds)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minDuration || ""}
                  onChange={(e) => updateFilter("minDuration", e.target.value ? Number(e.target.value) : null)}
                  className="w-20"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration || ""}
                  onChange={(e) => updateFilter("maxDuration", e.target.value ? Number(e.target.value) : null)}
                  className="w-20"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-sm">
                <CalendarIcon className="h-3 w-3" />
                Date Range
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "MMM d")} -{" "}
                          {format(filters.dateRange.to, "MMM d")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span className="text-muted-foreground">Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => updateFilter("dateRange", range)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Highlight Filters */}
            <div className="space-y-2">
              <Label className="text-sm">Highlight Events</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filters.hasRageClicks ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => updateFilter("hasRageClicks", !filters.hasRageClicks)}
                >
                  🔥 Rage Clicks
                </Badge>
                <Badge
                  variant={filters.hasDeadClicks ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => updateFilter("hasDeadClicks", !filters.hasDeadClicks)}
                >
                  💀 Dead Clicks
                </Badge>
                <Badge
                  variant={filters.hasFormAbandonment ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => updateFilter("hasFormAbandonment", !filters.hasFormAbandonment)}
                >
                  📝 Form Abandon
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
