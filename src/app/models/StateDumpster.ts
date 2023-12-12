import {TrashTypes} from "./trashtype";

export class StateDumpster {

  constructor(
  public actualWeight: number,
    public address: string,
    public area: string,
    public available: boolean,
    public city: string,
    public latitude: number,
    public longitude: number,
    public limitUsablePercentage: number,
    public maxWeight: number,
    public openingSecondsDuration: number,
    public type: TrashTypes,
    public zipCode: number
  ) {
  }
}
