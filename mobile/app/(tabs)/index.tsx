import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [notCompletedCount, setNotCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('https://neogurukul.onrender.com/api/v1/users/home');
        const data = response.data;

        setCompletedLessons(data.recentCompletedLectures);
        setCompletedCount(data.completedCount);
        setNotCompletedCount(data.notCompletedCount);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleStartChat = (lecture) => {
    router.push({
      pathname: '/chat/[lectureId]',
      params: {
        lectureId: lecture._id,
        title: lecture.lectureTitle,
        description: lecture.lectureDescription,
      },
    });
  };

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to NeoGurukul!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.cardTitle}>Hello Keerat</ThemedText>
        <ThemedText style={styles.cardSubtitle}>
          You have {notCompletedCount} classes that are currently processing.
        </ThemedText>
        <View style={styles.lectureRow}>
          <ThemedText style={styles.lectureStat}>{completedCount + notCompletedCount} lectures available</ThemedText>
          <ThemedText style={styles.lectureStat}>{notCompletedCount} under processing</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.lessonSection}>
        <ThemedText type="title">Recently Completed Lessons:</ThemedText>

        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <ShimmerLessonCard key={i} />
          ))
        ) : (
          completedLessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson._id || index}
              style={styles.lessonCard}
              onPress={() => handleStartChat(lesson)}
            >
              <ThemedText style={styles.lessonTitle}>{lesson.lectureTitle}</ThemedText>
              <ThemedText style={styles.lessonSubtitle}>{lesson.lectureDescription}</ThemedText>
              <ThemedText style={styles.lessonMeta}>Language: {lesson.language}</ThemedText>
              <ThemedText style={styles.lessonMeta}>By: {lesson.lecture_createdBy_name}</ThemedText>
              <ThemedText style={styles.lessonMeta}>
                Date: {new Date(lesson.lecture_created_at).toLocaleDateString()}
              </ThemedText>
            </TouchableOpacity>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Shimmer placeholder for one card
function ShimmerLessonCard() {
  return (
    <View style={styles.lessonCard}>
      <ShimmerPlaceHolder
        style={{ height: 20, marginBottom: 8, borderRadius: 4 }}
        LinearGradient={LinearGradient}
        shimmerColors={['#444', '#666', '#444']}
      />
      <ShimmerPlaceHolder
        style={{ height: 14, marginBottom: 6, borderRadius: 4 }}
        LinearGradient={LinearGradient}
        shimmerColors={['#444', '#666', '#444']}
      />
      <ShimmerPlaceHolder
        style={{ height: 14, width: '60%', marginBottom: 6, borderRadius: 4 }}
        LinearGradient={LinearGradient}
        shimmerColors={['#444', '#666', '#444']}
      />
      <ShimmerPlaceHolder
        style={{ height: 14, width: '40%', marginBottom: 6, borderRadius: 4 }}
        LinearGradient={LinearGradient}
        shimmerColors={['#444', '#666', '#444']}
      />
      <ShimmerPlaceHolder
        style={{ height: 14, width: '50%', borderRadius: 4 }}
        LinearGradient={LinearGradient}
        shimmerColors={['#444', '#666', '#444']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
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
    marginBottom: 10,
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
