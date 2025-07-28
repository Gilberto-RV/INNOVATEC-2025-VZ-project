export class BuildingUseCases {
  constructor(buildingRepository) {
    this.buildingRepository = buildingRepository;
  }

  async getAllBuildings() {
    return await this.buildingRepository.getAllBuildings();
  }

  async getBuildingById(id) {
    if (!id) {
      throw new Error('ID del edificio es requerido');
    }
    return await this.buildingRepository.getBuildingById(id);
  }

  async searchBuildings(query, filters = {}) {
    const buildings = await this.buildingRepository.searchBuildings(query, filters);
    
    // Aplicar filtros adicionales
    let filteredBuildings = buildings;

    if (filters.accessibility) {
      filteredBuildings = filteredBuildings.filter(building => building.accessibility);
    }

    if (filters.type) {
      filteredBuildings = filteredBuildings.filter(building => 
        building.type.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    return filteredBuildings;
  }

  async loadBuildingsFromGeoJSON() {
    return await this.buildingRepository.loadBuildingsFromGeoJSON();
  }

  calculateDistance(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1.latitude)) * Math.cos(this.deg2rad(coord2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distancia en km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}