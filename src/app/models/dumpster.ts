import {TrashTypes} from "./trashtype";

export class Dumpster {

  constructor(
    // public __v: string,
    // public _id: string,
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

// Builder class for Dumpster
export class DumpsterBuilder {
  private actualWeight!: number
  private address!: string
  private area!: string
  private available!: boolean
  private city!: string
  private latitude!: number
  private longitude!: number
  private limitUsablePercentage!: number
  private maxWeight!: number
  private openingSecondsDuration!: number
  private type!: TrashTypes
  private zipCode!: number

  constructor() {}

  // Setters for the properties
  setActualWeight(actualWeight: number) {
    this.actualWeight = actualWeight
    return this
  }

  setAddress(address: string) {
    this.address = address
    return this
  }

  setArea(area: string) {
    this.area = area
    return this
  }

  setAvailable(available: boolean) {
    this.available = available
    return this
  }

  setCity(city: string) {
    this.city = city
    return this
  }

  setLatitude(latitude: number) {
    this.latitude = latitude
    return this
  }

  setLongitude(longitude: number) {
    this.longitude = longitude
    return this
  }

  setLimitUsablePercentage(limitUsablePercentage: number) {
    this.limitUsablePercentage = limitUsablePercentage
    return this;
  }

  setMaxWeight(maxWeight: number) {
    this.maxWeight = maxWeight
    return this
  }

  setOpeningSecondsDuration(openingSecondsDuration: number) {
    this.openingSecondsDuration = openingSecondsDuration
    return this
  }

  setType(type: TrashTypes) {
    this.type = type
    return this
  }

  setZipCode(zipCode: number) {
    this.zipCode = zipCode
    return this
  }

  // Build method to create a Dumpster object
  build() {
    return new Dumpster(
      this.actualWeight,
      this.address,
      this.area,
      this.available,
      this.city,
      this.latitude,
      this.longitude,
      this.limitUsablePercentage,
      this.maxWeight,
      this.openingSecondsDuration,
      this.type,
      this.zipCode
    )
  }
}


