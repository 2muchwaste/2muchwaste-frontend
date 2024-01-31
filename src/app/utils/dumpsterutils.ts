import {Dumpster} from "../models/dumpster";

export class DumpsterUtils {
  getUsagePercentage(dumpster: Dumpster) {
    return dumpster.actualWeight/dumpster.maxWeight*100
  }
  isDumpsterFull(dumpster: Dumpster){
    return this.getUsagePercentage(dumpster) >= dumpster.limitUsablePercentage
  }

}
