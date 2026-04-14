import { CreateMortgageProfileDto } from '../dto/create-mortgage-profile.request';

export enum PropertyType {
  APARTMENT_IN_NEW_BUILDING = 'apartment_in_new_building',
  APARTMENT_IN_SECONDARY_BUILDING = 'apartment_in_secondary_building',
  HOUSE = 'house',
  HOUSE_WITH_LAND_PLOT = 'house_with_land_plot',
  LAND_PLOT = 'land_plot',
  OTHER = 'other'
}

export type MonthlyMortgagePayment = {
  totalPayment: number;
  repaymentOfMortgageBody: number;
  repaymentOfMortgageInterest: number;
  mortgageBalance: number;
};

export type MortgagePaymentSchedule = {
  [year: string]: {
    [month: string]: MonthlyMortgagePayment;
  };
};

export type MortgageComputedValues = {
  monthlyPayment: number;
  totalPayment: number;
  totalOverpaymentAmount: number;
  possibleTaxDeduction: number;
  savingsDueMotherCapital: number;
  recommendedIncome: number;
  paymentSchedule: MortgagePaymentSchedule;
};

export type MortgageCalculationRecord = {
  id: number;
  userId: string;
  mortgageProfileId: number;
  monthlyPayment: string;
  totalPayment: string;
  totalOverpaymentAmount: string;
  possibleTaxDeduction: string;
  savingsDueMotherCapital: string;
  recommendedIncome: string;
  paymentSchedule: string;
};

export type MortgageCalculationResponse = {
  monthlyPayment: string;
  totalPayment: string;
  totalOverpaymentAmount: string;
  possibleTaxDeduction: string;
  savingsDueMotherCapital: string;
  recommendedIncome: string;
  mortgagePaymentSchedule: MortgagePaymentSchedule;
};

export type CreateMortgageInput = CreateMortgageProfileDto;
