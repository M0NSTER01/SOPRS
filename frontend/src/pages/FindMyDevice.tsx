import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Clock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import Map from "@/components/Map";
import { fetchWithFallback } from "@/lib/api";

const FindMyDevice = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      setDeviceId(idParam);
    }
  }, [searchParams]);

const handleAuthenticatedSearch = async (deviceId: string) => {
  setSelectedDevice(null);

  try {
    const res = await fetchWithFallback(`/locatedevice/${deviceId}`);
    if (!res.ok) {
      toast.error("Device not found in network");
      return;
    }

    const data = await res.json();

    // The backend already sends normalized data
    setSelectedDevice(data);
    toast.success(`Located ${data.name}!`);
  } catch (error) {
    console.error("Authenticated search error:", error);
    toast.error("Error fetching device location");
  }
};



  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceId.trim()) {
      toast.error("Please enter a device ID");
      return;
    }

    setIsSearching(true);
    setSelectedDevice(null);

    try {
      const res = await fetchWithFallback(`/locatedevice/${deviceId}`);
      if (!res.ok) {
        toast.error("Device not found in network");
        setIsSearching(false);
        return;
      }

      const data = await res.json();

      setSelectedDevice(data);
      toast.success(`Device ${data.name} found!`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching device");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Find My Device</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Enter your device ID to see its last known location on the map.
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-elegant border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl">Device Search</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {isAuthenticated && user?.devices && user.devices.length > 0 && (
                  <div className="space-y-4 pb-4 border-b border-border">
                    <Label className="text-sm font-medium text-foreground">Select Saved Device</Label>
                    <Select
                      value={selectedDeviceId}
                      onValueChange={(value) => {
                        setSelectedDeviceId(value);
                        setDeviceId(value); // Fix: Populate the manual search box too
                        handleAuthenticatedSearch(value);
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a registered device to locate" />
                      </SelectTrigger>
                      <SelectContent>
                        {user.devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name} ({device.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <form onSubmit={handleManualSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceId" className="text-sm font-medium text-foreground">
                      Search by Device ID
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="deviceId"
                        type="text"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        placeholder="Enter Device ID (e.g. SIH_PROJECT_COBRA)"
                        className="h-11 font-mono text-sm"
                        disabled={isSearching}
                      />
                      <Button 
                        type="submit" 
                        className="h-11 px-6 font-medium shrink-0 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_16px_rgba(37,99,235,0.3)]" 
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Locate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="shadow-elegant border-0 mb-8">
            <CardContent className="p-0">
              <div className="h-96 rounded-lg overflow-hidden">
                {selectedDevice ? (
                  <Map
                    latitude={selectedDevice.location.lat}
                    longitude={selectedDevice.location.lng}
                    deviceName={selectedDevice.name}
                    address={selectedDevice.location.address}
                  />
                ) : (
                  <div className="h-full bg-gradient-hero rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="text-center z-10">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">Map will be displayed here...</p>
                      <p className="text-muted-foreground">Search for a device to see its location</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          {selectedDevice && (
            <Card className="shadow-elegant border-0">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Device Located</h3>
                      <p className="text-sm text-muted-foreground">Last known location</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Device</p>
                      <p className="text-foreground">{selectedDevice.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                      <p className="text-foreground">{selectedDevice.location.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Last Seen</p>
                      <p className="text-foreground flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedDevice.lastSeen}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMyDevice;
