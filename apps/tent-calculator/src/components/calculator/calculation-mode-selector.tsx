// Calculation mode selector component

import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { useCalculatorState, useCalculatorActions } from '~/stores/calculator-store';
import type { CalculationMode } from '~/types/tent';

const calculationModes: Array<{
  value: CalculationMode;
  label: string;
  description: string;
}> = [
  {
    value: 'solve_height',
    label: 'Calculate Heights',
    description: 'Find tent heights for a given floor width'
  },
  {
    value: 'solve_width',
    label: 'Calculate Width',
    description: 'Find maximum floor width for given heights'
  },
  {
    value: 'solve_padding',
    label: 'Calculate Padding',
    description: 'Find minimum padding for given dimensions'
  },
  {
    value: 'validate',
    label: 'Validate Dimensions',
    description: 'Check if dimensions fit within constraints'
  }
];

export function CalculationModeSelector() {
  const { calculationMode } = useCalculatorState();
  const { setCalculationMode } = useCalculatorActions();

  return (
    <div className=\"space-y-4\">
      <RadioGroup
        value={calculationMode}
        onValueChange={(value) => setCalculationMode(value as CalculationMode)}
        className=\"space-y-3\"
      >
        {calculationModes.map((mode) => (
          <div key={mode.value} className=\"flex items-start space-x-3 space-y-0\">
            <RadioGroupItem value={mode.value} id={mode.value} className=\"mt-1\" />
            <div className=\"grid gap-1.5 leading-none\">
              <Label
                htmlFor={mode.value}
                className=\"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70\"
              >
                {mode.label}
              </Label>
              <p className=\"text-xs text-muted-foreground\">
                {mode.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}