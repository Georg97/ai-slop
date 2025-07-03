// Dimension inputs component

import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { useCalculatorState, useCalculatorActions } from '~/stores/calculator-store';

export function DimensionInputs() {
  const { tentDimensions, calculationMode } = useCalculatorState();
  const { setTentDimensions } = useCalculatorActions();

  const handleInputChange = (field: keyof typeof tentDimensions, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (value === '' || (!isNaN(numValue!) && numValue! > 0)) {
      setTentDimensions({ [field]: numValue });
    }
  };

  const formatValue = (value: number | undefined) => {
    return value?.toString() ?? '';
  };

  // Determine which inputs are required based on calculation mode
  const isRequired = (field: keyof typeof tentDimensions) => {
    switch (calculationMode) {
      case 'solve_height':
        return field === 'floorWidth';
      case 'solve_width':
        return field === 'footHeight' || field === 'headHeight';
      case 'solve_padding':
      case 'validate':
        return field === 'floorWidth' || field === 'footHeight' || field === 'headHeight';
      default:
        return false;
    }
  };

  const isDisabled = (field: keyof typeof tentDimensions) => {
    switch (calculationMode) {
      case 'solve_height':
        return field === 'footHeight' || field === 'headHeight';
      case 'solve_width':
        return field === 'floorWidth';
      case 'solve_padding':
        return false; // All inputs enabled for this mode
      case 'validate':
        return false; // All inputs enabled for this mode
      default:
        return false;
    }
  };

  return (
    <div className=\"space-y-4\">
      {/* Fixed Dimensions Info */}
      <div className=\"p-3 bg-muted rounded-lg text-sm\">
        <h4 className=\"font-medium mb-2\">Fixed Constraints:</h4>
        <div className=\"space-y-1 text-muted-foreground\">
          <p>Tent Length: {tentDimensions.length}m (fixed)</p>
          <p>Foot Base Width: {tentDimensions.footBaseWidth}m (fixed)</p>
          <p>Head Base Width: {tentDimensions.headBaseWidth}m (fixed)</p>
        </div>
      </div>

      {/* Variable Dimensions */}
      <div className=\"space-y-4\">
        <div className=\"space-y-2\">
          <Label 
            htmlFor=\"floorWidth\" 
            className={isRequired('floorWidth') ? 'text-primary font-medium' : ''}
          >
            Floor Width (m) {isRequired('floorWidth') && '*'}
          </Label>
          <Input
            id=\"floorWidth\"
            type=\"number\"
            step=\"0.01\"
            min=\"0.1\"
            max=\"2.0\"
            placeholder=\"e.g., 1.0\"
            value={formatValue(tentDimensions.floorWidth)}
            onChange={(e) => handleInputChange('floorWidth', e.target.value)}
            disabled={isDisabled('floorWidth')}
            className={isRequired('floorWidth') ? 'border-primary' : ''}
          />
          <p className=\"text-xs text-muted-foreground\">
            The width of the tent floor at ground level
          </p>
        </div>

        <div className=\"space-y-2\">
          <Label 
            htmlFor=\"footHeight\" 
            className={isRequired('footHeight') ? 'text-primary font-medium' : ''}
          >
            Foot Height (m) {isRequired('footHeight') && '*'}
          </Label>
          <Input
            id=\"footHeight\"
            type=\"number\"
            step=\"0.01\"
            min=\"0.1\"
            max=\"2.0\"
            placeholder=\"e.g., 0.7\"
            value={formatValue(tentDimensions.footHeight)}
            onChange={(e) => handleInputChange('footHeight', e.target.value)}
            disabled={isDisabled('footHeight')}
            className={isRequired('footHeight') ? 'border-primary' : ''}
          />
          <p className=\"text-xs text-muted-foreground\">
            Height at the foot end of the tent (short side)
          </p>
        </div>

        <div className=\"space-y-2\">
          <Label 
            htmlFor=\"headHeight\" 
            className={isRequired('headHeight') ? 'text-primary font-medium' : ''}
          >
            Head Height (m) {isRequired('headHeight') && '*'}
          </Label>
          <Input
            id=\"headHeight\"
            type=\"number\"
            step=\"0.01\"
            min=\"0.1\"
            max=\"2.0\"
            placeholder=\"e.g., 1.2\"
            value={formatValue(tentDimensions.headHeight)}
            onChange={(e) => handleInputChange('headHeight', e.target.value)}
            disabled={isDisabled('headHeight')}
            className={isRequired('headHeight') ? 'border-primary' : ''}
          />
          <p className=\"text-xs text-muted-foreground\">
            Height at the head end of the tent (long side)
          </p>
        </div>
      </div>

      {/* Help Text */}
      <div className=\"text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg\">
        <p className=\"font-medium mb-1\">Tips:</p>
        <ul className=\"space-y-1 list-disc list-inside\">
          <li>Required fields are marked with * and highlighted</li>
          <li>Disabled fields will be calculated automatically</li>
          <li>All dimensions are in meters</li>
          <li>Floor width is measured at ground level</li>
        </ul>
      </div>
    </div>
  );
}