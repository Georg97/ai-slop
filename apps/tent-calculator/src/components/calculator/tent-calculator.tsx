// Main tent calculator component

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { AlertCircle, Calculator, Settings, History } from 'lucide-react';

import { useCalculatorState, useCalculatorResults, useCalculatorActions } from '~/stores/calculator-store';
import { CalculationModeSelector } from './calculation-mode-selector';
import { DimensionInputs } from './dimension-inputs';
import { PaddingControls } from './padding-controls';
import { ResultsDisplay } from './results-display';
import { CalculationHistory } from './calculation-history';

export function TentCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  
  const { calculationMode } = useCalculatorState();
  const { result, isCalculating, error, canCalculate, requiredInputs } = useCalculatorResults();
  const { calculateDimensions, clearResults, resetToDefaults } = useCalculatorActions();

  const handleCalculate = () => {
    calculateDimensions();
  };

  const handleReset = () => {
    resetToDefaults();
    setActiveTab('calculator');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tent Size Calculator</h1>
        <p className="text-muted-foreground">
          Calculate dimensions for a triangular prism mosquito net tent that fits under your tarp
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2" disabled={!result}>
            <Settings className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calculation Mode</CardTitle>
                  <CardDescription>
                    Choose what you want to calculate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CalculationModeSelector />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tent Dimensions</CardTitle>
                  <CardDescription>
                    Enter known dimensions based on your calculation mode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DimensionInputs />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Padding & Clearance</CardTitle>
                  <CardDescription>
                    Set clearance distances between inner tent and outer tarp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaddingControls />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Controls and Preview */}
            <div className="space-y-6">
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
              <div className="flex gap-3">
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
                >
                  Reset
                </Button>
              </div>

              {/* Calculation Mode Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Mode: {calculationMode.replace('_', ' ').toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {calculationMode === 'solve_height' && (
                      <p>Provide floor width and padding. The calculator will determine the maximum tent heights.</p>
                    )}
                    {calculationMode === 'solve_width' && (
                      <p>Provide tent heights and padding. The calculator will determine the maximum floor width.</p>
                    )}
                    {calculationMode === 'solve_padding' && (
                      <p>Provide all tent dimensions. The calculator will determine minimum required padding.</p>
                    )}
                    {calculationMode === 'validate' && (
                      <p>Provide all dimensions to check if they fit within the tarp constraints.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          {result ? (
            <ResultsDisplay result={result} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No calculation results yet. Go to the Calculator tab to get started.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <CalculationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}