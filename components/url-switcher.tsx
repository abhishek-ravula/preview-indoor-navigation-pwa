"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const demoUrls = [
  {
    name: "Elite Heights - Basement 1",
    url: "?society=elite-heights&floor=basement1",
    description: "Main parking level with 3 POIs",
  },
  {
    name: "Elite Heights - Basement 2",
    url: "?society=elite-heights&floor=basement2",
    description: "Storage level with 2 POIs",
  },
  {
    name: "Grand Plaza - Basement 1",
    url: "?society=grand-plaza&floor=basement1",
    description: "Premium society with VIP parking",
  },
];

export function UrlSwitcher() {
  const handleUrlChange = (url: string) => {
    window.location.href = url;
  };

  return (
    <Card className="mb-4 bg-yellow-50 border-yellow-200 mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Demo: Try Different Maps
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {demoUrls.map((demo, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left h-auto p-3 bg-transparent"
              onClick={() => handleUrlChange(demo.url)}
            >
              <div>
                <div className="font-medium text-sm">{demo.name}</div>
                <div className="text-xs text-gray-600">{demo.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
