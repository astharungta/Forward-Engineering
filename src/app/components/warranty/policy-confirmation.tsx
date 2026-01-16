import { Download, Mail, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface PolicyConfirmationProps {
  planName: string;
  tenure: number;
  basePremium: number;
  addons: string[];
  addonPrices: Record<string, number>;
  onNext: () => void;
  onBack: () => void;
}

export function PolicyConfirmation({ 
  planName, 
  tenure, 
  basePremium, 
  addons, 
  addonPrices,
  onNext, 
  onBack 
}: PolicyConfirmationProps) {
  const totalPremium = basePremium * tenure;
  const addonsTotal = addons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0);
  const subtotal = totalPremium + addonsTotal;
  const gst = subtotal * 0.18;
  const finalAmount = subtotal + gst;

  const policyNumber = `MSW${Date.now().toString().slice(-8)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
  const expiryDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + tenure)
  ).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2>Policy Confirmation</h2>
        <p className="text-muted-foreground">
          Review your warranty details before proceeding to payment
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Premium Breakdown */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Premium Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {planName} Plan ({tenure} {tenure === 1 ? 'Year' : 'Years'})
                  </span>
                  <span>₹{totalPremium.toLocaleString('en-IN')}</span>
                </div>

                {addons.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm mb-2">Add-ons:</p>
                      {addons.map(addon => (
                        <div key={addon} className="flex justify-between text-sm ml-4 mb-2">
                          <span className="text-muted-foreground capitalize">
                            {addon.replace(/-/g, ' ')}
                          </span>
                          <span>₹{(addonPrices[addon] || 0).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-lg">Total Payable Amount</span>
                  <span className="text-2xl text-[#3E378F]">
                    ₹{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡 <span className="font-medium">Note:</span> You can pay in easy EMIs using Car Wallet or other EMI options in the next step.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Policy Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Policy Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#3E378F] rounded flex items-center justify-center text-white font-bold text-sm">
                      MS
                    </div>
                    <span className="font-semibold text-sm">Maruti Suzuki</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Extended Warranty Certificate</p>
                    <p className="text-xs text-muted-foreground">MARUTI SUZUKI INDIA LIMITED</p>
                  </div>
                </div>

                {/* Policy Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Policy Number</p>
                    <p className="font-mono">{policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issue Date</p>
                    <p>{issueDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Coverage Period</p>
                    <p>{tenure} {tenure === 1 ? 'Year' : 'Years'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p>{expiryDate}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Customer Details</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p>Amit Sharma</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mobile</p>
                      <p>+91 98765 43210</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Vehicle Details</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Model</p>
                      <p>Swift VXI 2022</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Registration</p>
                      <p>DL-01-AB-1234</p>
                    </div>
                  </div>
                </div>

                {/* Coverage */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Coverage: {planName} Plan</p>
                  {addons.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      With add-ons: {addons.map(a => a.replace(/-/g, ' ')).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download Preview
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Email Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Policy Number</p>
                <p className="font-mono text-sm">{policyNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-sm">{planName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-sm">{tenure} {tenure === 1 ? 'Year' : 'Years'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Add-ons</p>
                <p className="text-sm">{addons.length || 'None'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl text-[#3E378F]">
                  ₹{finalAmount.toLocaleString('en-IN')}
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
        <div className="flex gap-3">
          <Button variant="outline">
            Re-calculate
          </Button>
          <Button
            onClick={onNext}
            className="bg-[#3E378F] hover:bg-[#3E378F]/90"
          >
            Accept Quote & Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
