export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low';

export type CtaType = 'Value Accelerator' | 'OCI' | 'OWI' | 'AMFA';

export interface Customer {
  id: string;
  name: string;
  company: string;
  accountExecutive: string;
  ctaType: CtaType;
  riskLevel: RiskLevel;
  segment?: string;
  arr?: number;
  renewalDate: string;
  healthScore: number;
  pathToGreenLink?: string;
  closed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
