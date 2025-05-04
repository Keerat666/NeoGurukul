import { Image, StyleSheet, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const completedLessons = [
  {
    title: 'DJ Khaled',
    subtitle: 'DJ Khaled',
    language: 'eng',
    author: 'Keerat',
    date: '5/3/2025',
  },
  {
    title: 'DJ Khaled',
    subtitle: 'DJ Khaled',
    language: 'eng',
    author: 'Keerat',
    date: '5/3/2025',
  },
  {
    title: 'DJ Khaled',
    subtitle: 'DJ Khaled',
    language: 'eng',
    author: 'Keerat',
    date: '5/3/2025',
  },
];

export default function HomeScreen() {
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to NeoGurukul!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Card View */}
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.cardTitle}>Hello Keerat</ThemedText>
        <ThemedText style={styles.cardSubtitle}>
          You have 3 classes that are currently processing.
        </ThemedText>
        <View style={styles.lectureRow}>
          <ThemedText style={styles.lectureStat}>5 lectures available</ThemedText>
          <ThemedText style={styles.lectureStat}>2 under processing</ThemedText>
        </View>
      </ThemedView>

      {/* Recently Completed Lessons */}
      <ThemedView style={styles.lessonSection}>
        <ThemedText type="title">Recently Completed Lessons:</ThemedText>
        {completedLessons.map((lesson, index) => (
          <ThemedView key={index} style={styles.lessonCard}>
            <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
            <ThemedText style={styles.lessonSubtitle}>{lesson.subtitle}</ThemedText>
            <ThemedText style={styles.lessonMeta}>Language: {lesson.language}</ThemedText>
            <ThemedText style={styles.lessonMeta}>By: {lesson.author}</ThemedText>
            <ThemedText style={styles.lessonMeta}>Date: {lesson.date}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#ccc',
    marginBottom: 12,
  },
  lectureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lectureStat: {
    color: '#aaa',
    fontSize: 16,
  },
  lessonSection: {
    gap: 12,
  },
  lessonCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonSubtitle: {
    color: '#ccc',
    marginBottom: 4,
  },
  lessonMeta: {
    color: '#aaa',
    fontSize: 14,
  },
});
