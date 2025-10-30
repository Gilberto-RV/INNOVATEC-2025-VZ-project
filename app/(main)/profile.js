import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../src/core/constants/colors';
import { DIMENSIONS } from '../../src/core/constants/dimensions';
import { serviceContainer } from '../../src/infrastructure/di/ServiceContainer';
import { useAuth } from '../../src/hooks/useAuth'

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const authUseCases = serviceContainer.get('authUseCases');
  const { logout, updateProfile, deleteAccount } = useAuth(); // usa hook

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authUseCases.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setEditableUser({ ...currentUser, password: '' }); // No mostrar password real
      } else {
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
      router.replace('/auth');
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await authUseCases.logout();
            router.replace('/auth');
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión');
          }
        },
      },
    ]);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);

      const dataToUpdate = {
        avatar: editableUser.avatar,
        role: editableUser.role,
      };

      if (editableUser.password && editableUser.password.trim() !== '') {
        dataToUpdate.password = editableUser.password.trim();
      }

      await updateProfile(dataToUpdate);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      await loadUser();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };


  if (!editableUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: editableUser.avatar }}
            style={styles.avatarImage}
          />
          <TextInput
            placeholder="URL del avatar"
            value={editableUser.avatar}
            onChangeText={(text) => setEditableUser({ ...editableUser, avatar: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.disabledInput}>{editableUser.email}</Text>

          <Text style={styles.label}>Rol</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editableUser.role}
              onValueChange={(itemValue) =>
                setEditableUser({ ...editableUser, role: itemValue })
              }
            >
              <Picker.Item label="Estudiante" value="estudiante" />
              <Picker.Item label="Profesor" value="profesor" />
            </Picker>
          </View>

          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={editableUser.password}
            onChangeText={(text) => setEditableUser({ ...editableUser, password: text })}
            style={styles.input}
          />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}
            disabled={isUpdating}
          >
            <Text style={styles.updateButtonText}>
              {isUpdating ? 'Actualizando...' : 'Actualizar Perfil'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: COLORS.black }]}
            onPress={() => {
              Alert.alert('Eliminar Cuenta', '¿Estás seguro que deseas eliminar tu cuenta?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                      router.replace('/auth');
                    } catch (error) {
                      console.error('Error al eliminar cuenta:', error);
                      Alert.alert('Error', 'No se pudo eliminar la cuenta');
                    }
                  },
                },
              ]);
            }}
          >
            <Text style={styles.logoutButtonText}>Eliminar Cuenta</Text>
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
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: DIMENSIONS.spacing.xxl,
    marginBottom: DIMENSIONS.spacing.lg,
    alignItems: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: DIMENSIONS.spacing.md,
  },
  infoContainer: {
    width: '100%',
    marginBottom: DIMENSIONS.spacing.xxl,
  },
  label: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    marginTop: DIMENSIONS.spacing.sm,
    color: COLORS.gray[700],
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.sm,
    fontSize: DIMENSIONS.fontSize.md,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  disabledInput: {
    paddingVertical: DIMENSIONS.spacing.sm,
    fontSize: DIMENSIONS.fontSize.md,
    color: COLORS.gray[600],
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: DIMENSIONS.borderRadius.md,
    overflow: 'hidden',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  actionsContainer: {
    width: '100%',
    marginTop: DIMENSIONS.spacing.sm,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Bold',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
  },
});
