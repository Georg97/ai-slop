// Dimension inputs component - dynamic based on calculation mode (using cm)

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { useCalculatorState, useCalculatorActions } from '~/stores/calculator-store';

export function DimensionInputs() {
  const { tentDimensions, calculationMode } = useCalculatorState();
  const { setTentDimensions } = useCalculatorActions();

  const handleInputChange = (field: keyof typeof tentDimensions, value: string) => {
    const cmValue = value === '' ? undefined : parseInt(value, 10);
    if (value === '' || (!isNaN(cmValue!) && cmValue! > 0)) {
      // Convert cm to meters for internal storage
      const meterValue = cmValue ? cmValue / 100 : undefined;
      setTentDimensions({ [field]: meterValue });
    }
  };

  const formatValue = (meterValue: number | undefined) => {
    // Convert meters to cm for display (whole numbers only)
    return meterValue ? Math.round(meterValue * 100).toString() : '';
  };

  // Get mode description
  const getModeDescription = () => {
    switch (calculationMode) {
      case 'solve_height':
        return 'Provide floor width to calculate maximum tent heights';
      case 'solve_width':
        return 'Provide tent heights to calculate maximum floor width';
      case 'solve_padding':
        return 'Provide all dimensions to calculate minimum padding';
      case 'validate':
        return 'Provide all dimensions to validate fit within constraints';
      default:
        return '';
    }
  };

  // Get which fields to show based on mode
  const getVisibleFields = () => {
    switch (calculationMode) {
      case 'solve_height':
        return ['floorWidth'];
      case 'solve_width':
        return ['footHeight', 'headHeight'];
      case 'solve_padding':
      case 'validate':
        return ['floorWidth', 'footHeight', 'headHeight'];
      default:
        return ['floorWidth', 'footHeight', 'headHeight'];
    }
  };

  const visibleFields = getVisibleFields();

  return (
    <div className="space-y-4">
      {/* Mode Description */}
      <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        {getModeDescription()}
      </div>

      {/* Fixed Dimensions Info - compact */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
        <span className="font-medium">Fixed:</span> Length: {Math.round(tentDimensions.length * 100)}cm, 
        Foot Base: {Math.round(tentDimensions.footBaseWidth * 100)}cm, 
        Head Base: {Math.round(tentDimensions.headBaseWidth * 100)}cm
      </div>

      {/* Dynamic Input Fields */}
      <div className="space-y-3">
        {visibleFields.includes('floorWidth') && (
          <div className="space-y-1">
            <Label htmlFor="floorWidth" className="text-sm font-medium">
              Floor Width (cm) *
            </Label>
            <Input
              id="floorWidth"
              type="number"
              step="1"
              min="10"
              max="200"
              placeholder="e.g., 100"
              value={formatValue(tentDimensions.floorWidth)}
              onChange={(e) => handleInputChange('floorWidth', e.target.value)}
              className="border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Width of tent floor at ground level
            </p>
          </div>
        )}

        {visibleFields.includes('footHeight') && (
          <div className="space-y-1">
            <Label htmlFor="footHeight" className="text-sm font-medium">
              Foot Height (cm) *
            </Label>
            <Input
              id="footHeight"
              type="number"
              step="1"
              min="10"
              max="200"
              placeholder="e.g., 70"
              value={formatValue(tentDimensions.footHeight)}
              onChange={(e) => handleInputChange('footHeight', e.target.value)}
              className="border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Height at foot end (short side)
            </p>
          </div>
        )}

        {visibleFields.includes('headHeight') && (
          <div className="space-y-1">
            <Label htmlFor="headHeight" className="text-sm font-medium">
              Head Height (cm) *
            </Label>
            <Input
              id="headHeight"
              type="number"
              step="1"
              min="10"
              max="200"
              placeholder="e.g., 120"
              value={formatValue(tentDimensions.headHeight)}
              onChange={(e) => handleInputChange('headHeight', e.target.value)}
              className="border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Height at head end (long side)
            </p>
          </div>
        )}
      </div>

      {/* Help Text - only show if multiple fields */}
      {visibleFields.length > 1 && (
        <div className="text-xs text-muted-foreground">
          * All fields are required for this calculation mode
        </div>
      )}
    </div>
  );
}