import { Download, Mail, Printer, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface InvoiceGenerationProps {
  policyData: {
    policyNumber: string;
    planName: string;
    tenure: number;
    basePremium: number;
    addons: string[];
    addonPrices: Record<string, number>;
    totalAmount: number;
  };
  onNext: () => void;
  onBack: () => void;
}

export function InvoiceGeneration({ policyData, onNext, onBack }: InvoiceGenerationProps) {
  const invoiceNumber = `INV${Date.now().toString().slice(-8)}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const subtotal = policyData.basePremium * policyData.tenure + 
    policyData.addons.reduce((sum, addon) => sum + (policyData.addonPrices[addon] || 0), 0);
  const gst = subtotal * 0.18;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Success Banner */}
      <Card className="border-green-500 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-green-900">Payment Successful!</h3>
              <p className="text-sm text-green-700">
                Your extended warranty has been activated. Invoice generated successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white border rounded-lg p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 bg-[#3E378F] rounded flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <span className="font-bold text-lg">Maruti Suzuki</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">MARUTI SUZUKI INDIA LIMITED</p>
                  <p className="text-muted-foreground">Authorized Dealer</p>
                  <p className="text-muted-foreground">Plot No. 123, Sector 18, Gurgaon</p>
                  <p className="text-muted-foreground">Haryana - 122015</p>
                  <p className="text-muted-foreground">GSTIN: 06AAACC1234F1Z5</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl mb-2">INVOICE</p>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Invoice #:</span> {invoiceNumber}</p>
                  <p><span className="text-muted-foreground">Date:</span> {invoiceDate}</p>
                  <p><span className="text-muted-foreground">Policy #:</span> {policyData.policyNumber}</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium mb-2">Bill To:</p>
                <div className="text-sm space-y-1">
                  <p>Amit Sharma</p>
                  <p className="text-muted-foreground">House No. 456, Sector 22</p>
                  <p className="text-muted-foreground">Noida, Uttar Pradesh - 201301</p>
                  <p className="text-muted-foreground">Phone: +91 98765 43210</p>
                  <p className="text-muted-foreground">Email: amit.sharma@email.com</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Vehicle Details:</p>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Model:</span> Swift VXI 2022</p>
                  <p><span className="text-muted-foreground">Registration:</span> DL-01-AB-1234</p>
                  <p><span className="text-muted-foreground">VIN:</span> MA3EUA81S00123456</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Description</th>
                    <th className="text-right py-3 font-medium w-32">Quantity</th>
                    <th className="text-right py-3 font-medium w-32">Rate</th>
                    <th className="text-right py-3 font-medium w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">
                      <p className="font-medium">{policyData.planName} Extended Warranty</p>
                      <p className="text-xs text-muted-foreground">
                        Coverage: {policyData.tenure} {policyData.tenure === 1 ? 'Year' : 'Years'}
                      </p>
                    </td>
                    <td className="text-right py-3">{policyData.tenure}</td>
                    <td className="text-right py-3">₹{policyData.basePremium.toLocaleString('en-IN')}</td>
                    <td className="text-right py-3">
                      ₹{(policyData.basePremium * policyData.tenure).toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {policyData.addons.map((addon, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <p className="capitalize">{addon.replace(/-/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">Add-on coverage</p>
                      </td>
                      <td className="text-right py-3">1</td>
                      <td className="text-right py-3">
                        ₹{(policyData.addonPrices[addon] || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="text-right py-3">
                        ₹{(policyData.addonPrices[addon] || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mt-6">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%):</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl text-[#3E378F]">
                      ₹{policyData.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-6 border-t">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-medium mb-2">Payment Information</p>
                  <p className="text-muted-foreground">Payment Method: UPI</p>
                  <p className="text-muted-foreground">Transaction ID: TXN{Date.now().toString().slice(-10)}</p>
                  <p className="text-muted-foreground">Status: <span className="text-green-600">Paid</span></p>
                </div>
                <div>
                  <p className="font-medium mb-2">Terms & Conditions</p>
                  <p className="text-xs text-muted-foreground">
                    1. This warranty is non-transferable<br />
                    2. Regular service mandatory for claims<br />
                    3. Subject to terms and conditions
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Thank you for choosing Maruti Suzuki Extended Warranty
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                For queries, contact: support@marutisuzuki.com | 1800-123-4567
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Continue to Delivery
        </Button>
      </div>
    </div>
  );
}
