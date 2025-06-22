"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FeatureInputProps {
  features: string[];
  onFeaturesChange: (features: string[]) => void;
}

export function FeatureInput({
  features,
  onFeaturesChange,
}: FeatureInputProps) {
  const [currentFeature, setCurrentFeature] = useState("");

  const addFeature = () => {
    if (currentFeature.trim() && !features.includes(currentFeature.trim())) {
      onFeaturesChange([...features, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    onFeaturesChange(features.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Features</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Add a feature..."
          value={currentFeature}
          onChange={(e) => setCurrentFeature(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="outline" onClick={addFeature}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={() => removeFeature(index)}
            title="Click to remove"
          >
            {feature} ×
          </Badge>
        ))}
      </div>
    </div>
  );
}
