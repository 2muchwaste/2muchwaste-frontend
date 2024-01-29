import {Dumpster} from "../models/dumpster";

export class DumpsterUtils {
  static getUsagePercentage(dumpster: Dumpster) {
    return dumpster.actualWeight/dumpster.maxWeight*100
  }
  static isDumpsterFull(dumpster: Dumpster){
    return DumpsterUtils.getUsagePercentage(dumpster) >= dumpster.limitUsablePercentage
  }

}
