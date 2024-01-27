export interface Coordinates {
  coords: {
    latitude: number,
    longitude: number
  }
}
export class GeoUtils{
  static getDistanceFromTwoPoints(p1: Coordinates, p2: Coordinates) {
    let R = 6371 // Radius of the earth in km
    let lat1 = p1.coords.latitude
    let lon1 = p1.coords.longitude

    let lat2 = p2.coords.latitude
    let lon2 = p2.coords.longitude
    let distanceLatitudes = GeoUtils.deg2rad(lat2 - lat1)  // deg2rad below
    let distanceLongitudes = GeoUtils.deg2rad(lon2 - lon1)
    let a =
      Math.sin(distanceLatitudes / 2) * Math.sin(distanceLatitudes / 2) +
      Math.cos(GeoUtils.deg2rad(lat1)) * Math.cos(GeoUtils.deg2rad(lat2)) *
      Math.sin(distanceLongitudes / 2) * Math.sin(distanceLongitudes / 2)

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  static deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }
}
