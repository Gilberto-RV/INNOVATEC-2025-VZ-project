import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { serviceContainer } from '../../src/infrastructure/di/ServiceContainer';
import { COLORS } from '../../src/core/constants/colors';
import { DIMENSIONS } from '../../src/core/constants/dimensions';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('estudiante');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authUseCases = serviceContainer.get('authUseCases');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (avatar && !isValidImageUrl(avatar)) {
      Alert.alert('Error', 'La URL del avatar no es válida (debe terminar en .jpg, .jpeg o .png)');
      return;
    }

    setIsLoading(true);
    try {
      await authUseCases.register(email.trim(), password, avatar.trim(), role);
      router.replace('/(main)');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidImageUrl = (url) => {
    return /^https?:\/\/.*\.(jpg|jpeg|png)$/i.test(url);
  };
  const goToLogin = () => {
    router.back();
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Registro</Text>
            <Text style={styles.logoSubtext}>Crea tu cuenta</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Avatar (URL opcional)"
              value={avatar}
              onChangeText={setAvatar}
              editable={!isLoading}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Rol:</Text>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                enabled={!isLoading}
                style={styles.picker}
              >
                <Picker.Item label="Estudiante" value="estudiante" />
                <Picker.Item label="Profesor" value="profesor" />
                <Picker.Item label="Administrador" value="administrador" />
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={goToLogin}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: DIMENSIONS.spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xxl,
  },
  logoText: {
    fontSize: DIMENSIONS.fontSize.xxxl,
    fontFamily: 'Roboto-Bold',
    color: COLORS.primary,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  logoSubtext: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
  },
  formContainer: {
    marginBottom: DIMENSIONS.spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.md,
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Regular',
    backgroundColor: COLORS.white,
  },
  pickerContainer: {
    marginBottom: DIMENSIONS.spacing.md,
  },
  pickerLabel: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[700],
    marginBottom: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: DIMENSIONS.borderRadius.md,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
  },
  linkButton: {
    alignItems: 'center',
    padding: DIMENSIONS.spacing.sm,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
  },
});
