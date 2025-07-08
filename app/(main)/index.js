import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import caminos from '../../assets/geo/caminos.json';
import { buildGraph, findRoute } from '../../src/core/utils/graphUtils';

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
  const [routePath, setRoutePath] = useState([]);
  const [graph, setGraph] = useState({});
  const [nodeCoords, setNodeCoords] = useState({});

  const eventUseCases = serviceContainer.get('eventUseCases');

  useEffect(() => {
    loadInitialData();
    requestLocationPermission();
    processGeoJSON();
  }, []);

  useEffect(() => {
    filterBuildings();
  }, [searchQuery, buildings]);

  const processGeoJSON = () => {
    const { graph, nodeCoords } = buildGraph(caminos.features);
    setGraph(graph);
    setNodeCoords(nodeCoords);

    const geoBuildings = caminos.features.filter(f => f.properties.tipo === 'EDIFICIO').map(f => {
      const center = calculateCenterFromPolygon(f.geometry.coordinates[0]);
      return {
        id: f.properties.id,
        name: f.properties.name,
        description: 'Edificio del campus',
        coordinates: center,
        entradaId: f.properties.conexiones?.[0],
        hasRamp: true,
        isAccessible: true,
      };
    });
    setBuildings(geoBuildings);

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

    if (lines.length > 0) {
      const centro = calculateCenter(lines[0].coordinates);
      setMapRegion({
        ...centro,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  const loadInitialData = async () => {
    try {
      const eventsData = await eventUseCases.getActiveEvents();
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

  const calculateCenter = (coordinates) => {
    const lats = coordinates.map(c => c.latitude);
    const lngs = coordinates.map(c => c.longitude);
    return {
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  const calculateCenterFromPolygon = (polygonCoords) => {
    const lats = polygonCoords.map(c => c[1]);
    const lngs = polygonCoords.map(c => c[0]);
    return {
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  const handleSearch = (query, filters) => {
    setSearchQuery(query);

    const target = buildings.find(b =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!target) {
      console.warn('🏠 Edificio no encontrado');
      return;
    }

    const entradaId = target.entradaId;
    if (!entradaId) {
      console.warn('❌ Edificio encontrado, pero sin entrada asignada');
      return;
    }

    const entrada = caminos.features.find(
      f => f.properties.id === entradaId && f.properties.tipo === 'ENTRADA_EDIFICIO'
    );

    if (!entrada) {
      console.warn(`🚪 Entrada no encontrada para edificio ${entradaId}`);
      return;
    }

    const destinoId = entrada.properties.id;
    const path = findRoute(graph, 'EP-003', destinoId);

    if (path) {
      const coords = path.map(id => nodeCoords[id]).filter(Boolean);
      setRoutePath(coords);
    } else {
      console.warn('⚠️ No se encontró ruta hacia', destinoId);
    }

    filterBuildings();
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
          {routePath.length > 1 && (
            <Polyline
              coordinates={routePath}
              strokeColor={COLORS.success}
              strokeWidth={5}
              lineDashPattern={[10, 5]}
            />
          )}
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