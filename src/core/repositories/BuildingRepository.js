// src/core/repositories/BuildingRepository.js
import api from '../../core/config/api';

export class BuildingRepository {
  async getAllBuildings() {
    const response = await api.get('/buildings');
    return response.data;
  }

  async getBuildingById(id) {
    const response = await api.get(`/buildings/${id}`);
    return response.data;
  }

};
