import {TrashTypes} from "./trashtype";
import {Dumpster} from "./dumpster";

export class Empty {
  constructor(
    public userID: string,
    public dumpster: Dumpster,
    public date: Date,
    public type: TrashTypes,
    public quantity: number,
  ) {
  }
}
