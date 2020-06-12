import { Company } from './company';

export class Field {

  id: number;
  sport: string;
  terrain: string;
  length: number;
  width: number;
  ownerCompany: Company;
  costPerHour: number;
}
