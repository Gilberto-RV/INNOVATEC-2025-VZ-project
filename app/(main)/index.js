import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapHeader from '../../src/presentation/components/MapHeader';
import SearchBar from '../../src/presentation/components/SearchBar';
import BuildingInfoPanel from '../../src/presentation/components/BuildingInfoPanel';
import EventsCarousel from '../../src/presentation/components/EventsCarousel';
import { serviceContainer } from '../../src/infrastructure/di/ServiceContainer';
import { COLORS } from '../../src/core/constants/colors';
import { DIMENSIONS } from '../../src/core/constants/dimensions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapScreen() {
  const [buildings, setBuildings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const buildingUseCases = serviceContainer.get('buildingUseCases');
  const eventUseCases = serviceContainer.get('eventUseCases');

  useEffect(() => {
    loadInitialData();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    filterBuildings();
  }, [searchQuery, buildings]);

  const loadInitialData = async () => {
    try {
      const [buildingsData, eventsData] = await Promise.all([
        buildingUseCases.getAllBuildings(),
        eventUseCases.getActiveEvents(),
      ]);
      setBuildings(buildingsData);
      setEvents(eventsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const filterBuildings = () => {
    if (!searchQuery.trim()) {
      setFilteredBuildings(buildings);
      return;
    }

    const filtered = buildings.filter(building =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuildings(filtered);
  };

  const handleMarkerPress = (building) => {
    setSelectedBuilding(building);
  };

  const handleSearch = (query, filters) => {
    setSearchQuery(query);
    // TODO: Implementar filtros adicionales
  };

  const closeInfoPanel = () => {
    setSelectedBuilding(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Cargando mapa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapHeader />
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {filteredBuildings.map((building) => (
            <Marker
              key={building.id}
              coordinate={building.coordinates}
              title={building.name}
              description={building.description}
              onPress={() => handleMarkerPress(building)}
              pinColor={building.hasRamp ? COLORS.success : COLORS.primary}
            />
          ))}
        </MapView>

        <SearchBar onSearch={handleSearch} />
        
        {selectedBuilding && (
          <BuildingInfoPanel
            building={selectedBuilding}
            onClose={closeInfoPanel}
          />
        )}
      </View>

      <EventsCarousel events={events} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});