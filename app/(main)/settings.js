import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Bell, MapPin, Accessibility } from 'lucide-react-native';
import { COLORS } from '../../src/core/constants/colors';
import { DIMENSIONS } from '../../src/core/constants/dimensions';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const SettingItem = ({ icon: Icon, title, description, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Icon size={24} color={COLORS.primary} style={styles.settingIcon} />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
        thumbColor={value ? COLORS.white : COLORS.gray[100]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configuración</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          <SettingItem
            icon={Bell}
            title="Notificaciones"
            description="Recibir notificaciones de eventos y actualizaciones"
            value={notifications}
            onValueChange={setNotifications}
          />

          <SettingItem
            icon={MapPin}
            title="Compartir ubicación"
            description="Permitir compartir tu ubicación para mejores rutas"
            value={locationSharing}
            onValueChange={setLocationSharing}
          />

          <SettingItem
            icon={Accessibility}
            title="Modo accesibilidad"
            description="Priorizar rutas con rampas y accesos inclusivos"
            value={accessibilityMode}
            onValueChange={setAccessibilityMode}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoTitle}>Acerca de</Text>
            <Text style={styles.infoDescription}>Instituto Mini-Mapa v1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoTitle}>Soporte</Text>
            <Text style={styles.infoDescription}>Contactar al equipo técnico</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: DIMENSIONS.spacing.lg,
  },
  title: {
    fontSize: DIMENSIONS.fontSize.xxl,
    fontFamily: 'Roboto-Bold',
    color: COLORS.primary,
    marginBottom: DIMENSIONS.spacing.xl,
  },
  section: {
    marginBottom: DIMENSIONS.spacing.xl,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: DIMENSIONS.spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.xs,
  },
  settingDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
  },
  infoItem: {
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  infoTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.xs,
  },
  infoDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
  },
});