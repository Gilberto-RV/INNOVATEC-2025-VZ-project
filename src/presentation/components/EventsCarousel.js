import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';
import { COLORS } from '../../core/constants/colors';
import { DIMENSIONS } from '../../core/constants/dimensions';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function EventsCarousel({ events }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleScroll = (event) => {
    const slideSize = CARD_WIDTH + DIMENSIONS.spacing.md;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos del Instituto</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + DIMENSIONS.spacing.md}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {events.map((event, index) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {event.title}
              </Text>
              
              <Text style={styles.eventDescription} numberOfLines={3}>
                {event.description}
              </Text>
              
              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <Calendar size={14} color={COLORS.primary} />
                  <Text style={styles.eventDetailText}>
                    {formatDate(event.date)}
                  </Text>
                </View>
                
                {event.location && (
                  <View style={styles.eventDetail}>
                    <MapPin size={14} color={COLORS.primary} />
                    <Text style={styles.eventDetailText}>
                      {event.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {events.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: DIMENSIONS.spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  title: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontFamily: 'Roboto-Medium',
    color: COLORS.primary,
    marginBottom: DIMENSIONS.spacing.md,
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
  scrollContainer: {
    paddingHorizontal: DIMENSIONS.spacing.md,
  },
  eventCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius.lg,
    marginRight: DIMENSIONS.spacing.md,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: DIMENSIONS.spacing.md,
  },
  eventTitle: {
    fontSize: DIMENSIONS.fontSize.md,
    fontFamily: 'Roboto-Bold',
    color: COLORS.gray[800],
    marginBottom: DIMENSIONS.spacing.sm,
  },
  eventDescription: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[600],
    marginBottom: DIMENSIONS.spacing.md,
    lineHeight: 18,
  },
  eventDetails: {
    gap: DIMENSIONS.spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: DIMENSIONS.fontSize.xs,
    fontFamily: 'Roboto-Regular',
    color: COLORS.gray[500],
    marginLeft: DIMENSIONS.spacing.xs,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: DIMENSIONS.spacing.md,
    paddingBottom: DIMENSIONS.spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
});