export class Building {
  constructor({
    id,
    name,
    description,
    accessibility = false,
    floors = 1,
    media = null,
    services = [],
    availability = false,
    student_frequency = false,
    bathrooms = {},
    entrances = [],
    careers = [],
    subject = [],
    last_updated = null,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.accessibility = accessibility;
    this.floors = floors;
    this.image = media;
    this.services = services;
    this.availability = availability;
    this.student_frequency = student_frequency;
    this.bathrooms = bathrooms;
    this.entrances = entrances;
    this.careers = careers;
    this.subject = subject;
    this.last_updated = last_updated;
  }

  static fromJSON(json) {
    return new Building({
      id: json._id || json.id,
      name: json.name,
      description: json.description,
      accessibility: json.accessibility,
      floors: json.floors,
      media: json.media,
      availability: json.availability,
      student_frequency: json.student_frequency,
      services: json.services,
      bathrooms: json.bathrooms,
      entrances: json.entrances,
      careers: json.careers,
      subject: json.subject,
      last_updated: json.last_updated,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      accessibility: this.accessibility,
      floors: this.floors,
      media: this.media,
      availability: this.availability,
      student_frequency: this.student_frequency,
      services: this.services,
      bathrooms: this.bathrooms,
      entrances: this.entrances,
      careers: this.careers,
      subject: this.subject,
      last_updated: this.last_updated,
    };
  }
}
