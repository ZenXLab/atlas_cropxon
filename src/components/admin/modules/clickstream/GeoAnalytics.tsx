import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Radio, MapPin, Users, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface GeoAnalyticsProps {
  events: Array<{
    session_id: string;
    page_url: string | null;
    created_at: string;
    metadata?: unknown;
  }>;
}

interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
}

interface RegionData {
  name: string;
  code: string;
  x: number;
  y: number;
  sessions: number;
  color: string;
  cities: string[];
  isCurrentLocation?: boolean;
  percentage?: number;
}

// Map country codes to approximate positions on our simplified world map
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; color: string }> = {
  IN: { x: 72, y: 45, color: "from-emerald-500 to-teal-600" },
  US: { x: 22, y: 38, color: "from-blue-500 to-indigo-600" },
  GB: { x: 48, y: 32, color: "from-purple-500 to-violet-600" },
  DE: { x: 51, y: 33, color: "from-amber-500 to-orange-600" },
  AU: { x: 82, y: 72, color: "from-pink-500 to-rose-600" },
  CA: { x: 20, y: 28, color: "from-cyan-500 to-sky-600" },
  JP: { x: 85, y: 40, color: "from-red-500 to-rose-600" },
  SG: { x: 76, y: 55, color: "from-green-500 to-emerald-600" },
  FR: { x: 49, y: 35, color: "from-indigo-500 to-blue-600" },
  BR: { x: 32, y: 62, color: "from-yellow-500 to-amber-600" },
  CN: { x: 78, y: 40, color: "from-red-600 to-orange-600" },
  RU: { x: 65, y: 28, color: "from-blue-600 to-indigo-700" },
  AE: { x: 62, y: 48, color: "from-teal-500 to-cyan-600" },
  NL: { x: 50, y: 32, color: "from-orange-500 to-red-600" },
  KR: { x: 83, y: 38, color: "from-sky-500 to-blue-600" },
  PK: { x: 68, y: 42, color: "from-green-600 to-emerald-700" },
  BD: { x: 74, y: 44, color: "from-green-500 to-teal-600" },
  ID: { x: 79, y: 58, color: "from-red-500 to-pink-600" },
  PH: { x: 82, y: 50, color: "from-blue-500 to-cyan-600" },
  VN: { x: 78, y: 50, color: "from-red-600 to-yellow-600" },
  TH: { x: 76, y: 52, color: "from-blue-500 to-red-500" },
  MY: { x: 77, y: 55, color: "from-blue-600 to-yellow-500" },
  DEFAULT: { x: 50, y: 50, color: "from-gray-500 to-slate-600" },
};

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", DE: "Germany",
  AU: "Australia", CA: "Canada", JP: "Japan", SG: "Singapore",
  FR: "France", BR: "Brazil", CN: "China", RU: "Russia",
  AE: "UAE", NL: "Netherlands", KR: "South Korea", PK: "Pakistan",
  BD: "Bangladesh", ID: "Indonesia", PH: "Philippines", VN: "Vietnam",
  TH: "Thailand", MY: "Malaysia"
};

export const GeoAnalytics = ({ events }: GeoAnalyticsProps) => {
  const [currentUserLocation, setCurrentUserLocation] = useState<GeoLocation | null>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Fetch current user's REAL location on mount using IP geolocation
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      setIsLoadingGeo(true);
      setGeoError(null);
      try {
        // Try ipapi.co first (free, no key required, 1000 req/day)
        const response = await fetch("https://ipapi.co/json/", {
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            throw new Error(data.reason || "IP lookup failed");
          }
          setCurrentUserLocation({
            country: data.country_name,
            countryCode: data.country_code,
            city: data.city,
            region: data.region,
            lat: data.latitude,
            lon: data.longitude,
          });
        } else {
          throw new Error("Failed to fetch location");
        }
      } catch (error) {
        console.log("Primary geo lookup failed, trying backup:", error);
        // Try backup service
        try {
          const backupResponse = await fetch("https://ip-api.com/json/?fields=status,country,countryCode,city,regionName,lat,lon");
          if (backupResponse.ok) {
            const backupData = await backupResponse.json();
            if (backupData.status === "success") {
              setCurrentUserLocation({
                country: backupData.country,
                countryCode: backupData.countryCode,
                city: backupData.city,
                region: backupData.regionName,
                lat: backupData.lat,
                lon: backupData.lon,
              });
            } else {
              setGeoError("Could not determine location");
            }
          }
        } catch (backupError) {
          console.error("Backup geo lookup also failed:", backupError);
          setGeoError("Location services unavailable");
        }
      } finally {
        setIsLoadingGeo(false);
      }
    };
    fetchCurrentLocation();
  }, []);

  // Calculate geographic distribution based on REAL session data
  const geoData = useMemo((): RegionData[] => {
    const uniqueSessions = [...new Set(events.map(e => e.session_id))];
    const regionMap = new Map<string, RegionData>();
    
    // Since clickstream events don't store location, we show:
    // 1. Current admin's location as the primary data point
    // 2. All sessions are from the current location (real scenario for local testing)
    
    if (currentUserLocation) {
      const pos = COUNTRY_POSITIONS[currentUserLocation.countryCode] || COUNTRY_POSITIONS.DEFAULT;
      regionMap.set(currentUserLocation.countryCode, {
        name: currentUserLocation.country,
        code: currentUserLocation.countryCode,
        x: pos.x,
        y: pos.y,
        color: pos.color,
        sessions: uniqueSessions.length, // All sessions are from current location
        cities: [currentUserLocation.city],
        isCurrentLocation: true,
      });
    } else if (uniqueSessions.length > 0) {
      // Fallback if location not available - show as unknown
      regionMap.set("UNKNOWN", {
        name: "Unknown Location",
        code: "??",
        x: 50,
        y: 50,
        color: "from-gray-500 to-slate-600",
        sessions: uniqueSessions.length,
        cities: [],
      });
    }

    const regions = Array.from(regionMap.values());
    const maxSessions = Math.max(...regions.map(r => r.sessions), 1);
    
    return regions.map(r => ({ 
      ...r, 
      percentage: (r.sessions / maxSessions) * 100 
    }));
  }, [events, currentUserLocation]);

  const totalSessions = new Set(events.map(e => e.session_id)).size;

  const refreshGeoData = async () => {
    setIsLoadingGeo(true);
    setGeoError(null);
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
          setCurrentUserLocation({
            country: data.country_name,
            countryCode: data.country_code,
            city: data.city,
            region: data.region,
            lat: data.latitude,
            lon: data.longitude,
          });
          toast.success("Location data refreshed");
        } else {
          throw new Error(data.reason);
        }
      }
    } catch (error) {
      toast.error("Could not refresh location data");
      setGeoError("Refresh failed");
    } finally {
      setIsLoadingGeo(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Geographic Analytics
            </CardTitle>
            <CardDescription className="mt-1">
              {currentUserLocation ? (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Your location: <span className="text-primary font-medium">{currentUserLocation.city}, {currentUserLocation.region}, {currentUserLocation.country}</span>
                </span>
              ) : geoError ? (
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertCircle className="h-3 w-3" />
                  {geoError}
                </span>
              ) : (
                "Detecting location..."
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshGeoData}
              disabled={isLoadingGeo}
              className="gap-1"
            >
              {isLoadingGeo ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* World Map Visualization */}
          <div className="relative aspect-[16/10] bg-gradient-to-br from-muted/50 to-muted rounded-xl border overflow-hidden">
            {/* Simple world map background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                {/* Simplified continents */}
                <ellipse cx="20" cy="35" rx="15" ry="12" fill="currentColor" opacity="0.3" />
                <ellipse cx="50" cy="35" rx="10" ry="15" fill="currentColor" opacity="0.3" />
                <ellipse cx="75" cy="45" rx="12" ry="10" fill="currentColor" opacity="0.3" />
                <ellipse cx="85" cy="70" rx="8" ry="6" fill="currentColor" opacity="0.3" />
              </svg>
            </div>

            {/* Location markers */}
            {geoData.filter(r => r.sessions > 0).map((region, idx) => (
              <motion.div
                key={region.code}
                className="absolute"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
              >
                {/* Pulse effect */}
                <motion.div
                  className={`absolute -inset-4 bg-gradient-to-r ${region.color} rounded-full opacity-30`}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                />
                {/* Marker */}
                <div className={`relative w-5 h-5 bg-gradient-to-r ${region.color} rounded-full border-2 border-white shadow-lg cursor-pointer group`}>
                  {/* Current location ring */}
                  {region.isCurrentLocation && (
                    <motion.div
                      className="absolute -inset-2 border-2 border-primary rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap border">
                      <p className="font-semibold">{region.name}</p>
                      <p className="text-muted-foreground">{region.sessions} session{region.sessions !== 1 ? 's' : ''}</p>
                      {region.cities.length > 0 && (
                        <p className="text-primary">{region.cities.join(", ")}</p>
                      )}
                      {region.isCurrentLocation && (
                        <Badge variant="outline" className="mt-1 text-[10px]">Your Location</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {/* Session count badge */}
                {region.sessions > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-background text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    {region.sessions}
                  </motion.span>
                )}
              </motion.div>
            ))}

            {/* Total sessions overlay */}
            <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-bold">{totalSessions}</span>
                <span className="text-xs text-muted-foreground">total sessions</span>
              </div>
            </div>

            {/* Current location badge */}
            {currentUserLocation && (
              <div className="absolute top-3 right-3 bg-primary/10 backdrop-blur-sm rounded-lg px-2 py-1 border border-primary/20">
                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                  <MapPin className="h-3 w-3" />
                  <span>{currentUserLocation.city}</span>
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {isLoadingGeo && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Detecting location...
                </div>
              </div>
            )}
          </div>

          {/* Region breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Session Distribution</h4>
            
            {geoData.length > 0 ? (
              geoData.map((region, idx) => (
                <motion.div
                  key={region.code}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${region.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {region.code.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{region.name}</span>
                        {region.isCurrentLocation && (
                          <Badge variant="outline" className="text-[10px] px-1 bg-primary/10 text-primary border-primary/30">
                            You
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-semibold">{region.sessions} sessions</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${region.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${region.percentage || 100}%` }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                      />
                    </div>
                    {region.cities.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Cities: {region.cities.join(", ")}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No session data available</p>
                <p className="text-xs mt-1">Start browsing to generate clickstream data</p>
              </div>
            )}

            {/* Info note */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Geographic data is based on your current IP location. 
                All sessions are attributed to detected location.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
