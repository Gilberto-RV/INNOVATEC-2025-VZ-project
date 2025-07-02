import { MockAuthRepository } from '../repositories/MockAuthRepository';
import { MockBuildingRepository } from '../repositories/MockBuildingRepository';
import { MockEventRepository } from '../repositories/MockEventRepository';
import { AuthUseCases } from '../../core/usecases/AuthUseCases';
import { BuildingUseCases } from '../../core/usecases/BuildingUseCases';
import { EventUseCases } from '../../core/usecases/EventUseCases';

class ServiceContainer {
  constructor() {
    this._services = new Map();
    this._setupServices();
  }

  _setupServices() {
    // Repositories
    this._services.set('authRepository', new MockAuthRepository());
    this._services.set('buildingRepository', new MockBuildingRepository());
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