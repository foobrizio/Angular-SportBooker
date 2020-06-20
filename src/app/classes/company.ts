import { Time } from '@angular/common';

export class Company {

  id: number;
  name: string;
  description: string;
  owner: number;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingTime: Time;
  closingTime: Time;
  freeDay: number;

  constructor(){  }


  /* Metodo factory che mi crea una Company */
  static create(x: object): Company{

    const c = new Company();
    Object.keys(x).forEach( key => {
      c[key] = x[key];
    });
    return c;
  }

  status(): string {

    const now = new Date();
    const day = now.getDay();
    if (day === this.freeDay){
      return 'closed';
    }
    const hour = now.getHours();
    const minute = now.getMinutes();
    const openingHour = parseInt(String(this.openingTime).substring(0, 2), 10);
    const openingMinute = parseInt(String(this.openingTime).substring(3, 5), 10);
    let closingHour = parseInt(String(this.closingTime).substring(0, 2), 10);
    if (closingHour === 0){
      closingHour = 24;
    }
    const closingMinute = parseInt(String(this.closingTime).substring(3, 5), 10);
    // verifichiamo ora che la struttura debba ancora aprire
    if (openingHour > hour){
      return 'closed';
    }
    else if (openingHour === hour && openingMinute > minute){
      return 'closed';
    }
    // arrivati qui, siamo certi che l'orario di apertura sia passato. Controlliamo quindi che la struttura abbia già chiuso
    if (closingHour < hour){
      return 'closed';
    }
    else if (closingHour === hour && closingMinute < minute){
      return 'closed';
    }
    // arrivati qui siamo certi che la struttura sia aperta. Dobbiamo solo verificare se sta per chiudere,
    // ovvero se manca meno di 1 ora alla chiusura
    if ((closingHour - hour === 1) && (closingMinute < minute)){
      return 'closing';
    }
    if ((closingHour - hour === 0) && (closingMinute > minute)){
      return 'closing';
    }
    return 'open';
  }

  freeDayToString(): string{

    switch (this.freeDay){
      case 1: return 'lunedì'; break;
      case 2: return 'martedì'; break;
      case 3: return 'mercoledì'; break;
      case 4: return 'giovedì'; break;
      case 5: return 'venerdì'; break;
      case 6: return 'sabato'; break;
      default: return 'domenica';
    }
  }
}
