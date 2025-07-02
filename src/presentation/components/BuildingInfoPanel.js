import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { X, MapPin, Accessibility, Layers } from 'lucide-react-native';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

export default function BuildingInfoPanel({ building, onClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{building.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {building.image && (
          <Image source={{ uri: building.image }} style={styles.image} />
        )}

        <View style={styles.infoSection}>
          <Text style={styles.description}>{building.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>{building.type}</Text>
            </View>

            <View style={styles.detailItem}>
              <Layers size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>
                {building.floors} {building.floors === 1 ? 'piso' : 'pisos'}
              </Text>
            </View>

            {building.hasRamp && (
              <View style={styles.detailItem}>
                <Accessibility size={16} color={COLORS.success} />
                <Text style={[styles.detailText, { color: COLORS.success }]}>
                  Con rampa de acceso
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
          </View>

          {building.facilities && building.facilities.length > 0 && (
            <View style={styles.facilitiesContainer}>
              <Text style={styles.facilitiesTitle}>Instalaciones:</Text>
              {building.facilities.map((facility, index) => (
                <Text key={index} style={styles.facilityItem}>
                  • {facility}
                </Text>
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: DIMENSIONS.borderRadius.xl,
    borderTopRightRadius: DIMENSIONS.borderRadius.xl,
    maxHeight: '70%',
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  },
  infoSection: {
    padding: DIMENSIONS.spacing.lg,
  },
  description: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[700],
    marginBottom: DIMENSIONS.spacing.md,
    lineHeight: 22,
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
  facilitiesContainer: {
    marginTop: DIMENSIONS.spacing.md,
  },
  facilitiesTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.sm,
  },
  facilityItem: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
    marginBottom: DIMENSIONS.spacing.xs,
    marginLeft: DIMENSIONS.spacing.sm,
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