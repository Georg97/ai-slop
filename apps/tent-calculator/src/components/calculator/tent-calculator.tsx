// Main tent calculator component - streamlined vertical layout

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { AlertCircle, Calculator, RotateCcw } from 'lucide-react';

import { useCalculatorState, useCalculatorResults, useCalculatorActions } from '~/stores/calculator-store';
import { CalculationModeSelector } from './calculation-mode-selector';
import { DimensionInputs } from './dimension-inputs';
import { PaddingControls } from './padding-controls';
import { ResultsDisplay } from './results-display';
import { CalculationHistory } from './calculation-history';

export function TentCalculator() {
  const { calculationMode } = useCalculatorState();
  const { result, isCalculating, error, canCalculate, requiredInputs } = useCalculatorResults();
  const { calculateDimensions, resetToDefaults } = useCalculatorActions();

  const handleCalculate = () => {
    calculateDimensions();
  };

  const handleReset = () => {
    resetToDefaults();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tent Size Calculator</h1>
        <p className="text-muted-foreground">
          Calculate dimensions for a triangular prism mosquito net tent that fits under your tarp
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Calculation Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculation Setup
            </CardTitle>
            <CardDescription>
              Configure your calculation mode and input the required dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Selection */}
            <div>
              <h3 className="font-medium mb-3">Calculation Mode</h3>
              <CalculationModeSelector />
            </div>

            {/* Dynamic Input Layout */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-3">Tent Dimensions</h3>
                <DimensionInputs />
              </div>
              <div>
                <h3 className="font-medium mb-3">Padding & Clearance</h3>
                <PaddingControls />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Required Inputs Warning */}
            {requiredInputs.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please provide: {requiredInputs.join(', ')}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCalculate}
                disabled={!canCalculate || isCalculating}
                className="flex-1"
                size="lg"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Dimensions'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                size="lg"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>
                Your calculated tent dimensions and constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsDisplay result={result} />
            </CardContent>
          </Card>
        )}

        {/* Section 3: History */}
        <Card>
          <CardHeader>
            <CardTitle>Calculation History</CardTitle>
            <CardDescription>
              Previous calculations and saved configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalculationHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}