export class User {
  constructor({ id, email, name, avatar = null, createdAt = new Date() }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.avatar = avatar;
    this.createdAt = createdAt;
  }

  static fromJSON(json) {
    return new User({
      id: json._id || json.id,
      email: json.email,
      name: json.name,
      avatar: json.avatar,
      createdAt: new Date(json.createdAt),
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      createdAt: this.createdAt.toISOString(),
    };
  }
}