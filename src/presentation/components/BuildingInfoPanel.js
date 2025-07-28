import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

export default function BuildingInfoPanel ({ building, onClose }) {
  if (!building) return null;

  const {
    name,
    description,
    accessibility,
    floors,
    availability,
    student_frequency,
    bathrooms = {},
    services = [],
    careers = [],
    entrances = [],
    subject = [],
  } = building;


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 16 }}>
        {description ? <Text style={styles.description}>{description}</Text> : null}

        <View style={styles.section}>
          <Text style={styles.label}>Accesibilidad:</Text>
          <Text style={styles.text}>{accessibility || 'No especificado'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pisos:</Text>
          <Text style={styles.text}>{floors ?? 'Desconocido'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Disponibilidad:</Text>
          <Text style={styles.text}>{availability || 'No disponible'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Frecuencia de estudiantes:</Text>
          <Text style={styles.text}>{student_frequency || 'No especificada'}</Text>
        </View>

        {Object.keys(bathrooms).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Baños:</Text>
            <Text style={styles.text}>Hombres: {bathrooms.men ?? 0}</Text>
            <Text style={styles.text}>Mujeres: {bathrooms.women ?? 0}</Text>
            <Text style={styles.text}>Mixtos: {bathrooms.unisex ?? 0}</Text>
          </View>
        )}

        {services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Servicios:</Text>
            {services.map((s, index) => (
              <Text key={index} style={styles.text}>• {s}</Text>
            ))}
          </View>
        )}

        {careers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Carreras:</Text>
            {careers.map((c, index) => (
              <Text key={index} style={styles.text}>• {c}</Text>
            ))}
          </View>
        )}

        {entrances.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Entradas:</Text>
            {entrances.map((e, index) => (
              <Text key={index} style={styles.text}>• {e}</Text>
            ))}
          </View>
        )}

        {subject.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Materias:</Text>
            {subject.map((m, index) => (
              <Text key={index} style={styles.text}>• {m}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: DIMENSIONS.spacing.md,
    borderTopLeftRadius: DIMENSIONS.borderRadius.xl,
    borderTopRightRadius: DIMENSIONS.borderRadius.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  title: {
    fontSize: DIMENSIONS.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    flexWrap: 'wrap',
  },
  closeButton: {
    padding: DIMENSIONS.spacing.sm,
  },
  scrollContent: {
    paddingBottom: DIMENSIONS.spacing.xl,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginTop: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  text: {
    fontSize: DIMENSIONS.fontSize.md,
    color: COLORS.gray[700],
    marginBottom: DIMENSIONS.spacing.sm,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: DIMENSIONS.borderRadius.md,
    marginBottom: DIMENSIONS.spacing.md,
    backgroundColor: COLORS.gray[200],
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DIMENSIONS.spacing.sm,
    marginVertical: DIMENSIONS.spacing.sm,
  },
  tag: {
    backgroundColor: COLORS.gray[100],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: DIMENSIONS.borderRadius.sm,
    marginRight: DIMENSIONS.spacing.sm,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  tagText: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.gray[800],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[300],
    marginVertical: DIMENSIONS.spacing.md,
  },
});

