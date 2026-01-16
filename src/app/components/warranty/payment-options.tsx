import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Gift, Building2, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';

interface PaymentOptionsProps {
  amount: number;
  onNext: (paymentMethod: string) => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay securely with your credit or debit card',
    popular: true
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
    popular: true
  },
  {
    id: 'car-wallet-emi',
    name: 'Car Wallet EMI',
    icon: Wallet,
    description: 'Convert to easy EMIs using Car Wallet',
    emiOptions: [3, 6, 9, 12]
  },
  {
    id: 'other-emi',
    name: 'Other EMI Options',
    icon: Building2,
    description: 'Bajaj Finserv, HDFC Bank EMI, etc.',
    emiOptions: [3, 6, 9, 12, 18, 24]
  },
  {
    id: 'loyalty',
    name: 'Loyalty Points',
    icon: Gift,
    description: 'Redeem your loyalty points (Available: 25,000 pts)',
    maxRedemption: 5000
  },
  {
    id: 'cash',
    name: 'Cash',
    icon: Wallet,
    description: 'Pay in cash at the dealership'
  }
];

export function PaymentOptions({ amount, onNext, onBack }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [selectedEMI, setSelectedEMI] = useState<number>(6);

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const emiAmount = currentMethod?.emiOptions 
    ? (amount / selectedEMI).toFixed(2)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2>Payment Options</h2>
        <p className="text-muted-foreground">
          Choose your preferred payment method
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <div
                      key={method.id}
                      className={cn(
                        "relative flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm",
                        isSelected && "border-[#3E378F] bg-[#3E378F]/5"
                      )}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-[#3E378F]" : "bg-gray-100"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            isSelected ? "text-white" : "text-gray-600"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={method.id} className="cursor-pointer">
                              {method.name}
                            </Label>
                            {method.popular && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="Name on card" />
                  </div>
                </div>
              )}

              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input id="upiId" placeholder="yourname@upi" />
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg text-center">
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <QrCode className="h-32 w-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Scan QR code with any UPI app
                    </p>
                  </div>
                </div>
              )}

              {(selectedMethod === 'car-wallet-emi' || selectedMethod === 'other-emi') && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select EMI Tenure</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {currentMethod?.emiOptions?.map((months) => (
                        <button
                          key={months}
                          onClick={() => setSelectedEMI(months)}
                          className={cn(
                            "p-3 border rounded-lg text-center transition-all",
                            selectedEMI === months 
                              ? "border-[#3E378F] bg-[#3E378F]/5" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <p className="text-sm">{months} Months</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{((amount / months).toFixed(2))}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💰 Monthly EMI: <span className="font-medium">₹{emiAmount}</span> for {selectedEMI} months
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'loyalty' && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                      Available Loyalty Points: <span className="font-medium">25,000 points</span>
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      1 point = ₹1 | Max redemption: ₹5,000
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pointsToRedeem">Points to Redeem</Label>
                    <Input 
                      id="pointsToRedeem" 
                      type="number" 
                      placeholder="Enter points (max 5,000)" 
                      max={5000}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remaining amount will be charged via another payment method
                  </p>
                </div>
              )}

              {selectedMethod === 'cash' && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm">
                    Please make the payment at the dealership counter
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Amount to be paid: <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Amount Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl text-[#3E378F]">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
              
              {emiAmount && (
                <>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">EMI Details</p>
                    <p className="text-lg">₹{emiAmount}</p>
                    <p className="text-xs text-muted-foreground">per month for {selectedEMI} months</p>
                  </div>
                </>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                <p className="text-sm font-medium">{currentMethod?.name}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onNext(selectedMethod)}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
