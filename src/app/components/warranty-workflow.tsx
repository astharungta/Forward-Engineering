import { useState } from 'react';
import { WorkflowStepper, Step } from './workflow-stepper';
import { VehicleIdCapture } from './warranty/vehicle-id-capture';
import { EligibilityCheck } from './warranty/eligibility-check';
import { PlanSelection } from './warranty/plan-selection';
import { AddonsSelection } from './warranty/addons-selection';
import { KYCVerification } from './warranty/kyc-verification';
import { PolicyConfirmation } from './warranty/policy-confirmation';
import { PaymentOptions } from './warranty/payment-options';
import { InvoiceGeneration } from './warranty/invoice-generation';
import { DeliveryCompletion } from './warranty/delivery-completion';

const workflowSteps: Step[] = [
  { id: 'vehicle-id', label: 'Vehicle ID', description: 'Capture vehicle details' },
  { id: 'eligibility', label: 'Eligibility', description: 'Check warranty eligibility' },
  { id: 'plan', label: 'Plan Selection', description: 'Choose warranty plan' },
  { id: 'addons', label: 'Add-ons', description: 'Select optional add-ons' },
  { id: 'kyc', label: 'KYC Verification', description: 'Verify customer identity' },
  { id: 'policy', label: 'Policy', description: 'Review and confirm' },
  { id: 'payment', label: 'Payment', description: 'Complete payment' },
  { id: 'invoice', label: 'Invoice', description: 'Generate invoice' },
  { id: 'delivery', label: 'Delivery', description: 'Complete process' }
];

const addonPrices: Record<string, number> = {
  'ccp-fuel': 3999,
  'ccp-hydro': 5999,
  'ccp-plus': 8999
};

export function WarrantyWorkflow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [workflowData, setWorkflowData] = useState({
    vehicles: [] as any[],
    selectedPlan: '',
    tenure: 3,
    basePremium: 24999,
    selectedAddons: [] as string[],
    policyNumber: ''
  });

  const handleNext = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setWorkflowData({
      vehicles: [],
      selectedPlan: '',
      tenure: 3,
      basePremium: 24999,
      selectedAddons: [],
      policyNumber: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <VehicleIdCapture
            onNext={(vehicles) => {
              setWorkflowData({ ...workflowData, vehicles });
              handleNext();
            }}
          />
        );
      
      case 1:
        return (
          <EligibilityCheck
            vehicles={workflowData.vehicles}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 2:
        return (
          <PlanSelection
            onNext={(plan, tenure) => {
              const planPrices: Record<string, number> = {
                'platinum': 18999,
                'royal-platinum': 24999,
                'solitaire': 32999
              };
              setWorkflowData({
                ...workflowData,
                selectedPlan: plan,
                tenure,
                basePremium: planPrices[plan] || 24999
              });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      
      case 3:
        return (
          <AddonsSelection
            basePremium={workflowData.basePremium * workflowData.tenure}
            onNext={(addons) => {
              setWorkflowData({ ...workflowData, selectedAddons: addons });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      
      case 4:
        return (
          <KYCVerification
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 5:
        const subtotal = (workflowData.basePremium * workflowData.tenure) +
          workflowData.selectedAddons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0);
        const gst = subtotal * 0.18;
        const totalAmount = subtotal + gst;
        
        return (
          <PolicyConfirmation
            planName={workflowData.selectedPlan.split('-').map(w => 
              w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ')}
            tenure={workflowData.tenure}
            basePremium={workflowData.basePremium}
            addons={workflowData.selectedAddons}
            addonPrices={addonPrices}
            onNext={() => {
              const policyNumber = `MSW${Date.now().toString().slice(-8)}`;
              setWorkflowData({ ...workflowData, policyNumber });
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      
      case 6:
        return (
          <PaymentOptions
            amount={(() => {
              const sub = (workflowData.basePremium * workflowData.tenure) +
                workflowData.selectedAddons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0);
              return sub + (sub * 0.18);
            })()}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 7:
        const policySubtotal = (workflowData.basePremium * workflowData.tenure) +
          workflowData.selectedAddons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0);
        const policyGst = policySubtotal * 0.18;
        const policyTotal = policySubtotal + policyGst;
        
        return (
          <InvoiceGeneration
            policyData={{
              policyNumber: workflowData.policyNumber,
              planName: workflowData.selectedPlan.split('-').map(w => 
                w.charAt(0).toUpperCase() + w.slice(1)
              ).join(' '),
              tenure: workflowData.tenure,
              basePremium: workflowData.basePremium,
              addons: workflowData.selectedAddons,
              addonPrices: addonPrices,
              totalAmount: policyTotal
            }}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 8:
        return (
          <DeliveryCompletion
            policyNumber={workflowData.policyNumber}
            onComplete={handleComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkflowStepper
        steps={workflowSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
      <div className="p-6">
        {renderStep()}
      </div>
    </div>
  );
}