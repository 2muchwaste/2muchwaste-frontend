export class SigninResponse {
  constructor(
    public email:string,
    public _id:string,
    public role:{_id:string,name:string},
    public name:string,
    public token:string,
  ) {
  }
}

