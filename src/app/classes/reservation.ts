import { Field } from './field';
import { logging } from 'protractor';
import { User } from './user';

export class Reservation {


  id:number;
  field: Field;
  bookingTime: number;
  booker: User;

  constructor(){}

  getBookingTimeToString(): string{


    const date= new Date(this.bookingTime);
    return date.toString();
  }
}
