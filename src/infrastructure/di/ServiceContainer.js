// infrastructure/di/ServiceContainer.js

import { HttpAuthRepository } from '../repositories/HttpAuthRepository.js'; // ✅ Cambiado
import { MockEventRepository } from '../repositories/MockEventRepository.js';
import { HttpBuildingRepository } from '../repositories/HttpBuildingRepository.js';

import { AuthUseCases } from '../../core/usecases/AuthUseCases.js';
import { BuildingUseCases } from '../../core/usecases/BuildingUseCases.js';
import { EventUseCases } from '../../core/usecases/EventUseCases.js';

class ServiceContainer {
  constructor() {
    this._services = new Map();
    this._setupServices();
  }

  _setupServices() {
    // Repositories
    this._services.set('authRepository', new HttpAuthRepository()); // ✅ Sustituido
    this._services.set('buildingRepository', new HttpBuildingRepository());
    this._services.set('eventRepository', new MockEventRepository());

    // Use Cases
    this._services.set('authUseCases', new AuthUseCases(this.get('authRepository')));
    this._services.set('buildingUseCases', new BuildingUseCases(this.get('buildingRepository')));
    this._services.set('eventUseCases', new EventUseCases(this.get('eventRepository')));
  }

  get(serviceName) {
    const service = this._services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }

  set(serviceName, service) {
    this._services.set(serviceName, service);
  }
}

export const serviceContainer = new ServiceContainer();
