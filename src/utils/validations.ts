// Validation utilities based on user stories

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// VIN Validation - 17 character alphanumeric
export const validateVIN = (vin: string): ValidationResult => {
  if (!vin || vin.trim() === '') {
    return { isValid: false, message: 'VIN is required' };
  }

  if (vin.length !== 17) {
    return { isValid: false, message: 'VIN must be exactly 17 characters' };
  }

  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(vin)) {
    return { isValid: false, message: 'Invalid VIN format. Use only letters (excluding I, O, Q) and numbers' };
  }

  return { isValid: true, message: 'Valid VIN' };
};

// GST Number Validation - 15 character alphanumeric
export const validateGST = (gstNumber: string): ValidationResult => {
  if (!gstNumber || gstNumber.trim() === '') {
    return { isValid: false, message: 'GST Number is required' };
  }

  if (gstNumber.length !== 15) {
    return { isValid: false, message: 'GST Number must be exactly 15 characters' };
  }

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstRegex.test(gstNumber)) {
    return { isValid: false, message: 'Invalid GST Number format' };
  }

  return { isValid: true, message: 'Valid GST Number' };
};

// Mobile Number Validation - 10 digits starting with 6-9
export const validateMobile = (mobile: string): ValidationResult => {
  if (!mobile || mobile.trim() === '') {
    return { isValid: false, message: 'Mobile number is required' };
  }

  // Remove any spaces or special characters
  const cleanMobile = mobile.replace(/[^\d]/g, '');

  if (cleanMobile.length !== 10) {
    return { isValid: false, message: 'Mobile number must be 10 digits' };
  }

  const mobileRegex = /^[6-9][0-9]{9}$/;
  if (!mobileRegex.test(cleanMobile)) {
    return { isValid: false, message: 'Invalid mobile number. Must start with 6, 7, 8, or 9' };
  }

  return { isValid: true, message: 'Valid mobile number' };
};

// Email Validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  return { isValid: true, message: 'Valid email' };
};

// Registration Number Validation
export const validateRegistrationNumber = (regNumber: string): ValidationResult => {
  if (!regNumber || regNumber.trim() === '') {
    return { isValid: false, message: 'Registration number is required' };
  }

  // Indian registration format: XX-00-XX-0000 or XX00XX0000
  const regRegex = /^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,2}[-\s]?[0-9]{1,4}$/;
  if (!regRegex.test(regNumber.toUpperCase())) {
    return { isValid: false, message: 'Invalid registration number format (e.g., DL-01-AB-1234)' };
  }

  return { isValid: true, message: 'Valid registration number' };
};

// Mileage Validation
export const validateMileage = (mileage: number): ValidationResult => {
  if (mileage < 0) {
    return { isValid: false, message: 'Mileage cannot be negative' };
  }

  if (mileage > 500000) {
    return { isValid: false, message: 'Mileage seems unrealistic. Please verify' };
  }

  return { isValid: true, message: 'Valid mileage' };
};

// Document Count Validation
export const validateDocuments = (documents: any[]): ValidationResult => {
  if (!documents || documents.length < 4) {
    return { isValid: false, message: 'Please upload minimum 4 documents' };
  }

  return { isValid: true, message: 'Documents validated' };
};

// Payment Mode Validation
export const validatePaymentMode = (
  paymentMode: string,
  bankName?: string,
  chequeNumber?: string
): ValidationResult => {
  const validModes = ['CASH', 'CHEQUE', 'CARD', 'UPI', 'EMI', 'WALLET'];

  if (!validModes.includes(paymentMode.toUpperCase())) {
    return { isValid: false, message: 'Invalid payment mode' };
  }

  if (paymentMode.toUpperCase() === 'CHEQUE') {
    if (!bankName || bankName.trim() === '') {
      return { isValid: false, message: 'Bank name is required for cheque payment' };
    }

    if (!chequeNumber || chequeNumber.trim() === '') {
      return { isValid: false, message: 'Cheque number is required for cheque payment' };
    }
  }

  return { isValid: true, message: 'Valid payment mode' };
};

// Warranty Type Validation
export const validateWarrantyType = (warrantyType: string): ValidationResult => {
  const validTypes = ['PLAT', 'RPLAT', 'SOLI', 'GOLD', 'SILV', 'PLATINUM', 'ROYAL PLATINUM', 'SOLITAIRE'];

  if (!validTypes.includes(warrantyType.toUpperCase())) {
    return { isValid: false, message: 'Invalid warranty type' };
  }

  return { isValid: true, message: 'Valid warranty type' };
};

// Eligibility Check
export const checkEligibility = (manufactureDate: Date, mileage: number): ValidationResult => {
  const vehicleAge = (Date.now() - manufactureDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  // Vehicle must be less than 5 years old
  if (vehicleAge > 5) {
    return { 
      isValid: false, 
      message: 'Vehicle is not eligible for extended warranty - Age exceeds 5 years' 
    };
  }

  // Vehicle must have less than 100,000 km
  if (mileage > 100000) {
    return { 
      isValid: false, 
      message: 'Vehicle is not eligible for extended warranty - Mileage exceeds 100,000 km' 
    };
  }

  // Vehicle must be at least 6 months old
  if (vehicleAge < 0.5) {
    return { 
      isValid: false, 
      message: 'Vehicle is not eligible for extended warranty - Must be at least 6 months old' 
    };
  }

  return { isValid: true, message: 'Vehicle is eligible for extended warranty' };
};

// Required Field Validation
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }

  return { isValid: true, message: 'Valid' };
};

// Numeric Range Validation
export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult => {
  if (value < min || value > max) {
    return { 
      isValid: false, 
      message: `${fieldName} must be between ${min} and ${max}` 
    };
  }

  return { isValid: true, message: 'Valid' };
};
