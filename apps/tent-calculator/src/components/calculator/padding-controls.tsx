// Padding controls component - simplified and compact (using cm)

import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import { Button } from '~/components/ui/button';
import { useCalculatorState, useCalculatorActions } from '~/stores/calculator-store';

const paddingPresets = [
  { name: 'Minimal', vertical: 3, horizontal: 2, end: 3 }, // cm values
  { name: 'Standard', vertical: 5, horizontal: 3, end: 5 },
  { name: 'Conservative', vertical: 10, horizontal: 5, end: 8 } // rounded to whole number
];

export function PaddingControls() {
  const { paddingParameters } = useCalculatorState();
  const { setPaddingParameters } = useCalculatorActions();

  const handleSliderChange = (field: keyof typeof paddingParameters, cmValues: number[]) => {
    // Convert cm to meters for internal storage
    const meterValue = (cmValues[0] ?? 0) / 100;
    setPaddingParameters({ [field]: meterValue });
  };

  const applyPreset = (preset: typeof paddingPresets[0]) => {
    setPaddingParameters({
      // Convert cm to meters for storage
      verticalPadding: preset.vertical / 100,
      horizontalPadding: preset.horizontal / 100,
      endPadding: preset.end / 100
    });
  };

  const formatValue = (meterValue: number) => {
    return Math.round(meterValue * 100).toString(); // Convert to cm (whole numbers)
  };

  // Convert meter values to cm for sliders
  const getCmValue = (meterValue: number) => meterValue * 100;

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
            value={[getCmValue(paddingParameters.verticalPadding)]}
            onValueChange={(values) => handleSliderChange('verticalPadding', values)}
            max={15}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Horizontal Padding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Horizontal ({formatValue(paddingParameters.horizontalPadding)}cm)</Label>
          </div>
          <Slider
            value={[getCmValue(paddingParameters.horizontalPadding)]}
            onValueChange={(values) => handleSliderChange('horizontalPadding', values)}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* End Padding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">End Clearance ({formatValue(paddingParameters.endPadding)}cm)</Label>
          </div>
          <Slider
            value={[getCmValue(paddingParameters.endPadding)]}
            onValueChange={(values) => handleSliderChange('endPadding', values)}
            max={10}
            min={1}
            step={1}
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