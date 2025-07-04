// Padding controls component - simplified and compact

import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import { Button } from '~/components/ui/button';
import { useCalculatorState, useCalculatorActions } from '~/stores/calculator-store';

const paddingPresets = [
  { name: 'Minimal', vertical: 0.03, horizontal: 0.02, end: 0.03 },
  { name: 'Standard', vertical: 0.05, horizontal: 0.03, end: 0.05 },
  { name: 'Conservative', vertical: 0.10, horizontal: 0.05, end: 0.075 }
];

export function PaddingControls() {
  const { paddingParameters } = useCalculatorState();
  const { setPaddingParameters } = useCalculatorActions();

  const handleSliderChange = (field: keyof typeof paddingParameters, values: number[]) => {
    setPaddingParameters({ [field]: values[0] });
  };

  const applyPreset = (preset: typeof paddingPresets[0]) => {
    setPaddingParameters({
      verticalPadding: preset.vertical,
      horizontalPadding: preset.horizontal,
      endPadding: preset.end
    });
  };

  const formatValue = (value: number) => {
    return (value * 100).toFixed(0); // Convert to cm
  };

  return (
    <div className="space-y-4">
      {/* Preset Buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Presets</Label>
        <div className="flex gap-2">
          {paddingPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="text-xs flex-1"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Compact Padding Controls */}
      <div className="space-y-3">
        {/* Vertical Padding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Vertical ({formatValue(paddingParameters.verticalPadding)}cm)</Label>
          </div>
          <Slider
            value={[paddingParameters.verticalPadding]}
            onValueChange={(values) => handleSliderChange('verticalPadding', values)}
            max={0.15}
            min={0.01}
            step={0.005}
            className="w-full"
          />
        </div>

        {/* Horizontal Padding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Horizontal ({formatValue(paddingParameters.horizontalPadding)}cm)</Label>
          </div>
          <Slider
            value={[paddingParameters.horizontalPadding]}
            onValueChange={(values) => handleSliderChange('horizontalPadding', values)}
            max={0.10}
            min={0.01}
            step={0.005}
            className="w-full"
          />
        </div>

        {/* End Padding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">End Clearance ({formatValue(paddingParameters.endPadding)}cm)</Label>
          </div>
          <Slider
            value={[paddingParameters.endPadding]}
            onValueChange={(values) => handleSliderChange('endPadding', values)}
            max={0.10}
            min={0.01}
            step={0.005}
            className="w-full"
          />
        </div>
      </div>

      {/* Compact Summary */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
        <span className="font-medium">Current:</span> 
        {formatValue(paddingParameters.verticalPadding)}cm top, 
        {formatValue(paddingParameters.horizontalPadding)}cm sides, 
        {formatValue(paddingParameters.endPadding)}cm ends
      </div>
    </div>
  );
}