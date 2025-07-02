import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { User, Map, Settings, LogOut } from 'lucide-react-native';
import { serviceContainer } from '../../infrastructure/di/ServiceContainer';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

export default function CustomDrawerContent(props) {
  const { user } = props;
  const router = useRouter();
  const authUseCases = serviceContainer.get('authUseCases');

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authUseCases.logout();
              router.replace('/auth');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        },
      ]
    );
  };

  const DrawerItem = ({ icon: Icon, label, onPress, isLogout = false }) => (
    <TouchableOpacity 
      style={[styles.drawerItem, isLogout && styles.logoutItem]}
      onPress={onPress}
    >
      <Icon 
        size={24} 
        color={isLogout ? COLORS.error : COLORS.primary} 
        style={styles.drawerIcon} 
      />
      <Text style={[styles.drawerLabel, isLogout && styles.logoutLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={40} color={COLORS.primary} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <DrawerItem
          icon={Map}
          label="Mapa"
          onPress={() => props.navigation.navigate('index')}
        />
        
        <DrawerItem
          icon={User}
          label="Mi Perfil"
          onPress={() => props.navigation.navigate('profile')}
        />
        
        <DrawerItem
          icon={Settings}
          label="Configuración"
          onPress={() => props.navigation.navigate('settings')}
        />
      </View>

      <View style={styles.footer}>
        <DrawerItem
          icon={LogOut}
          label="Cerrar Sesión"
          onPress={handleLogout}
          isLogout={true}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.secondary,
    padding: DIMENSIONS.spacing.lg,
    marginBottom: DIMENSIONS.spacing.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  userInfo: {
    marginLeft: DIMENSIONS.spacing.xs,
  },
  userName: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: COLORS.primary,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  userEmail: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
  },
  menu: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.spacing.md,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.md,
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginVertical: DIMENSIONS.spacing.xs,
    borderRadius: DIMENSIONS.borderRadius.md,
  },
  logoutItem: {
    backgroundColor: COLORS.error + '10',
  },
  drawerIcon: {
    marginRight: DIMENSIONS.spacing.md,
  },
  drawerLabel: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[800],
  },
  logoutLabel: {
    color: COLORS.error,
  },
  footer: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingBottom: DIMENSIONS.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    marginTop: DIMENSIONS.spacing.md,
    paddingTop: DIMENSIONS.spacing.md,
  },
});