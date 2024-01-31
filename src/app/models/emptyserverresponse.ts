import {TrashTypes, TrashTypeManager} from "./trashtype";


export class EmptyServerResponse {
  constructor(
    public empties: {
      date: Date,
      type: TrashTypes,
      dumpsterID: string,
      _id: string,
    }[]
  ) {
  }
}
