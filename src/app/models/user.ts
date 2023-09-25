export class User {
  constructor(
    public name: string,
    public surname: string,
    public birthday: string,
    public cf: string,
    public email: string,
    public address: string,
    public zipCode: number,
    public city: string,
    public role: string,
    public password: string,
  ) {
  }

}

export class UserBuilder {
  private user: any = {
    name: '',
    surname: '',
    birthday: '',
    cf: '',
    email: '',
    address: '',
    zipCode: 0,
    city: '',
    role: '',
    password: ''
  };

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  setSurname(surname: string): UserBuilder {
    this.user.surname = surname;
    return this;
  }

  setBirthday(birthday: string): UserBuilder {
    this.user.birthday = birthday;
    return this;
  }

  setCF(cf: string): UserBuilder {
    this.user.cf = cf;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  setAddress(address: string): UserBuilder {
    this.user.address = address;
    return this;
  }

  setZipCode(zipCode: number): UserBuilder {
    this.user.zipCode = zipCode;
    return this;
  }

  setCity(city: string): UserBuilder {
    this.user.city = city;
    return this;
  }

  setRole(role: string): UserBuilder {
    this.user.role = role;
    return this;
  }

  setPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  build(): any {
    return this.user;
  }
}
