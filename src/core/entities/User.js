// src/core/entities/User.js

export class User {
  constructor({ id, email, role = 'estudiante', avatar = null, createdAt = new Date() }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.avatar = avatar;
    this.createdAt = createdAt;
  }

  static fromJSON(json) {
    return new User({
      id: json._id || json.id,
      email: json.email,
      role: json.role,
      avatar: json.avatar,
      createdAt: new Date(json.createdAt),
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
