export enum TrashTypes {
  PAPER = 'paper',
  PLASTIC = 'plastic',
  METAL = 'metal',
  GLASS = 'glass',
  GREEN = 'green',
  OIL = 'oil',
  ORGANIC = 'organic',
  MEDICAL = 'medical',
  ELECTRICAL = 'electrical',
  MIXED = 'mixed',
}

export class TrashTypeManager {
  private typeToColorMap: Map<TrashTypes, { color: string, italianName: string }> = new Map();

  constructor() {
    this.typeToColorMap.set(TrashTypes.PAPER, {color: '#FF0000', italianName: 'Carta'}); // Red
    this.typeToColorMap.set(TrashTypes.PLASTIC, {color: '#FFFF00', italianName: 'Plastica'}); // Yellow
    this.typeToColorMap.set(TrashTypes.METAL, {color: '#FF00FF', italianName: 'Metallo'}); // Magenta
    this.typeToColorMap.set(TrashTypes.GLASS, {color: '#0000FF', italianName: 'Vetro'}); // Blue
    this.typeToColorMap.set(TrashTypes.GREEN, {color: '#008000', italianName: 'Verde'}); // Green
    this.typeToColorMap.set(TrashTypes.MEDICAL, {color: '#800080', italianName: 'Rifiuti Medici'}); // Purple
    this.typeToColorMap.set(TrashTypes.ELECTRICAL, {color: '#FFA500', italianName: 'Elettrico'}); // Orange
    this.typeToColorMap.set(TrashTypes.OIL, {color: '#00FFFF', italianName: 'Olio'}); // Cyan
    this.typeToColorMap.set(TrashTypes.MIXED, {color: '#A0522D', italianName: 'Misto'}); // Sienna
    this.typeToColorMap.set(TrashTypes.ORGANIC, {color: '#00FF00', italianName: 'Organico'}); // Lime Green


  }

  getColorForTrashType(trashType: TrashTypes): string | undefined {
    return this.typeToColorMap.get(trashType)?.color;
  }

  getItalianName(trashType: TrashTypes): string | undefined {
    let type = this.typeToColorMap.get(trashType)?.italianName
    // @ts-ignore
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  getAvailableTrashTypes(): TrashTypes[] {
    return Array.from(this.typeToColorMap.keys());
  }
}
