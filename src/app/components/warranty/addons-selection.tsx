import { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  recommended?: boolean;
  requires?: string[];
}

const addons: Addon[] = [
  {
    id: 'ccp-fuel',
    name: 'CCP Fuel',
    description: 'Coverage for repairs due to fuel quality',
    price: 3999,
    icon: Shield
  },
  {
    id: 'ccp-hydro',
    name: 'CCP Hydro',
    description: 'Coverage for repairs due to water entering the engine',
    price: 5999,
    icon: Shield,
    recommended: true
  },
  {
    id: 'ccp-plus',
    name: 'CCP Plus',
    description: 'Coverage for repairs due to water entering the engine or/and inconsistent fuel quality',
    price: 8999,
    icon: Shield
  }
];

interface AddonsSelectionProps {
  onNext: (selectedAddons: string[]) => void;
  onBack: () => void;
  basePremium: number;
}

export function AddonsSelection({ onNext, onBack, basePremium }: AddonsSelectionProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['ccp-hydro']);
  const [showDependencyWarning, setShowDependencyWarning] = useState<string | null>(null);

  const handleAddonToggle = (addonId: string) => {
    const addon = addons.find(a => a.id === addonId);
    
    if (selectedAddons.includes(addonId)) {
      // Check if any other addon depends on this
      const dependentAddons = addons.filter(a => 
        a.requires?.includes(addonId) && selectedAddons.includes(a.id)
      );
      
      if (dependentAddons.length > 0) {
        setShowDependencyWarning(addonId);
        return;
      }
      
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      // Check if required addons are selected
      if (addon?.requires) {
        const missingRequirements = addon.requires.filter(req => !selectedAddons.includes(req));
        if (missingRequirements.length > 0) {
          // Auto-select required addons
          setSelectedAddons([...selectedAddons, ...missingRequirements, addonId]);
          return;
        }
      }
      
      setSelectedAddons([...selectedAddons, addonId]);
    }
    
    setShowDependencyWarning(null);
  };

  const calculateTotal = () => {
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return basePremium + addonsTotal;
  };

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2>Enhance Your Coverage</h2>
        <p className="text-muted-foreground">
          Select optional add-ons to customize your warranty package
        </p>
      </div>

      {/* Add-ons Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {addons.map((addon) => {
          const Icon = addon.icon;
          const isSelected = selectedAddons.includes(addon.id);
          const isDisabled = addon.requires?.some(req => !selectedAddons.includes(req)) && !isSelected;
          
          return (
            <Card
              key={addon.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected && "ring-2 ring-[#3E378F]",
                isDisabled && "opacity-60"
              )}
              onClick={() => !isDisabled && handleAddonToggle(addon.id)}
            >
              {addon.recommended && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-orange-500">Recommended</Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-[#3E378F]" : "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        isSelected ? "text-white" : "text-gray-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{addon.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => !isDisabled && handleAddonToggle(addon.id)}
                    disabled={isDisabled}
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xl text-[#3E378F]">
                    ₹{addon.price.toLocaleString('en-IN')}
                  </div>
                  {addon.requires && (
                    <div className="text-xs text-muted-foreground">
                      Requires: {addons.find(a => a.id === addon.requires?.[0])?.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dependency Warning */}
      {showDependencyWarning && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-orange-900">Cannot remove this add-on</p>
            <p className="text-sm text-orange-700 mt-1">
              This add-on is required by other selected add-ons. Please deselect dependent add-ons first.
            </p>
          </div>
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg">Premium Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Premium</span>
                <span>₹{basePremium.toLocaleString('en-IN')}</span>
              </div>
              
              {selectedAddons.length > 0 && (
                <>
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-2">Selected Add-ons:</p>
                    {selectedAddons.map(addonId => {
                      const addon = addons.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="flex justify-between text-sm ml-4 mb-1">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span>₹{addon.price.toLocaleString('en-IN')}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Add-ons Subtotal</span>
                    <span>₹{addonsTotal.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center border-t-2 pt-3">
                <span className="text-lg">Total Premium</span>
                <span className="text-2xl text-[#3E378F]">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              * GST (18%) will be added at checkout
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onNext(selectedAddons)}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Continue to KYC Verification
        </Button>
      </div>
    </div>
  );
}