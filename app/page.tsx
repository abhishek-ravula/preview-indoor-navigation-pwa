"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  X,
  Info,
  Loader2,
} from "lucide-react";
import { UrlSwitcher } from "@/components/url-switcher";

// Mock API data structure
interface MapData {
  svgUrl: string;
  entranceCoords: { x: number; y: number };
  pois: Array<{
    id: string;
    label: string;
    x: number;
    y: number;
    description: string;
    color: string;
    eta: string;
    steps: string;
  }>;
  paths: Record<string, number[][]>;
}

// Mock API responses for different societies and floors
const mockApiResponses: Record<string, Record<string, MapData>> = {
  "elite-heights": {
    basement1: {
      svgUrl: "https://cdn.maxpark.app/maps/elite-heights/basement1.svg",
      entranceCoords: { x: 80, y: 380 },
      pois: [
        {
          id: "lift1",
          label: "Lift 1",
          x: 180,
          y: 180,
          description:
            "Main elevator access to all floors, near security office",
          color: "#2A6EE5",
          eta: "2 min",
          steps: "150 steps",
        },
        {
          id: "blocka",
          label: "Block A",
          x: 450,
          y: 120,
          description: "Residential Block A entrance, main building access",
          color: "#10b981",
          eta: "3 min",
          steps: "220 steps",
        },
        {
          id: "parking",
          label: "Visitor Parking",
          x: 420,
          y: 320,
          description: "Designated visitor parking area, well-lit section",
          color: "#FF6B00",
          eta: "1 min",
          steps: "80 steps",
        },
      ],
      paths: {
        lift1: [
          [80, 380],
          [80, 330],
          [160, 330],
          [180, 180],
        ],
        blocka: [
          [80, 380],
          [80, 300],
          [200, 300],
          [300, 200],
          [450, 120],
        ],
        parking: [
          [80, 380],
          [200, 380],
          [300, 350],
          [420, 320],
        ],
      },
    },
    basement2: {
      svgUrl: "https://cdn.maxpark.app/maps/elite-heights/basement2.svg",
      entranceCoords: { x: 100, y: 400 },
      pois: [
        {
          id: "lift2",
          label: "Lift 2",
          x: 200,
          y: 150,
          description: "Secondary elevator, maintenance access",
          color: "#2A6EE5",
          eta: "3 min",
          steps: "200 steps",
        },
        {
          id: "storage",
          label: "Storage Area",
          x: 350,
          y: 200,
          description: "Resident storage lockers and utility room",
          color: "#8b5cf6",
          eta: "2 min",
          steps: "120 steps",
        },
      ],
      paths: {
        lift2: [
          [100, 400],
          [150, 350],
          [200, 150],
        ],
        storage: [
          [100, 400],
          [250, 300],
          [350, 200],
        ],
      },
    },
  },
  "grand-plaza": {
    basement1: {
      svgUrl: "https://cdn.maxpark.app/maps/grand-plaza/basement1.svg",
      entranceCoords: { x: 60, y: 420 },
      pois: [
        {
          id: "lift1",
          label: "Main Lift",
          x: 150,
          y: 200,
          description: "Primary elevator to all floors",
          color: "#2A6EE5",
          eta: "1.5 min",
          steps: "100 steps",
        },
        {
          id: "blockb",
          label: "Block B",
          x: 400,
          y: 150,
          description: "Block B residential entrance",
          color: "#10b981",
          eta: "4 min",
          steps: "280 steps",
        },
        {
          id: "vipparking",
          label: "VIP Parking",
          x: 350,
          y: 350,
          description: "Premium parking section",
          color: "#FF6B00",
          eta: "2 min",
          steps: "140 steps",
        },
      ],
      paths: {
        lift1: [
          [60, 420],
          [100, 350],
          [150, 200],
        ],
        blockb: [
          [60, 420],
          [200, 300],
          [350, 200],
          [400, 150],
        ],
        vipparking: [
          [60, 420],
          [250, 400],
          [350, 350],
        ],
      },
    },
  },
};

// Simulate API call delay
const simulateApiCall = (data: MapData): Promise<MapData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 800);
  });
};

const youAreHere = { x: 80, y: 380 };

export default function IndoorNavigation() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [society, setSociety] = useState<string>("");
  const [floor, setFloor] = useState<string>("");

  useEffect(() => {
    // Parse query parameters
    const query = new URLSearchParams(window.location.search);
    const societyParam = query.get("society") || "elite-heights";
    const floorParam = query.get("floor") || "basement1";

    setSociety(societyParam);
    setFloor(floorParam);

    // Simulate API call to fetch map data
    const fetchMapData = async () => {
      setIsLoadingMap(true);

      try {
        const mockResponse = mockApiResponses[societyParam]?.[floorParam];

        if (mockResponse) {
          const data = await simulateApiCall(mockResponse);
          setMapData(data);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        } else {
          // Fallback to default data if society/floor not found
          const defaultData = mockApiResponses["elite-heights"]["basement1"];
          const data = await simulateApiCall(defaultData);
          setMapData(data);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
        }
      } catch (error) {
        console.error("Failed to load map data:", error);
      } finally {
        setIsLoadingMap(false);
      }
    };

    fetchMapData();
  }, []);

  const handlePOIClick = (poi: any) => {
    setIsNavigating(true);
    setShowPath(false);

    // Simulate loading with realistic delay
    setTimeout(() => {
      setSelectedPOI(poi);
      setShowPath(true);
      setIsNavigating(false);
    }, 1200);
  };

  const handleNavigate = () => {
    // Simulate navigation start
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
    }, 1500);
  };

  const handleEndTrip = () => {
    setShowEndTripModal(true);
  };

  const handleStartNew = () => {
    setSelectedPOI(null);
    setShowPath(false);
    setShowEndTripModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const generatePath = (poi: any) => {
    if (!mapData?.paths[poi.id]) {
      return `M ${mapData?.entranceCoords.x} ${mapData?.entranceCoords.y} L ${poi.x} ${poi.y}`;
    }

    const pathPoints = mapData.paths[poi.id];
    let pathString = `M ${pathPoints[0][0]} ${pathPoints[0][1]}`;

    for (let i = 1; i < pathPoints.length; i++) {
      pathString += ` L ${pathPoints[i][0]} ${pathPoints[i][1]}`;
    }

    return pathString;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-500">
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                Map loaded for {society} - {floor}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-700 h-6 w-6 p-0"
              onClick={() => setShowToast(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Indoor Navigation
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              You are here. Select a destination to view the path.
            </p>
          </div>
          <Sheet open={showLegend} onOpenChange={setShowLegend}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent"
              >
                <Info className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Map Legend</SheetTitle>
                <SheetDescription>
                  Understanding the floor plan markers and symbols
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Your Location</p>
                    <p className="text-xs text-gray-600">
                      Current position marker
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-blue-600 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Elevators & Lifts</p>
                    <p className="text-xs text-gray-600">
                      Vertical transportation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Building Blocks</p>
                    <p className="text-xs text-gray-600">
                      Residential entrances
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-orange-500 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Parking Areas</p>
                    <p className="text-xs text-gray-600">
                      Visitor & resident parking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-1 bg-red-500 flex-shrink-0"
                    style={{ borderStyle: "dashed" }}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">Navigation Path</p>
                    <p className="text-xs text-gray-600">
                      Route to destination
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Map Loading State */}
      {isLoadingMap && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Map Data
            </h2>
            <p className="text-sm text-gray-600 mb-1">Society: {society}</p>
            <p className="text-sm text-gray-600">Floor: {floor}</p>
          </div>
        </div>
      )}

      {!isLoadingMap && mapData && (
        <main className="flex-1 p-4 pb-20">
          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg border p-4 mb-4">
            <div className="relative w-full max-w-2xl mx-auto">
              <svg
                viewBox="0 0 500 450"
                className="w-full h-auto border rounded-lg bg-gray-100"
                style={{ aspectRatio: "500/450" }}
              >
                {/* Floor Plan Background */}
                <rect
                  width="500"
                  height="450"
                  fill="#f8f9fa"
                  stroke="#e9ecef"
                  strokeWidth="2"
                />

                {/* Parking Spaces - Left Side */}
                {Array.from({ length: 6 }, (_, i) => (
                  <g key={`parking-left-${i}`}>
                    <rect
                      x="20"
                      y={60 + i * 50}
                      width="80"
                      height="35"
                      fill="none"
                      stroke="#adb5bd"
                      strokeWidth="2"
                      rx="4"
                    />
                    <rect
                      x="110"
                      y={60 + i * 50}
                      width="80"
                      height="35"
                      fill="none"
                      stroke="#adb5bd"
                      strokeWidth="2"
                      rx="4"
                    />
                  </g>
                ))}

                {/* Central Driving Area */}
                <path
                  d="M 200 50 L 200 400 L 350 400 L 350 200 L 480 200 L 480 50 Z"
                  fill="none"
                  stroke="#6c757d"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                />

                {/* Right Side Parking */}
                <rect
                  x="360"
                  y="250"
                  width="120"
                  height="40"
                  fill="none"
                  stroke="#adb5bd"
                  strokeWidth="2"
                  rx="4"
                />
                <rect
                  x="360"
                  y="300"
                  width="120"
                  height="40"
                  fill="none"
                  stroke="#adb5bd"
                  strokeWidth="2"
                  rx="4"
                />

                {/* Entrance Area */}
                <rect
                  x="40"
                  y="380"
                  width="100"
                  height="30"
                  fill="#e3f2fd"
                  stroke="#2196f3"
                  strokeWidth="2"
                  rx="6"
                />
                <text
                  x="90"
                  y="400"
                  textAnchor="middle"
                  className="text-xs font-medium fill-blue-700"
                  fontSize="11"
                >
                  ENTRANCE
                </text>

                {/* Animated Navigation Path */}
                {showPath && selectedPOI && (
                  <g>
                    <path
                      d={generatePath(selectedPOI)}
                      fill="none"
                      stroke="#FF6B00"
                      strokeWidth="4"
                      strokeDasharray="12,8"
                      className="animate-pulse"
                      opacity="0.8"
                    />
                    <path
                      d={generatePath(selectedPOI)}
                      fill="none"
                      stroke="#FF6B00"
                      strokeWidth="2"
                      strokeDasharray="12,8"
                      className="animate-pulse"
                      style={{
                        animation: "dash 2s linear infinite",
                      }}
                    />
                  </g>
                )}

                {/* You Are Here Marker */}
                <g>
                  <circle
                    cx={mapData.entranceCoords.x}
                    cy={mapData.entranceCoords.y}
                    r="16"
                    fill="#dc3545"
                    stroke="white"
                    strokeWidth="4"
                    className="drop-shadow-lg animate-pulse"
                  />
                  <circle
                    cx={mapData.entranceCoords.x}
                    cy={mapData.entranceCoords.y}
                    r="6"
                    fill="white"
                  />
                  <text
                    x={mapData.entranceCoords.x}
                    y={mapData.entranceCoords.y - 25}
                    textAnchor="middle"
                    className="text-xs font-bold fill-red-600"
                    fontSize="12"
                  >
                    You Are Here
                  </text>
                </g>

                {/* POI Markers */}
                {mapData.pois.map((poi) => (
                  <g key={poi.id}>
                    <rect
                      x={poi.x - 16}
                      y={poi.y - 16}
                      width="32"
                      height="32"
                      fill={poi.color}
                      stroke="white"
                      strokeWidth="3"
                      rx="8"
                      className={`
                  cursor-pointer
                  transition-transform duration-300 ease-out
                  drop-shadow-lg
                  ${
                    selectedPOI?.id === poi.id
                      ? "scale-[1.25] animate-pulse"
                      : "hover:scale-110"
                  }
                `}
                      onClick={() => handlePOIClick(poi)}
                      style={{ transformOrigin: "center" }}
                    />
                    <text
                      x={poi.x}
                      y={poi.y + 6}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white pointer-events-none"
                      fontSize="14"
                    >
                      {poi.id === "lift1" || poi.id === "lift2"
                        ? "L" + poi.id.slice(-1)
                        : poi.id === "blocka" || poi.id === "blockb"
                        ? poi.id.slice(-1).toUpperCase()
                        : "P"}
                    </text>
                    <text
                      x={poi.x}
                      y={poi.y - (selectedPOI?.id === poi.id ? 30 : 25)}
                      textAnchor="middle"
                      className="text-xs font-semibold pointer-events-none"
                      fill={poi.color}
                      fontSize="11"
                    >
                      {poi.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Loading State */}
          {isNavigating && (
            <Card className="mb-4 border-l-4 border-l-blue-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    Calculating optimal route...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Destination Info Panel */}
          {selectedPOI && !isNavigating && (
            <Card
              className="mb-4 border-l-4 shadow-lg"
              style={{ borderLeftColor: selectedPOI.color }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: selectedPOI.color }}
                    ></div>
                    {selectedPOI.label}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 rounded-full px-3"
                  >
                    Selected
                  </Badge>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {selectedPOI.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{selectedPOI.eta}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{selectedPOI.steps}</span>
                  </div>
                </div>
                <Button
                  onClick={handleNavigate}
                  className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: "#2A6EE5" }}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Navigation...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {mapData.pois.length}
                  </p>
                  <p className="text-xs text-gray-600">Destinations</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">24/7</p>
                  <p className="text-xs text-gray-600">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedPOI ? selectedPOI.eta : "--"}
                  </p>
                  <p className="text-xs text-gray-600">Est. Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo URL Switcher - Remove in production */}
          {/* <UrlSwitcher /> */}
        </main>
      )}

      {/* Sticky Trip Done Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <Button
          onClick={handleEndTrip}
          variant="destructive"
          className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          size="lg"
        >
          Trip Done
        </Button>
      </div>

      {/* End Trip Modal */}
      <Dialog open={showEndTripModal} onOpenChange={setShowEndTripModal}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Trip Completed</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Your navigation session has ended successfully. Map data has been
              cleared for privacy and security.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowEndTripModal(false)}
              className="w-full sm:w-auto rounded-xl"
            >
              Close
            </Button>
            <Button
              onClick={handleStartNew}
              className="w-full sm:w-auto rounded-xl"
              style={{ backgroundColor: "#2A6EE5" }}
            >
              Start New Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  );
}
