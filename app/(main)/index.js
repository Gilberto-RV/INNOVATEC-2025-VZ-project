import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import caminos from '../../assets/geo/caminos.json';

import MapHeader from '../../src/presentation/components/MapHeader';
import SearchBar from '../../src/presentation/components/SearchBar';
import BuildingInfoPanel from '../../src/presentation/components/BuildingInfoPanel';
import EventsCarousel from '../../src/presentation/components/EventsCarousel';
import { serviceContainer } from '../../src/infrastructure/di/ServiceContainer';
import { COLORS } from '../../src/core/constants/colors';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

export default function MapScreen() {
  const [buildings, setBuildings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [geojsonLines, setGeojsonLines] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);


  const buildingUseCases = serviceContainer.get('buildingUseCases');
  const eventUseCases = serviceContainer.get('eventUseCases');

  useEffect(() => {
    loadInitialData();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    filterBuildings();
  }, [searchQuery, buildings]);

  useEffect(() => {
    // Procesar caminos y convertir a coordenadas válidas para <Polyline>
    const lines = caminos.features
      .filter(f => f.geometry.type === 'LineString')
      .map(f => ({
        id: f.properties?.id || Math.random().toString(),
        coordinates: f.geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        })),
      }));

    setGeojsonLines(lines);

    // Centrar el mapa en el primer camino si existe
    if (lines.length > 0) {
      const centro = calculateCenter(lines[0].coordinates);
      setMapRegion({
        ...centro,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, []);
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
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  const filterBuildings = () => {
    if (!searchQuery.trim()) {
      setFilteredBuildings(buildings);
      return;
    }

    const filtered = buildings.filter(building =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBuildings(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const calculateCenter = (coordenates) => {
    const lats = coordenates.map(c => c.latitude);
    const lngs = coordenates.map(c => c.longitude);
    const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    return { latitude: lat, longitude: lng };
  };


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
              pinColor={building.hasRamp ? COLORS.success : COLORS.primary}
              onPress={() => setSelectedBuilding(building)}
            />
          ))}

          {geojsonLines.map((line) => (
            <Polyline
              key={line.id}
              coordinates={line.coordinates}
              strokeColor={COLORS.primary}
              strokeWidth={4}
            />
          ))}
        </MapView>

        <SearchBar onSearch={handleSearch} />

        {selectedBuilding && (
          <BuildingInfoPanel
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
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