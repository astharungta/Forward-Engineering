import { CheckCircle2, Mail, MessageSquare, FileText, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface DeliveryCompletionProps {
  policyNumber: string;
  onComplete: () => void;
}

export function DeliveryCompletion({ policyNumber, onComplete }: DeliveryCompletionProps) {
  const customerEmail = 'amit.sharma@email.com';
  const customerMobile = '+91 98765 43210';
  const customerName = 'Amit Sharma';

  const emailSubject = `Your Maruti Suzuki Extended Warranty - Policy ${policyNumber}`;
  const emailBody = `Dear ${customerName},

Thank you for purchasing the Maruti Suzuki Extended Warranty!

Your Policy Details:
- Policy Number: ${policyNumber}
- Vehicle: Swift VXI 2022 (DL-01-AB-1234)
- Coverage: Royal Platinum Plan (3 Years)
- Premium: ₹88,730 (incl. GST)

Attached documents:
1. Warranty Policy Certificate
2. Invoice
3. Terms & Conditions

Your policy is now active and you can access it anytime through our online portal at: https://warranty.marutisuzuki.com/policy/${policyNumber}

For any queries or to make a claim, please contact our customer support:
📞 1800-123-4567
📧 support@marutisuzuki.com

Thank you for choosing Maruti Suzuki!

Best regards,
Maruti Suzuki Customer Care Team`;

  const smsBody = `Dear ${customerName}, Your Maruti Suzuki Extended Warranty is now active! Policy: ${policyNumber}, Vehicle: DL-01-AB-1234, Premium: Rs.88,730. Check your email for details. Support: 1800-123-4567`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Success Banner */}
      <Card className="border-green-500 bg-gradient-to-r from-green-50 to-green-100">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-green-900 mb-2">Extended Warranty Activated Successfully!</h2>
              <p className="text-green-700">
                Policy Certificate and Invoice have been generated
              </p>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Policy Number</p>
                <p className="text-lg font-mono">{policyNumber}</p>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-500 mt-1">Active</Badge>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="text-lg">{customerName}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Email
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Send policy details and documents to customer
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailTo">To</Label>
              <Input id="emailTo" value={customerEmail} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailSubject">Subject</Label>
              <Input id="emailSubject" value={emailSubject} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailBody">Message</Label>
              <Textarea 
                id="emailBody" 
                value={emailBody} 
                rows={10}
                className="font-mono text-xs"
                readOnly
              />
            </div>

            <div className="p-3 bg-gray-50 border rounded-lg">
              <p className="text-sm font-medium mb-2">Attachments:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-[#3E378F]" />
                  <span>Warranty_Policy_{policyNumber}.pdf</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-[#3E378F]" />
                  <span>Invoice_{policyNumber}.pdf</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-[#3E378F]" />
                  <span>Terms_and_Conditions.pdf</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#3E378F] hover:bg-[#3E378F]/90 gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
          </CardContent>
        </Card>

        {/* SMS Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send SMS
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Send confirmation SMS to customer
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smsTo">Mobile Number</Label>
              <Input id="smsTo" value={customerMobile} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smsBody">Message</Label>
              <Textarea 
                id="smsBody" 
                value={smsBody}
                rows={6}
                className="text-sm"
                readOnly
              />
              <p className="text-xs text-muted-foreground text-right">
                {smsBody.length} / 160 characters
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                💡 SMS will be sent from official Maruti Suzuki number: <strong>SM-MARUTI</strong>
              </p>
            </div>

            <Button className="w-full bg-[#3E378F] hover:bg-[#3E378F]/90 gap-2">
              <MessageSquare className="h-4 w-4" />
              Send SMS
            </Button>

            {/* Quick Actions */}
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Policy
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Process Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Policy Created</p>
                <p className="text-sm font-medium">{policyNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificate</p>
                <p className="text-sm font-medium">Generated</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice</p>
                <p className="text-sm font-medium">Generated</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="text-sm font-medium">Completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-[#3E378F] hover:bg-[#3E378F]/90 gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Complete & Process Another
        </Button>
      </div>
    </div>
  );
}