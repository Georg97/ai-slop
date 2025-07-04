// Results display component - simplified and compact (using cm)

import { Alert, AlertDescription } from '~/components/ui/alert';
import { Badge } from '~/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { CalculationResult } from '~/types/tent';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const formatDimension = (meterValue: number) => {
    return `${Math.round(meterValue * 100)}cm`;
  };

  const formatMetersFallback = (meterValue: number) => {
    return `${meterValue.toFixed(2)}m`;
  };

  const getValidationIcon = () => {
    if (result.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
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
              {result.isValid 
                ? 'Tent fits within tarp constraints' 
                : 'Tent exceeds available space'}
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

      {/* Detailed Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Tent Dimensions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Calculated Dimensions</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Floor Width:</span>
              <span className="font-medium">{formatDimension(result.floorWidth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Foot Height:</span>
              <span className="font-medium">{formatDimension(result.footHeight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Head Height:</span>
              <span className="font-medium">{formatDimension(result.headHeight)}</span>
            </div>
          </div>
        </div>

        {/* Space Utilization */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Space Usage</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Height (Foot):</span>
              <span className="font-medium">{((result.footHeight / result.availableSpace.footHeight) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Height (Head):</span>
              <span className="font-medium">{((result.headHeight / result.availableSpace.headHeight) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Width:</span>
              <span className="font-medium">{((result.floorWidth / Math.min(result.availableSpace.footWidth, result.availableSpace.headWidth)) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Space Details */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Available Space After Padding</h4>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Height (Foot):</span>
              <span>{formatDimension(result.availableSpace.footHeight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Height (Head):</span>
              <span>{formatDimension(result.availableSpace.headHeight)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Width (Foot):</span>
              <span>{formatDimension(result.availableSpace.footWidth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Width (Head):</span>
              <span>{formatDimension(result.availableSpace.headWidth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Constraints Reminder */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
        <span className="font-medium">Fixed:</span> Length: 200cm, Foot Base: 75cm, Head Base: 108cm
      </div>
    </div>
  );
}