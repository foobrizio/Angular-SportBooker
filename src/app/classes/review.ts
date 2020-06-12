import { Company } from './company';
import { User } from './user';

export class Review {

  id: number;
  company: Company;
  reviewer: User;
  publishTime: Date;
  comment: string;
  vote: 5;

  constructor(){ }

  static create(x: object): Review{
    const r = new Review();
    Object.keys(x).forEach( key => {
      r[key] = x[key];
    });
    return r;

  }


}
