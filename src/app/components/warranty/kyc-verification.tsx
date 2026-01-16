import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

interface KYCVerificationProps {
  onNext: () => void;
  onBack: () => void;
}

export function KYCVerification({ onNext, onBack }: KYCVerificationProps) {
  const [verificationMethod, setVerificationMethod] = useState<'existing' | 'manual'>('existing');
  const [existingKYCStatus, setExistingKYCStatus] = useState<'checking' | 'found' | 'not-found'>('checking');
  const [documents, setDocuments] = useState({
    aadhar: null as File | null,
    pan: null as File | null,
    address: null as File | null
  });

  // Auto-verify after 2 seconds for demo
  useEffect(() => {
    if (verificationMethod === 'existing' && existingKYCStatus === 'checking') {
      const timer = setTimeout(() => {
        setExistingKYCStatus('found');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [verificationMethod, existingKYCStatus]);

  const handleExistingKYCCheck = () => {
    setExistingKYCStatus('checking');
    // Simulate API call
    setTimeout(() => {
      setExistingKYCStatus('found');
    }, 1500);
  };

  const handleFileUpload = (type: keyof typeof documents, file: File) => {
    setDocuments({ ...documents, [type]: file });
  };

  const canProceed = verificationMethod === 'existing' 
    ? existingKYCStatus === 'found'
    : documents.aadhar && documents.pan && documents.address;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2>KYC Verification</h2>
        <p className="text-muted-foreground">
          Complete KYC verification to process your warranty
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="existing" onValueChange={(v) => setVerificationMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Use Existing KYC</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-6 mt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We'll verify your existing KYC details from our records
                </p>
                
                {existingKYCStatus === 'checking' && (
                  <div className="p-8 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 border-4 border-[#3E378F] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm">Checking existing KYC records...</p>
                    </div>
                  </div>
                )}

                {existingKYCStatus === 'found' && (
                  <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg text-green-900">KYC Verified Successfully</h3>
                        <p className="text-sm text-green-700 mt-1">
                          We found your existing KYC records
                        </p>
                      </div>
                      
                      <div className="w-full max-w-md mt-4 space-y-2">
                        <div className="flex justify-between p-3 bg-white rounded border border-green-200">
                          <span className="text-sm">Customer Name:</span>
                          <span className="text-sm">Amit Sharma</span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded border border-green-200">
                          <span className="text-sm">Aadhaar:</span>
                          <span className="text-sm">XXXX XXXX 1234</span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded border border-green-200">
                          <span className="text-sm">PAN:</span>
                          <span className="text-sm">ABCDE1234F</span>
                        </div>
                        <div className="flex justify-between p-3 bg-white rounded border border-green-200">
                          <span className="text-sm">Verified On:</span>
                          <span className="text-sm">15 Dec 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input id="customerName" placeholder="Enter full name as per documents" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhaar Number</Label>
                      <Input id="aadhar" placeholder="XXXX XXXX XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input id="pan" placeholder="ABCDE1234F" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="customer@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Input id="address" placeholder="House No., Street, City, State, PIN" />
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h4 className="text-sm">Upload Documents</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadharDoc" className="text-sm">Aadhaar Card</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#3E378F] transition-colors cursor-pointer">
                        <input
                          id="aadharDoc"
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('aadhar', e.target.files[0])}
                        />
                        <label htmlFor="aadharDoc" className="cursor-pointer flex flex-col items-center gap-2">
                          {documents.aadhar ? (
                            <>
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                              <p className="text-xs text-green-600">Uploaded</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400" />
                              <p className="text-xs text-muted-foreground">Click to upload</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panDoc" className="text-sm">PAN Card</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#3E378F] transition-colors cursor-pointer">
                        <input
                          id="panDoc"
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('pan', e.target.files[0])}
                        />
                        <label htmlFor="panDoc" className="cursor-pointer flex flex-col items-center gap-2">
                          {documents.pan ? (
                            <>
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                              <p className="text-xs text-green-600">Uploaded</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400" />
                              <p className="text-xs text-muted-foreground">Click to upload</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressDoc" className="text-sm">Address Proof</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#3E378F] transition-colors cursor-pointer">
                        <input
                          id="addressDoc"
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('address', e.target.files[0])}
                        />
                        <label htmlFor="addressDoc" className="cursor-pointer flex flex-col items-center gap-2">
                          {documents.address ? (
                            <>
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                              <p className="text-xs text-green-600">Uploaded</p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400" />
                              <p className="text-xs text-muted-foreground">Click to upload</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-[#3E378F] hover:bg-[#3E378F]/90"
        >
          Continue to Policy Confirmation
        </Button>
      </div>
    </div>
  );
}