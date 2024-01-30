export enum DumpsterErrorType {
  FULL = 'full',
  PHYSICAL_PROBLEM = 'physical_problem',
  OBSTRUCTION = 'obstruction',
  ERROR = 'error',
}

export class DumpsterErrorTypeManager {
  public typeItalianName: Map<DumpsterErrorType,string> = new Map()

  constructor() {
    this.typeItalianName.set(DumpsterErrorType.FULL, "Pieno")
    this.typeItalianName.set(DumpsterErrorType.PHYSICAL_PROBLEM, "Problema nel bidone")
    this.typeItalianName.set(DumpsterErrorType.OBSTRUCTION, "Ostruzione")
    this.typeItalianName.set(DumpsterErrorType.ERROR, "Errore")
  }

  public getItalianType(type:DumpsterErrorType){
    return this.typeItalianName.get(type)
  }
}
