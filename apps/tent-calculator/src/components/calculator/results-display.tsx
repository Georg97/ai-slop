// Results display component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Badge } from '~/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { CalculationResult } from '~/types/tent';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const formatDimension = (value: number) => {
    return `${value.toFixed(2)}m`;
  };

  const formatCentimeters = (value: number) => {
    return `${(value * 100).toFixed(1)}cm`;
  };

  const getValidationIcon = () => {
    if (result.isValid) {
      return <CheckCircle className=\"h-5 w-5 text-green-500\" />;
    } else {
      return <XCircle className=\"h-5 w-5 text-red-500\" />;
    }
  };

  const getValidationColor = () => {
    return result.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className=\"space-y-6\">
      {/* Validation Status */}
      <Card className={getValidationColor()}>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            {getValidationIcon()}
            Calculation Results
            <Badge variant={result.isValid ? 'default' : 'destructive'}>
              {result.isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {result.isValid 
              ? 'These dimensions fit within your tarp constraints.' 
              : 'These dimensions do not fit within your tarp constraints.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className=\"space-y-2\">
          {result.warnings.map((warning, index) => (
            <Alert key={index} variant={result.isValid ? 'default' : 'destructive'}>
              <AlertTriangle className=\"h-4 w-4\" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className=\"grid gap-6 md:grid-cols-2\">
        {/* Calculated Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle>Tent Dimensions</CardTitle>
            <CardDescription>Calculated tent measurements</CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Foot Height</p>
                <p className=\"text-2xl font-bold text-primary\">{formatDimension(result.footHeight)}</p>
                <p className=\"text-xs text-muted-foreground\">{formatCentimeters(result.footHeight)}</p>
              </div>
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Head Height</p>
                <p className=\"text-2xl font-bold text-primary\">{formatDimension(result.headHeight)}</p>
                <p className=\"text-xs text-muted-foreground\">{formatCentimeters(result.headHeight)}</p>
              </div>
            </div>
            
            <div className=\"pt-4 border-t\">
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Floor Width</p>
                <p className=\"text-2xl font-bold text-primary\">{formatDimension(result.floorWidth)}</p>
                <p className=\"text-xs text-muted-foreground\">{formatCentimeters(result.floorWidth)}</p>
              </div>
            </div>

            <div className=\"pt-4 border-t text-xs text-muted-foreground space-y-1\">
              <p>Length: 2.00m (fixed)</p>
              <p>Foot base: 0.75m (fixed)</p>
              <p>Head base: 1.075m (fixed)</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Space */}
        <Card>
          <CardHeader>
            <CardTitle>Available Space</CardTitle>
            <CardDescription>Tarp space after padding</CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Foot Space</p>
                <p className=\"text-lg font-semibold\">{formatDimension(result.availableSpace.footHeight)}</p>
                <p className=\"text-xs text-muted-foreground\">Height</p>
              </div>
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Head Space</p>
                <p className=\"text-lg font-semibold\">{formatDimension(result.availableSpace.headHeight)}</p>
                <p className=\"text-xs text-muted-foreground\">Height</p>
              </div>
            </div>

            <div className=\"grid grid-cols-2 gap-4\">
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Foot Width</p>
                <p className=\"text-lg font-semibold\">{formatDimension(result.availableSpace.footWidth)}</p>
                <p className=\"text-xs text-muted-foreground\">After padding</p>
              </div>
              <div className=\"space-y-1\">
                <p className=\"text-sm font-medium\">Head Width</p>
                <p className=\"text-lg font-semibold\">{formatDimension(result.availableSpace.headWidth)}</p>
                <p className=\"text-xs text-muted-foreground\">After padding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Space Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Space Utilization</CardTitle>
          <CardDescription>How efficiently your tent uses the available tarp space</CardDescription>
        </CardHeader>
        <CardContent>
          <div className=\"space-y-4\">
            <div className=\"space-y-2\">
              <div className=\"flex justify-between text-sm\">
                <span>Height utilization (foot)</span>
                <span>{((result.footHeight / result.availableSpace.footHeight) * 100).toFixed(1)}%</span>
              </div>
              <div className=\"w-full bg-muted rounded-full h-2\">
                <div 
                  className=\"bg-primary h-2 rounded-full transition-all duration-300\" 
                  style={{ width: `${(result.footHeight / result.availableSpace.footHeight) * 100}%` }}
                />
              </div>
            </div>

            <div className=\"space-y-2\">
              <div className=\"flex justify-between text-sm\">
                <span>Height utilization (head)</span>
                <span>{((result.headHeight / result.availableSpace.headHeight) * 100).toFixed(1)}%</span>
              </div>
              <div className=\"w-full bg-muted rounded-full h-2\">
                <div 
                  className=\"bg-primary h-2 rounded-full transition-all duration-300\" 
                  style={{ width: `${(result.headHeight / result.availableSpace.headHeight) * 100}%` }}
                />
              </div>
            </div>

            <div className=\"space-y-2\">
              <div className=\"flex justify-between text-sm\">
                <span>Width utilization</span>
                <span>{((result.floorWidth / Math.min(result.availableSpace.footWidth, result.availableSpace.headWidth)) * 100).toFixed(1)}%</span>
              </div>
              <div className=\"w-full bg-muted rounded-full h-2\">
                <div 
                  className=\"bg-primary h-2 rounded-full transition-all duration-300\" 
                  style={{ width: `${(result.floorWidth / Math.min(result.availableSpace.footWidth, result.availableSpace.headWidth)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}