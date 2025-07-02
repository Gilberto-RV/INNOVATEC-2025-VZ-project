export class Event {
  constructor({
    id,
    title,
    description,
    image,
    date,
    location = null,
    isActive = true,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.date = date;
    this.location = location;
    this.isActive = isActive;
  }

  static fromJSON(json) {
    return new Event({
      id: json._id || json.id,
      title: json.title,
      description: json.description,
      image: json.image,
      date: new Date(json.date),
      location: json.location,
      isActive: json.isActive,
    });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      image: this.image,
      date: this.date.toISOString(),
      location: this.location,
      isActive: this.isActive,
    };
  }
}