import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert, ScrollView, Animated, Image } from 'react-native';
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
import { DIMENSIONS } from '../../src/core/constants/dimensions';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const windowHeight = Dimensions.get('window').height;

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
  const [isLoading, setIsLoading] = useState(true);

  const eventUseCases = serviceContainer.get('eventUseCases');
  const buildingUseCases = serviceContainer.get('buildingUseCases');
  const panelAnimation = useRef(new Animated.Value(0)).current;

  const buildingAccessibleIcon = require('../../assets/icons/a_building.png');
  const buildingNormalIcon = require('../../assets/icons/n_building.png');

  useEffect(() => {
    Animated.timing(panelAnimation, {
      toValue: selectedBuilding ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedBuilding]);

  const animatedPanelStyle = {
    transform: [{
      translateY: panelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight * 0.4, 0] 
      })
    }],
    opacity: panelAnimation
  };

  useEffect(() => {
    loadInitialData();
    requestLocationPermission();
    processGeoJSON();
  }, []);


  useEffect(() => {
    filterBuildings();
  }, [searchQuery, buildings]);

  const processGeoJSON = async () => {
    const { graph, nodeCoords } = buildGraph(caminos.features);
    setGraph(graph);
    setNodeCoords(nodeCoords);

    try {
      const dbBuildings = await buildingUseCases.getAllBuildings();
      console.log('Edificios desde la BDD:', dbBuildings);
      const geoBuildings = caminos.features
        .filter(f => f.properties.tipo === 'EDIFICIO')
        .map(f => {
          const center = calculateCenterFromPolygon(f.geometry.coordinates[0]);
          const id = f.properties.id;

          // Buscar edificio en MongoDB
          const dbInfo = dbBuildings.find(b => b.id === id);

          return {
            id,
            name: dbInfo?.name || f.properties.name,
            description: dbInfo?.description || 'Edificio del campus',
            coordinates: center,
            entradaId: f.properties.conexiones?.[0],
            hasRamp: dbInfo?.hasRamp ?? true,
            isAccessible: dbInfo?.isAccessible ?? true,
            image: dbInfo?.image || null,
            type: dbInfo?.type || null,
            floors: dbInfo?.floors || null,
            facilities: dbInfo?.facilities || [],
          };
        });

      setBuildings(geoBuildings);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los edificios');
    }

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
    finally {
      setIsLoading(false);
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

  const handleMarkerPress = (building) => {
    setSelectedBuilding(building);
    if (!building.entradaId) {
      console.warn(`🚪 Edificio ${building.name} no tiene entradaId asignado`);
      return;
    }

    const entrada = caminos.features.find(
      f => f.properties.id === building.entradaId && f.properties.tipo === 'ENTRADA_EDIFICIO'
    );

    if (!entrada) {
      console.warn(`🚪 Entrada no encontrada para edificio ${building.id}`);
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
      <View style={styles.headerFixed}>
        <MapHeader />
      </View>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
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
              >
                <Image
                  source={buildingAccessibleIcon}
                  style={{ width: 10, height: 10 }}
                  resizeMode="contain"
                />
              </Marker>
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

          {/* Barra de búsqueda flotante */}
          <View style={styles.searchBarWrapper}>
            <SearchBar onSearch={handleSearch} />
          </View>
        </View>
        <View style={styles.contentArea}>
          <EventsCarousel events={events} />
        </View>
      </ScrollView>

      {selectedBuilding && (
        <Animated.View style={[styles.infoPanel, animatedPanelStyle]}>
          <BuildingInfoPanel
            building={selectedBuilding}
            onClose={closeInfoPanel}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Asegura que esté sobre todo
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 60, // Altura aproximada del header
  },
  scrollContent: {
    paddingBottom: 30, // Espacio para scroll
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.9, // 70% de pantalla
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  searchBarWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 50, // Encima del mapa
  },
  contentArea: {
    minHeight: Dimensions.get('window').height * 0.3, // Mínimo 30% restante
    padding: 16,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: windowHeight * 0.5, // 40% de la pantalla
    backgroundColor: COLORS.white,
    borderTopLeftRadius: DIMENSIONS.borderRadius.xl,
    borderTopRightRadius: DIMENSIONS.borderRadius.xl,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 150,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});