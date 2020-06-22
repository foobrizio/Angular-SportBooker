export class User {

  id: number;
  email: string;
  firstName: string;
  lastName: string;

  static create(x: object): User{

    const user = new User();
    Object.keys(x).forEach( key => {
      user[key] = x[key];
    });
    return user;
  }
}
