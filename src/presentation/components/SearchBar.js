import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
import FilterModal from './FilterModal';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hasRamp: false,
    isAccessible: false,
    type: '',
  });

  const handleSearch = (searchQuery = query) => {
    onSearch(searchQuery, filters);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    handleSearch();
  };

  const clearSearch = () => {
    setQuery('');
    handleSearch('');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar edificios..."
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              handleSearch(text);
            }}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterApply}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: DIMENSIONS.spacing.md,
    left: DIMENSIONS.spacing.md,
    right: DIMENSIONS.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius.lg,
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginRight: DIMENSIONS.spacing.sm,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: DIMENSIONS.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: DIMENSIONS.spacing.md,
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[800],
  },
  clearButton: {
    padding: DIMENSIONS.spacing.xs,
  },
  filterButton: {
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius.lg,
    padding: DIMENSIONS.spacing.md,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});