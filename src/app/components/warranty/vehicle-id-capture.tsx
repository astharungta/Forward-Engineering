import { useState } from 'react';
import { Scan, Plus, X, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { validateVIN, validateRegistrationNumber } from '../../../utils/validations';

interface Vehicle {
  vin: string;
  make: string;
  model: string;
  registration: string;
  year: string;
  status: 'validating' | 'valid' | 'invalid';
}

interface VehicleIdCaptureProps {
  onNext: (vehicles: Vehicle[]) => void;
}

export function VehicleIdCapture({
  onNext,
}: VehicleIdCaptureProps) {
  const [currentVin, setCurrentVin] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [inputMethod, setInputMethod] = useState<'manual' | 'scan'>('manual');
  const [vinError, setVinError] = useState<string>('');

  const handleAddVehicle = () => {
    if (!currentVin.trim()) return;

    // Validate VIN format (US-001)
    const vinValidation = validateVIN(currentVin);
    if (!vinValidation.isValid) {
      setVinError(vinValidation.error || 'Invalid VIN');
      return;
    }

    setVinError('');

    const newVehicle: Vehicle = {
      vin: currentVin,
      make: '',
      model: '',
      registration: '',
      year: '',
      status: 'validating'
    };

    setVehicles([...vehicles, newVehicle]);
    setCurrentVin('');

    // Simulate API validation (US-001: VIN Enquiry)
    setTimeout(() => {
      // Generate a year between 2023-2026 for testing (some valid, some invalid)
      const possibleYears = ['2023', '2024', '2025', '2026'];
      const randomYear = possibleYears[Math.floor(Math.random() * possibleYears.length)];
      const currentYear = 2026;
      const vehicleYear = parseInt(randomYear);
      const isWithinThreeYears = (currentYear - vehicleYear) < 3;
      
      setVehicles(prev => 
        prev.map((v, i) => 
          i === prev.length - 1 
            ? {
                ...v,
                make: 'Maruti Suzuki',
                model: 'Swift VXI',
                registration: `DL-${Math.floor(Math.random() * 99)}-AB-${Math.floor(Math.random() * 9999)}`,
                year: randomYear,
                status: isWithinThreeYears ? 'valid' : 'invalid'
              }
            : v
        )
      );
    }, 1500);
  };

  const handleRemoveVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate OCR scanning
    setTimeout(() => {
      setCurrentVin('MA3EUA81S00' + Math.floor(Math.random() * 100000));
      setIsScanning(false);
    }, 2000);
  };

  const canProceed = vehicles.length > 0 && vehicles.every(v => v.status === 'valid');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Identification</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter vehicle details manually or scan registration certificate
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Segmented Tab Control */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-full">
            <button
              onClick={() => setInputMethod('manual')}
              className={`flex-1 py-3 px-4 rounded-md transition-all font-medium ${
                inputMethod === 'manual'
                  ? 'bg-white text-[#3E378F] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enter VIN Manually
            </button>
            <button
              onClick={() => setInputMethod('scan')}
              className={`flex-1 py-3 px-4 rounded-md transition-all font-medium ${
                inputMethod === 'scan'
                  ? 'bg-white text-[#3E378F] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Scan RC Document
            </button>
          </div>

          {/* Manual VIN Entry */}
          {inputMethod === 'manual' && (
            <div className="space-y-4">
              <Label htmlFor="vin">Vehicle Identification Number (VIN) *</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    id="vin"
                    placeholder="Enter 17-character VIN (e.g., MA3EUA81S00123456)"
                    value={currentVin}
                    onChange={(e) => {
                      setCurrentVin(e.target.value.toUpperCase());
                      setVinError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddVehicle()}
                    className={`text-base ${vinError ? 'border-red-500' : ''}`}
                    maxLength={17}
                  />
                  {vinError && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {vinError}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleAddVehicle}
                  disabled={!currentVin.trim()}
                  className="gap-2 bg-[#3E378F] hover:bg-[#3E378F]/90 px-6"
                >
                  <Plus className="h-4 w-4" />
                  {vehicles.length > 0 ? 'Add Another' : 'Add Vehicle'}
                </Button>
              </div>
              {vehicles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Optional: Add more vehicles to check eligibility for multiple cars at once
                </p>
              )}
            </div>
          )}

          {/* RC Scan Option */}
          {inputMethod === 'scan' && (
            <div className="space-y-4">
              <Label>Registration Certificate (RC) Scanner</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[#3E378F]/10 flex items-center justify-center">
                    <Scan className="h-8 w-8 text-[#3E378F]" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Scan Registration Certificate</p>
                    <p className="text-sm text-muted-foreground">
                      Position the RC document in front of the camera
                    </p>
                  </div>
                  <Button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="gap-2 bg-[#3E378F] hover:bg-[#3E378F]/90 px-8"
                    size="lg"
                  >
                    <Scan className="h-5 w-5" />
                    {isScanning ? 'Scanning...' : 'Start Scanning'}
                  </Button>
                </div>
              </div>
              {vehicles.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Optional: Scan more documents to add multiple vehicles
                </p>
              )}
            </div>
          )}

          {/* Vehicle List */}
          {vehicles.length > 0 && (
            <div className="space-y-3">
              <Label>Added Vehicles ({vehicles.length})</Label>
              <div className="space-y-2">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm">{vehicle.vin}</span>
                        {vehicle.status === 'validating' && (
                          <Badge variant="secondary" className="gap-1">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                            Validating...
                          </Badge>
                        )}
                        {vehicle.status === 'valid' && (
                          <Badge className="gap-1 bg-green-500">
                            <Check className="h-3 w-3" />
                            Valid
                          </Badge>
                        )}
                        {vehicle.status === 'invalid' && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Invalid
                          </Badge>
                        )}
                      </div>
                      {vehicle.status === 'valid' && (
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Make/Model:</span> {vehicle.make} {vehicle.model}
                          </div>
                          <div>
                            <span className="font-medium">Registration:</span> {vehicle.registration}
                          </div>
                          <div>
                            <span className="font-medium">Year:</span> {vehicle.year}
                          </div>
                        </div>
                      )}
                      {vehicle.status === 'invalid' && vehicle.year && (
                        <p className="text-sm text-destructive mt-1">
                          Vehicle from {vehicle.year} is not eligible. Only vehicles less than 3 years old (2024 or newer) qualify for extended warranty.
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVehicle(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={() => onNext(vehicles)}
          disabled={!canProceed}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Check Eligibility
        </Button>
      </div>
    </div>
  );
}