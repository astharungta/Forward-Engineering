import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface Vehicle {
  vin: string;
  make: string;
  model: string;
  registration: string;
  year: string;
  status: string;
}

interface EligibilityResult {
  vehicleId: string;
  isEligible: boolean;
  checks: {
    age: { passed: boolean; value: string; limit: string };
    mileage: { passed: boolean; value: string; limit: string };
    serviceHistory: { passed: boolean; value: string };
  };
  reasons?: string[];
}

interface EligibilityCheckProps {
  vehicles: Vehicle[];
  onNext: () => void;
  onBack: () => void;
}

export function EligibilityCheck({ vehicles, onNext, onBack }: EligibilityCheckProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<EligibilityResult[]>([]);

  useEffect(() => {
    // Simulate eligibility check
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      const mockResults: EligibilityResult[] = vehicles.map((vehicle, index) => {
        const isEligible = index !== 1; // Make second vehicle ineligible for demo
        return {
          vehicleId: vehicle.vin,
          isEligible,
          checks: {
            age: {
              passed: isEligible,
              value: isEligible ? '2.5 years' : '3.5 years',
              limit: '< 3 years'
            },
            mileage: {
              passed: true,
              value: '45,000 km',
              limit: '< 1,00,000 km'
            },
            serviceHistory: {
              passed: true,
              value: 'Up to date'
            }
          },
          reasons: isEligible ? undefined : ['Vehicle age exceeds 3 years']
        };
      });
      
      setResults(mockResults);
      setLoading(false);
    }, 2500);

    return () => clearInterval(interval);
  }, [vehicles]);

  const eligibleCount = results.filter(r => r.isEligible).length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-[#3E378F] animate-spin" />
              <h3>Checking Eligibility...</h3>
              <p className="text-sm text-muted-foreground text-center">
                Validating vehicle age, mileage, and service history
              </p>
              <div className="w-full max-w-md">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card className="border-l-4 border-l-[#3E378F]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg">Eligibility Check Complete</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {eligibleCount} of {vehicles.length} vehicle(s) eligible for extended warranty
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-[#3E378F]">{eligibleCount}</div>
              <div className="text-sm text-muted-foreground">Eligible</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results for Each Vehicle */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const vehicle = vehicles[index];
          return (
            <Card key={result.vehicleId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{vehicle.make} {vehicle.model}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {vehicle.registration} • VIN: {vehicle.vin}
                    </p>
                  </div>
                  <Badge
                    className={result.isEligible 
                      ? 'bg-green-500 gap-1' 
                      : 'bg-red-500 gap-1'
                    }
                  >
                    {result.isEligible ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Eligible
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Not Eligible
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Eligibility Checks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.checks.age.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm">Vehicle Age</p>
                        <p className="text-xs text-muted-foreground">
                          {result.checks.age.value} (Required: {result.checks.age.limit})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.checks.mileage.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm">Mileage</p>
                        <p className="text-xs text-muted-foreground">
                          {result.checks.mileage.value} (Required: {result.checks.mileage.limit})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.checks.serviceHistory.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm">Service History</p>
                        <p className="text-xs text-muted-foreground">
                          {result.checks.serviceHistory.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ineligibility Reasons */}
                {!result.isEligible && result.reasons && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Ineligibility Reasons:</p>
                      <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                        {result.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={eligibleCount === 0}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Continue with Eligible Vehicles ({eligibleCount})
        </Button>
      </div>
    </div>
  );
}
