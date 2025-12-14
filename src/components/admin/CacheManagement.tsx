import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, Trash2, RefreshCw, CheckCircle } from "lucide-react";
import { getCacheStatus, clearAllCaches, CacheStatus } from "@/lib/serviceWorker";
import { toast } from "@/hooks/use-toast";

export const CacheManagement = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const fetchCacheStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getCacheStatus();
      setCacheStatus(status);
    } catch (error) {
      console.error("Failed to get cache status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheStatus();
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      const success = await clearAllCaches();
      if (success) {
        toast({
          title: "Cache cleared",
          description: "All cached data has been removed successfully.",
        });
        await fetchCacheStatus();
      } else {
        toast({
          title: "Failed to clear cache",
          description: "Service worker may not be active.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const totalItems = cacheStatus 
    ? cacheStatus.static + cacheStatus.api + cacheStatus.admin 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Cache Management
        </CardTitle>
        <CardDescription>
          View and manage cached assets for offline access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ) : cacheStatus ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Cache Version</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {cacheStatus.version}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Static Assets</span>
                <span className="text-sm text-muted-foreground">
                  {cacheStatus.static} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">API Responses</span>
                <span className="text-sm text-muted-foreground">
                  {cacheStatus.api} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Admin Modules</span>
                <span className="text-sm text-muted-foreground">
                  {cacheStatus.admin} items
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium text-foreground">Total Cached</span>
                <span className="text-sm font-medium text-foreground">
                  {totalItems} items
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                Offline mode enabled
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Service worker not active. Cache unavailable.
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCacheStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearCache}
              disabled={isClearing || !cacheStatus}
            >
              <Trash2 className={`h-4 w-4 mr-2 ${isClearing ? 'animate-pulse' : ''}`} />
              Clear Cache
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
