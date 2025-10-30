// src/core/usecases/AuthUseCases.js

export class AuthUseCases {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async login(email, password) {
    return this.authRepository.login(email, password);
  }

  async register(email, password, avatar = null, role = 'estudiante') {
    return this.authRepository.register(email, password, avatar, role);
  }

  async logout() {
    return this.authRepository.logout();
  }

  async getCurrentUser() {
    return this.authRepository.getCurrentUser();
  }

  async isAuthenticated() {
    return this.authRepository.isAuthenticated();
  }

  async updateProfile(userData) {
    return this.authRepository.updateProfile(userData);
  }

  async deleteAccount() {
    return this.authRepository.deleteAccount();
  }
}
