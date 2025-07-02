export class AuthUseCases {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Formato de email inválido');
    }

    return await this.authRepository.login(email, password);
  }

  async register(email, password, name) {
    if (!email || !password || !name) {
      throw new Error('Todos los campos son requeridos');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Formato de email inválido');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return await this.authRepository.register(email, password, name);
  }

  async logout() {
    return await this.authRepository.logout();
  }

  async getCurrentUser() {
    return await this.authRepository.getCurrentUser();
  }

  async isAuthenticated() {
    return await this.authRepository.isAuthenticated();
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}