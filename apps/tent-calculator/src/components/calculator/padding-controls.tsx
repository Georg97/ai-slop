// Padding controls component

import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useCalculatorState, useCalculatorActions } from '~/stores/calculator-store';

const paddingPresets = [
  { name: 'Minimal', vertical: 0.03, horizontal: 0.02, end: 0.03 },
  { name: 'Standard', vertical: 0.05, horizontal: 0.03, end: 0.05 },
  { name: 'Conservative', vertical: 0.10, horizontal: 0.05, end: 0.075 },
  { name: 'Maximum', vertical: 0.15, horizontal: 0.08, end: 0.10 }
];

export function PaddingControls() {
  const { paddingParameters } = useCalculatorState();
  const { setPaddingParameters } = useCalculatorActions();

  const handleSliderChange = (field: keyof typeof paddingParameters, values: number[]) => {
    setPaddingParameters({ [field]: values[0] });
  };

  const handleInputChange = (field: keyof typeof paddingParameters, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 0.5) {
      setPaddingParameters({ [field]: numValue });
    }
  };

  const applyPreset = (preset: typeof paddingPresets[0]) => {
    setPaddingParameters({
      verticalPadding: preset.vertical,
      horizontalPadding: preset.horizontal,
      endPadding: preset.end
    });
  };

  const formatValue = (value: number) => {
    return (value * 100).toFixed(1); // Convert to cm and format
  };

  return (
    <div className="space-y-6">
      {/* Preset Buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          {paddingPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Padding Controls */}
      <div className="space-y-5">
        {/* Vertical Padding */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="verticalPadding" className="text-sm font-medium">
              Vertical Padding
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="verticalPadding"
                type="number"
                step="0.001"
                min="0"
                max="0.5"
                value={(paddingParameters.verticalPadding).toFixed(3)}
                onChange={(e) => handleInputChange('verticalPadding', e.target.value)}
                className="w-20 h-8 text-xs"
              />
              <span className="text-xs text-muted-foreground">m</span>
            </div>
          </div>
          <Slider
            value={[paddingParameters.verticalPadding]}
            onValueChange={(values) => handleSliderChange('verticalPadding', values)}
            max={0.2}
            min={0.01}
            step={0.005}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Clearance from tent peak to tarp ({formatValue(paddingParameters.verticalPadding)}cm)
          </p>
        </div>

        {/* Horizontal Padding */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="horizontalPadding" className="text-sm font-medium">
              Horizontal Padding
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="horizontalPadding"
                type="number"
                step="0.001"
                min="0"
                max="0.3"
                value={(paddingParameters.horizontalPadding).toFixed(3)}
                onChange={(e) => handleInputChange('horizontalPadding', e.target.value)}
                className="w-20 h-8 text-xs"
              />
              <span className="text-xs text-muted-foreground">m</span>
            </div>
          </div>
          <Slider
            value={[paddingParameters.horizontalPadding]}
            onValueChange={(values) => handleSliderChange('horizontalPadding', values)}
            max={0.15}
            min={0.01}
            step={0.005}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Clearance from tent sides to tarp edges ({formatValue(paddingParameters.horizontalPadding)}cm each side)
          </p>
        </div>

        {/* End Padding */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="endPadding" className="text-sm font-medium">
              End Padding
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="endPadding"
                type="number"
                step="0.001"
                min="0"
                max="0.3"
                value={(paddingParameters.endPadding).toFixed(3)}
                onChange={(e) => handleInputChange('endPadding', e.target.value)}
                className="w-20 h-8 text-xs"
              />
              <span className="text-xs text-muted-foreground">m</span>
            </div>
          </div>
          <Slider
            value={[paddingParameters.endPadding]}
            onValueChange={(values) => handleSliderChange('endPadding', values)}
            max={0.15}
            min={0.01}
            step={0.005}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Clearance from tent ends to tarp edges ({formatValue(paddingParameters.endPadding)}cm)
          </p>
        </div>
      </div>

      {/* Padding Summary */}
      <div className="p-3 bg-muted rounded-lg text-xs">
        <h4 className="font-medium mb-2">Padding Summary:</h4>
        <div className="space-y-1 text-muted-foreground">
          <p>Top clearance: {formatValue(paddingParameters.verticalPadding)}cm</p>
          <p>Side clearance: {formatValue(paddingParameters.horizontalPadding)}cm each</p>
          <p>End clearance: {formatValue(paddingParameters.endPadding)}cm</p>
          <p className="font-medium text-foreground mt-2">
            Total width reduction: {formatValue(paddingParameters.horizontalPadding * 2)}cm
          </p>
        </div>
      </div>
    </div>
  );
}