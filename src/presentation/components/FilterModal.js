import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

export default function FilterModal({ visible, filters, onClose, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      hasRamp: false,
      isAccessible: false,
      type: '',
    };
    setLocalFilters(resetFilters);
  };

  const FilterItem = ({ label, description, value, onValueChange }) => (
    <View style={styles.filterItem}>
      <View style={styles.filterInfo}>
        <Text style={styles.filterLabel}>{label}</Text>
        <Text style={styles.filterDescription}>{description}</Text>
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros de Búsqueda</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <FilterItem
              label="Con Rampa"
              description="Edificios que tienen rampa de acceso"
              value={localFilters.hasRamp}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ ...prev, hasRamp: value }))
              }
            />

            <FilterItem
              label="Accesible"
              description="Edificios completamente accesibles"
              value={localFilters.isAccessible}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ ...prev, isAccessible: value }))
              }
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Limpiar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: DIMENSIONS.borderRadius.xl,
    borderTopRightRadius: DIMENSIONS.borderRadius.xl,
    paddingBottom: DIMENSIONS.spacing.xl,
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
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
  },
  closeButton: {
    padding: DIMENSIONS.spacing.xs,
  },
  content: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingVertical: DIMENSIONS.spacing.md,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  filterInfo: {
    flex: 1,
    marginRight: DIMENSIONS.spacing.md,
  },
  filterLabel: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.xs,
  },
  filterDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    paddingTop: DIMENSIONS.spacing.md,
    gap: DIMENSIONS.spacing.md,
  },
  resetButton: {
    flex: 1,
    backgroundColor: COLORS.gray[200],
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.gray[700],
  },
  applyButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.borderRadius.md,
    padding: DIMENSIONS.spacing.md,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Medium',
    color: COLORS.white,
  },
});