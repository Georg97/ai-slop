// Results display component - simplified and compact (using cm) - CLARIFIED

import { Alert, AlertDescription } from '~/components/ui/alert';
import { Badge } from '~/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { CalculationResult } from '~/types/tent';
import { useCalculatorState } from '~/stores/calculator-store';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { calculationMode } = useCalculatorState();
  
  const formatDimension = (meterValue: number) => {
    return `${Math.round(meterValue * 100)}cm`;
  };

  const getValidationIcon = () => {
    if (result.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getResultsExplanation = () => {
    switch (calculationMode) {
      case 'solve_height':
        return `For your target floor width of ${formatDimension(result.floorWidth)}, these are the required tent heights:`;
      case 'solve_width':
        return `With your specified tent heights, this is the maximum achievable floor width:`;
      case 'solve_padding':
        return `For your specified tent dimensions, these are the minimum required paddings:`;
      case 'validate':
        return `Validation results for your tent configuration:`;
      default:
        return `Calculation results:`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Status and Key Results */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-3">
          {getValidationIcon()}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {result.isValid ? 'Valid Configuration' : 'Invalid Configuration'}
              </span>
              <Badge variant={result.isValid ? 'default' : 'destructive'} className="text-xs">
                {result.isValid ? 'Fits' : 'Too Big'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {getResultsExplanation()}
            </p>
          </div>
        </div>
        
        {/* Key Dimensions */}
        <div className="text-right">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Floor</p>
              <p className="font-semibold">{formatDimension(result.floorWidth)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Foot</p>
              <p className="font-semibold">{formatDimension(result.footHeight)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Head</p>
              <p className="font-semibold">{formatDimension(result.headHeight)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((warning, index) => (
            <Alert key={index} variant={result.isValid ? 'default' : 'destructive'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Calculation Explanation */}
      {calculationMode === 'solve_height' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <h4 className="font-medium text-blue-900 mb-2">How this was calculated:</h4>
          <div className="text-blue-800 space-y-1">
            <p>• Target inner floor width: {formatDimension(result.floorWidth)}</p>
            <p>• Required outer width: {formatDimension(result.floorWidth)} + 6cm padding = {formatDimension(result.floorWidth + 0.06)}cm</p>
            <p>• Tent heights needed to achieve this outer width at the tent peak</p>
          </div>
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Tent Dimensions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">
            {calculationMode === 'solve_height' ? 'Required Tent Heights' : 'Tent Dimensions'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {calculationMode === 'solve_height' ? 'Target Floor Width:' : 'Floor Width:'}
              </span>
              <span className="font-medium">{formatDimension(result.floorWidth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {calculationMode === 'solve_height' ? 'Required Foot Height:' : 'Foot Height:'}
              </span>
              <span className="font-medium">{formatDimension(result.footHeight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {calculationMode === 'solve_height' ? 'Required Head Height:' : 'Head Height:'}
              </span>
              <span className="font-medium">{formatDimension(result.headHeight)}</span>
            </div>
          </div>
        </div>

        {/* Space Analysis */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Space Analysis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Height Efficiency (Foot):</span>
              <span className="font-medium">{((result.footHeight / result.availableSpace.footHeight) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Height Efficiency (Head):</span>
              <span className="font-medium">{((result.headHeight / result.availableSpace.headHeight) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Width Efficiency:</span>
              <span className="font-medium">{((result.floorWidth / Math.min(result.availableSpace.footWidth, result.availableSpace.headWidth)) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maximum Theoretical Space (Collapsed by default) */}
      <details className="space-y-2">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
          📐 Show maximum theoretical space under tarp
        </summary>
        <div className="grid gap-4 md:grid-cols-2 text-sm pl-4 border-l-2 border-muted">
          <div className="space-y-2">
            <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Max Heights (after padding)</h5>
            <div className="flex justify-between">
              <span className="text-muted-foreground">At Foot Position:</span>
              <span>{formatDimension(result.availableSpace.footHeight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">At Head Position:</span>
              <span>{formatDimension(result.availableSpace.headHeight)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Max Widths (after padding)</h5>
            <div className="flex justify-between">
              <span className="text-muted-foreground">At Foot Position:</span>
              <span>{formatDimension(result.availableSpace.footWidth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">At Head Position:</span>
              <span>{formatDimension(result.availableSpace.headWidth)}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pl-4">
          These are the maximum theoretical dimensions available under the tarp at ground level, 
          not related to your tent's actual dimensions.
        </p>
      </details>

      {/* Fixed Constraints Reminder */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
        <span className="font-medium">Fixed tent base:</span> Length: 200cm, Foot Base: 75cm, Head Base: 108cm
      </div>
    </div>
  );
}