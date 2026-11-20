class User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
    role,
    status,
    isVerified,
    avatarUrl
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.phone = phone;
    this.role = role;
    this.status = status || 'active';
    this.isVerified = isVerified || false;
    this.avatarUrl = avatarUrl || null;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

module.exports = User;
