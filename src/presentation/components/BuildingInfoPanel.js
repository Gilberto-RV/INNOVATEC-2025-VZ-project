import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { 
  X, Accessibility, Layers, DoorOpen, Building, ArrowUpNarrowWide, Toilet, Library, GraduationCap
} from 'lucide-react-native';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

export default function BuildingInfoPanel({ building, onClose }) {
  if (!building) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{building.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {building.media && (
          <Image source={{ uri: building.media }} style={styles.image} />
        )}
        
        <View style={styles.infoSection}>
          <View style={styles.detailItem}>
            <Building size={16} color={COLORS.primary} />
            <Text style={styles.description}>{building.description}</Text>

          </View>
          
          <View style={styles.detailsContainer}>
            {building.floors && (
              <View style={styles.detailItem}>
                <Layers size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>
                  Cuenta con {building.floors} {building.floors === 1 ? 'planta' : 'plantas'}
                </Text>
              </View>
            )}

            {building.isAccessible && (
              <View style={styles.detailItem}>
                <Accessibility size={16} color={COLORS.success} />
                <Text style={[styles.detailText, { color: COLORS.success }]}>
                  Completamente accesible
                </Text>
              </View>
            )}
            {/* ✅ Datos adicionales */}
            <View style={styles.detailItem}>
              <DoorOpen size={16} color={COLORS.success} />
              <Text style={[styles.detailText, { color: COLORS.success }]}>
                {building.availability ? 'Disponible' : 'No disponible'}
              </Text>
            </View>
            {building.student_frequency && (
              <View style={styles.detailItem}>
                <ArrowUpNarrowWide size={16} color={
                  building.student_frequency === "high"
                    ? COLORS.error
                    : building.student_frequency === "medium"
                    ? COLORS.warning
                    : COLORS.success
                } />
                <Text
                  style={[
                    styles.detailText,
                    {
                      color:
                        building.student_frequency === "high"
                          ? COLORS.error
                          : building.student_frequency === "medium"
                          ? COLORS.warning
                          : COLORS.success,
                    },
                  ]}
                >
                  {building.student_frequency === "high" && "Alta frecuencia estudiantil"}
                  {building.student_frequency === "medium" && "Frecuencia estudiantil moderada"}
                  {building.student_frequency === "low" && "Frecuencia estudiantil baja"}
                </Text>
              </View>
            )}
          </View>

          {/* ✅ Baños por piso con ícono */}
          {building.bathrooms &&
            Object.keys(building.bathrooms).length > 0 &&
            Object.values(building.bathrooms).some((value) => value === true) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  <Toilet size={16} color={COLORS.primary} /> Baños disponibles en:
                </Text>

                {Object.entries(building.bathrooms)
                  .filter(([_, value]) => value === true)
                  .map(([floor, _]) => (
                    <View key={floor} style={styles.detailItem}>
                      <Layers size={16} color={COLORS.primary} />
                      <Text style={styles.detailText}>
                        Planta {floor.replace("floor_", "")}
                      </Text>
                    </View>
                  ))}
              </View>
          )}


          {/* ✅ Instalaciones */}
          {building.facilities && building.facilities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Servicios:</Text>
              {building.facilities.map((service, i) => (
                <Text key={i} style={styles.text}><Library size={16} color={COLORS.primary} /> {service.name}</Text>
              ))}
            </View>
          )}

          {/* ✅ Carreras */}
          {building.careers && building.careers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Carreras asignadas:</Text>
              {building.careers.map((career, i) => (
                <Text key={i} style={styles.text}><GraduationCap size={16} color={COLORS.primary} />   {career.name}</Text>
              ))}
            </View>
          )}


          {/* ✅ Entradas con lógica contextual */}
          {building.entrances && building.entrances.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {building.entrances.length === 1
                  ? 'Este edificio cuenta con una única entrada:'
                  : `Este edificio tiene ${building.entrances.length} entradas:`}
              </Text>
              {building.entrances.map((e, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  {e.description && (
                    <Text style={styles.text}>• {e.description}</Text>
                  )}
                  {e.location_hint && (
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: 'bold' }}>Ubicado</Text> {e.location_hint}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* ✅ Tipos de salones */}
          {building.subjects && building.subjects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Espacios académicos en este edificio:</Text>
              {/* Agrupar por tipo de salón */}
              {Array.from(
                building.subjects.reduce((map, item) => {
                  if (!map.has(item.type)) map.set(item.type, []);
                  map.get(item.type).push(item);
                  return map;
                }, new Map())
              ).map(([type, rooms], index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  {rooms.map((room, i) => (
                    <Text key={i} style={styles.text}>
                      •  {room.name} ({room.floor === 5 ? "Distribuidos por todo el edificio" : `Piso ${room.floor}`})
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.routeButton}>
        <Text style={styles.routeButtonText}>Cómo llegar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: DIMENSIONS.borderRadius.xl,
    borderTopRightRadius: DIMENSIONS.borderRadius.xl,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontFamily: 'Roboto-Bold',
    color: COLORS.primary,
    flex: 1,
  },
  closeButton: {
    padding: DIMENSIONS.spacing.xs,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: DIMENSIONS.borderRadius.md,
    marginBottom: DIMENSIONS.spacing.md,
  },
  infoSection: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingBottom: DIMENSIONS.spacing.xl,
  },
  description: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[700],
    marginLeft: DIMENSIONS.spacing.sm,
  },
  detailsContainer: {
    marginBottom: DIMENSIONS.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  detailText: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
    marginLeft: DIMENSIONS.spacing.sm,
  },
  section: {
    marginBottom: DIMENSIONS.spacing.md,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.sm,
  },
  text: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
    marginLeft: DIMENSIONS.spacing.sm,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  routeButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: DIMENSIONS.spacing.lg,
    marginVertical: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    alignItems: 'center',
  },
  routeButtonText: {
    color: COLORS.white,
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
  },
});
