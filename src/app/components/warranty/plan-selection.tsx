import { useState } from 'react';
import { Check, Shield, Star, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '../ui/utils';

interface Plan {
  id: string;
  name: string;
  icon: any;
  price: number;
  coverage: string[];
  recommended?: boolean;
  maxTenure: number;
}

const plans: Plan[] = [
  {
    id: 'platinum',
    name: 'Platinum',
    icon: Shield,
    price: 18999,
    maxTenure: 4,
    coverage: [
      'Engine & Transmission',
      'Electrical System',
      'Fuel System',
      'Cooling System',
      'Basic Components'
    ]
  },
  {
    id: 'royal-platinum',
    name: 'Royal Platinum',
    icon: Star,
    price: 24999,
    recommended: true,
    maxTenure: 5,
    coverage: [
      'All Platinum Coverage',
      'AC & Climate Control',
      'Suspension & Steering',
      'Brake System',
      'Additional Components'
    ]
  },
  {
    id: 'solitaire',
    name: 'Solitaire',
    icon: Crown,
    price: 32999,
    maxTenure: 6,
    coverage: [
      'All Royal Platinum Coverage',
      'Infotainment System',
      'Power Windows & Locks',
      'Airbags & Safety Systems',
      'Premium Coverage'
    ]
  }
];

interface PlanSelectionProps {
  onNext: (selectedPlan: string, tenure: number) => void;
  onBack: () => void;
}

export function PlanSelection({ onNext, onBack }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('royal-platinum');
  const [selectedTenure, setSelectedTenure] = useState<number>(3);

  const currentPlan = plans.find(p => p.id === selectedPlan);

  const handleContinue = () => {
    if (selectedPlan && selectedTenure) {
      onNext(selectedPlan, selectedTenure);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2>Select Extended Warranty Plan</h2>
        <p className="text-muted-foreground">
          Choose the plan that best suits your needs
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-[#3E378F] shadow-lg"
              )}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#3E378F]">Recommended</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center",
                    isSelected ? "bg-[#3E378F]" : "bg-gray-100"
                  )}>
                    <Icon className={cn(
                      "h-8 w-8",
                      isSelected ? "text-white" : "text-gray-600"
                    )} />
                  </div>
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground text-sm">/year</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to {plan.maxTenure} years coverage
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.coverage.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  className={cn(
                    "w-full",
                    isSelected 
                      ? "bg-[#3E378F] hover:bg-[#3E378F]/90" 
                      : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tenure Selection */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Coverage Tenure</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose the duration for your extended warranty coverage
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="tenure" className="whitespace-nowrap">Coverage Duration:</Label>
              <Select
                value={selectedTenure.toString()}
                onValueChange={(value) => setSelectedTenure(parseInt(value))}
              >
                <SelectTrigger id="tenure" className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: currentPlan.maxTenure }, (_, i) => i + 1).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year} {year === 1 ? 'Year' : 'Years'} - ₹{(currentPlan.price * year).toLocaleString('en-IN')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 p-4 bg-[#3E378F]/5 border border-[#3E378F]/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Plan</p>
                  <p className="text-lg">{currentPlan.name} - {selectedTenure} {selectedTenure === 1 ? 'Year' : 'Years'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Premium</p>
                  <p className="text-2xl text-[#3E378F]">
                    ₹{(currentPlan.price * selectedTenure).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Continue to Add-ons
        </Button>
      </div>
    </div>
  );
}