export class Building {
  constructor({
    id,
    name,
    description,
    coordinates,
    type,
    hasRamp = false,
    isAccessible = false,
    floors = 1,
    image = null,
    facilities = [],
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.coordinates = coordinates; // { latitude, longitude }
    this.type = type;
    this.hasRamp = hasRamp;
    this.isAccessible = isAccessible;
    this.floors = floors;
    this.image = image;
    this.facilities = facilities;
  }

  static fromGeoJSON(feature) {
    const { properties, geometry } = feature;
    const [longitude, latitude] = geometry.coordinates;
    
    return new Building({
      id: properties.id,
      name: properties.name,
      description: properties.description,
      coordinates: { latitude, longitude },
      type: properties.type,
      hasRamp: properties.hasRamp || false,
      isAccessible: properties.isAccessible || false,
      floors: properties.floors || 1,
      image: properties.image,
      facilities: properties.facilities || [],
    });
  }

  static fromJSON(json) {
    return new Building({
      id: json._id || json.id,
      name: json.name,
      description: json.description,
      coordinates: json.coordinates,
      type: json.type,
      hasRamp: json.hasRamp,
      isAccessible: json.isAccessible,
      floors: json.floors,
      image: json.image,
      facilities: json.facilities,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      coordinates: this.coordinates,
      type: this.type,
      hasRamp: this.hasRamp,
      isAccessible: this.isAccessible,
      floors: this.floors,
      image: this.image,
      facilities: this.facilities,
    };
  }
}