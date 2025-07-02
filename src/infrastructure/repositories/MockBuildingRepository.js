import { BuildingRepository } from '../../core/repositories/BuildingRepository';
import { Building } from '../../core/entities/Building';

export class MockBuildingRepository extends BuildingRepository {
  constructor() {
    super();
    this.buildings = [
      new Building({
        id: '1',
        name: 'Edificio Principal',
        description: 'Edificio administrativo principal del instituto',
        coordinates: { latitude: 19.4326, longitude: -99.1332 },
        type: 'Administrativo',
        hasRamp: true,
        isAccessible: true,
        floors: 3,
        image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
        facilities: ['Biblioteca', 'Cafetería', 'Aulas'],
      }),
      new Building({
        id: '2',
        name: 'Laboratorio de Ciencias',
        description: 'Laboratorio equipado para ciencias naturales',
        coordinates: { latitude: 19.4320, longitude: -99.1340 },
        type: 'Académico',
        hasRamp: false,
        isAccessible: false,
        floors: 2,
        image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
        facilities: ['Laboratorio Química', 'Laboratorio Física', 'Aulas'],
      }),
      new Building({
        id: '3',
        name: 'Centro Deportivo',
        description: 'Instalaciones deportivas y recreativas',
        coordinates: { latitude: 19.4330, longitude: -99.1325 },
        type: 'Deportivo',
        hasRamp: true,
        isAccessible: true,
        floors: 1,
        image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
        facilities: ['Gimnasio', 'Cancha', 'Vestidores'],
      }),
      new Building({
        id: '4',
        name: 'Auditorio',
        description: 'Auditorio para eventos y conferencias',
        coordinates: { latitude: 19.4315, longitude: -99.1335 },
        type: 'Cultural',
        hasRamp: true,
        isAccessible: true,
        floors: 2,
        image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
        facilities: ['Auditorio', 'Sala de conferencias', 'Camerinos'],
      }),
    ];
  }

  async getAllBuildings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.buildings]);
      }, 500);
    });
  }

  async getBuildingById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const building = this.buildings.find(b => b.id === id);
        if (building) {
          resolve(building);
        } else {
          reject(new Error('Edificio no encontrado'));
        }
      }, 300);
    });
  }

  async searchBuildings(query, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.buildings];

        if (query) {
          results = results.filter(building => 
            building.name.toLowerCase().includes(query.toLowerCase()) ||
            building.description.toLowerCase().includes(query.toLowerCase())
          );
        }

        resolve(results);
      }, 400);
    });
  }

  async loadBuildingsFromGeoJSON() {
    // Simulamos carga desde GeoJSON
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.buildings]);
      }, 800);
    });
  }
}