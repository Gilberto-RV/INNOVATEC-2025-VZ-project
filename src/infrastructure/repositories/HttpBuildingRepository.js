import { BuildingRepository } from '../../core/repositories/BuildingRepository';
import { Building } from '../../core/entities/Building';
import axios from 'axios';
import api from '../../core/config/api';

export class HttpBuildingRepository extends BuildingRepository {
  constructor() {
    super();
    this.apiUrl = 'buildings'; // ruta relativa para el cliente

  }

  async getAllBuildings() {
    try {
      const response = await api.get('/buildings'); // ← usa directamente la instancia
      return response.data.map((item) => new Building(this.mapApiDataToEntity(item)));
    } catch (error) {
      console.error('Error al obtener todos los edificios:', error);
      Alert.warn('Error', this.apiUrl);
      return [];
    }
  }

  async getBuildingById(id) {
    try {
      const response = api.get('/buildings/' + id);
      return new Building(this.mapApiDataToEntity(response.data));
    } catch (error) {
      console.error(`Error al obtener edificio con id ${id}:`, error);
      throw new Error('Edificio no encontrado');
    }
  }

  async searchBuildings(query, filters = {}) {
    try {
      const allBuildings = await this.getAllBuildings();
      return allBuildings.filter((building) =>
        building.name.toLowerCase().includes(query.toLowerCase()) ||
        building.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error al buscar edificios:', error);
      return [];
    }
  }

  async loadBuildingsFromGeoJSON() {
    return await this.getAllBuildings();
  }

  mapApiDataToEntity(data) {
    return {
      id: data.geo_id,
      name: data.name,
      description: data.description,
      coordinates: data.entrances && data.entrances.length > 0
        ? { latitude: data.entrances[0][1], longitude: data.entrances[0][0] }
        : { latitude: 0, longitude: 0 },
      type: data.type || 'Desconocido',
      hasRamp: data.accessibility === true,
      isAccessible: data.accessibility === true,
      floors: data.floors || 1,
      image: data.media,
      facilities: data.services || [],
    };
  }
}
