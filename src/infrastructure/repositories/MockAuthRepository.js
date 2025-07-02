import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthRepository } from '../../core/repositories/AuthRepository';
import { User } from '../../core/entities/User';

export class MockAuthRepository extends AuthRepository {
  constructor() {
    super();
    this.users = [
      { id: '1', email: 'admin@instituto.edu', password: '123456', name: 'Administrador' },
      { id: '2', email: 'estudiante@instituto.edu', password: '123456', name: 'Estudiante Demo' },
    ];
  }

  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
          const userEntity = new User({
            id: user.id,
            email: user.email,
            name: user.name,
          });
          AsyncStorage.setItem('currentUser', JSON.stringify(userEntity.toJSON()));
          resolve(userEntity);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }

  async register(email, password, name) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('El usuario ya existe'));
        } else {
          const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
          };
          this.users.push(newUser);
          const userEntity = new User({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          });
          AsyncStorage.setItem('currentUser', JSON.stringify(userEntity.toJSON()));
          resolve(userEntity);
        }
      }, 1000);
    });
  }

  async logout() {
    await AsyncStorage.removeItem('currentUser');
    return true;
  }

  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const userJson = JSON.parse(userData);
        return User.fromJSON(userJson);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}