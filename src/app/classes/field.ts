import { Company } from './company';

export class Field {

  id: number;
  sport: string;
  terrain: string;
  length: number;
  width: number;
  ownerCompany: Company;
  cost: number;

  /* Metodo factory che mi crea un Field */
  static create(x: object): Field{

    const f = new Field();
    Object.keys(x).forEach( key => {
      f[key] = x[key];
    });
    return f;
  }
}



