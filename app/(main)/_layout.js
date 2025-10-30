// app/(tabs)/_layout.js o según tu estructura
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { serviceContainer } from '../../src/infrastructure/di/ServiceContainer';
import CustomDrawerContent from '../../src/presentation/components/CustomDrawerContent';
import { COLORS } from '../../src/core/constants/colors';

export default function MainLayout() {
  const [user, setUser] = useState(null);
  const authUseCases = serviceContainer.get('authUseCases');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authUseCases.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error.message || error);
      }
    };

    loadUser();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          drawerActiveTintColor: COLORS.primary,
          drawerInactiveTintColor: COLORS.gray[600],
          drawerStyle: {
            backgroundColor: COLORS.white,
            width: 280,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Mapa',
            title: 'Mapa del Instituto',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Perfil',
            title: 'Mi Perfil',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Configuración',
            title: 'Configuración',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
