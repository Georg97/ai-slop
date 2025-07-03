// Calculation history component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { History, Calculator } from 'lucide-react';

export function CalculationHistory() {
  // TODO: Implement with tRPC when we add the API
  const calculations = []; // Placeholder

  if (calculations.length === 0) {
    return (
      <Card>
        <CardContent className=\"pt-6\">
          <div className=\"text-center text-muted-foreground\">
            <History className=\"h-12 w-12 mx-auto mb-4 opacity-50\" />
            <h3 className=\"text-lg font-medium mb-2\">No saved calculations</h3>
            <p className=\"mb-4\">Your calculation history will appear here after you save some results.</p>
            <Button variant=\"outline\" size=\"sm\">
              <Calculator className=\"h-4 w-4 mr-2\" />
              Create your first calculation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className=\"space-y-4\">
      <Card>
        <CardHeader>
          <CardTitle>Calculation History</CardTitle>
          <CardDescription>
            Your previously saved tent calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement calculation list */}
          <p className=\"text-muted-foreground\">History functionality will be implemented with the database integration.</p>
        </CardContent>
      </Card>
    </div>
  );
}