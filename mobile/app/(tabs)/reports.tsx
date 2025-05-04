import { useEffect, useState, useRef } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Platform, Pressable, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

interface Lecture {
  _id: string;
  lectureTitle: string;
  lectureDescription: string;
  language: string;
  lectureLink: string;
  lecture_createdBy_name: string;
  lecture_created_at: string;
  status: string;
  summary: string;
  transcription: string;
  lectureMetaData?: string;
}

export default function TabThreeScreen() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [transcriptionHeartbeat, setTranscriptionHeartbeat] = useState({});
  const colorScheme = useColorScheme();
  const router = useRouter();
  const hasRunRef = useRef(false);

  const fetchData = async () => {
    try {
      const res = await fetch('https://neogurukul.onrender.com/api/v1/lecture/all');
      const data = await res.json();
      setLectures(data.reverse());
    } catch {
      console.log("Encountered an error");
    } finally {
      setLoading(false);
    }
  };

  const checkTranscriptionStatus = async (lectureId: string) => {
    try {
      const res = await fetch('https://neogurukul-ai.onrender.com/transcribe_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: lectureId }),

        
      });

      if (!res.ok) return null;
      const data = await res.json();
      setTranscriptionHeartbeat(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch transcription status:', error);
      return null;
    }
  };

  const handleRetryTranscription = async (lecture: any) => {
    console.log(lecture)
    try {
      const res = await fetch('https://neogurukul-ai.onrender.com/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: lecture.lectureLink,
          lang: lecture.language,
          metadata: {
            classId: lecture._id,
            lectureTitle: lecture.lectureTitle,
            lectureDescription: lecture.lectureDescription,
            lectureMetaData: lecture.lectureMetaData || '',
          }
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Retry initiated successfully.");
      }
      else if (res.status === 503) {
        alert("Please ask the maintainer to turn on the server.");
      }
      
      else {
        alert("Retry failed: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error('Retry transcription failed:', err);
      alert("Retry failed. Please try again later.");
    }
  };

  const handleStartChat = (lecture: Lecture) => {
    router.push({
      pathname: '/chat/[lectureId]',
      params: {
        lectureId: lecture._id,
        title: lecture.lectureTitle,
        description: lecture.lectureDescription,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const checkPendingLectures = async () => {
      if (selectedTab !== 'pending' || hasRunRef.current) return;
      hasRunRef.current = true;

      const pendingLectures = lectures.filter((lecture) => lecture.status !== 'success');
      for (const lecture of pendingLectures) {
        const transcribeStatusRes = await checkTranscriptionStatus(lecture._id);

        if (transcribeStatusRes?.msg === "complete") {
          await fetch('https://neogurukul.onrender.com/api/v1/lecture/edit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...lecture,
              status: 'success',
              transcription: transcribeStatusRes.output.data[0],
              summary: transcribeStatusRes.output.summary,
              lectureMetaData: lecture.lectureDescription,
              averageDuration: transcribeStatusRes.output.average_duration,
            }),
          });
          await fetchData(); // Refresh list after successful update
        }
      }
    };

    checkPendingLectures();
  }, [selectedTab, lectures]);

  const filteredLectures = lectures.filter((lecture) => {
    if (selectedTab === 'completed') return lecture.status === 'success';
    if (selectedTab === 'pending') return lecture.status !== 'success';
    return true;
  });

  const renderLecture = ({ item }: { item: Lecture }) => (
    <View
      style={[
        styles.lectureCard,
        {
          backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F0F0F0',
          borderColor: colorScheme === 'dark' ? '#333' : '#DDD',
        },
      ]}
    >
      <ThemedText type="subtitle">{item.lectureTitle}</ThemedText>
      <ThemedText>{item.lectureDescription}</ThemedText>
      <ThemedText>Language: {item.language.charAt(0).toUpperCase() + item.language.slice(1)}</ThemedText>
      <ThemedText>By: {item.lecture_createdBy_name}</ThemedText>
      <ThemedText>Date: {new Date(item.lecture_created_at).toLocaleDateString()}</ThemedText>
      <ThemedText>Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</ThemedText>

      {Platform.OS === 'web' && (
        <audio controls style={styles.audioPlayer}>
          <source src={item.lectureLink} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}

      {item.status === "success" && (
        <>
          <View style={[styles.longTextContainer, { backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f9f9f9' }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📝 Summary</ThemedText>
            <ThemedText style={[styles.longText, { color: colorScheme === 'dark' ? '#ccc' : '#333' }]}>{item.summary}</ThemedText>
          </View>

          <View style={[styles.longTextContainer, { backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f9f9f9' }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🗣️ Transcription</ThemedText>
            <ThemedText style={[styles.longText, { color: colorScheme === 'dark' ? '#ccc' : '#333' }]}>{item.transcription}</ThemedText>
          </View>

          {item.status === "success" && (
            <Pressable onPress={() => handleStartChat(item)} style={[styles.chatButton, { backgroundColor: colorScheme === 'dark' ? 'green' : '#E0E0E0' }]}>
              <ThemedText>Start Chat</ThemedText>
            </Pressable>
          )}
        </>
      )}

      {item.status !== "success" && (
        <View style={{ marginVertical: 12 }}>
          <ThemedText style={{ fontStyle: 'italic', color: '#888', marginBottom: 6 }}>
            Chat will be available shortly. We’re still processing the audio from this lecture.
          </ThemedText>

          {/* <Pressable
            onPress={() => handleRetryTranscription(item)}
            style={[
              styles.chatButton,
              { backgroundColor: colorScheme === 'dark' ? '#555' : '#EEE' },
            ]}
          >
            <ThemedText>🔁 Retry Transcription</ThemedText>
          </Pressable> */}
        </View>
      )}
    </View>
  );

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Lecture List</ThemedText>
      </ThemedView>

      <View style={styles.tabContainer}>
        {['all', 'completed', 'pending'].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              hasRunRef.current = false;
              setSelectedTab(tab as 'all' | 'completed' | 'pending');
            }}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTabButton,
            ]}
          >
            <Text style={selectedTab === tab ? styles.activeTabText : styles.tabText}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredLectures}
          keyExtractor={(item) => item._id}
          renderItem={renderLecture}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  listContainer: {
    padding: 16,
  },
  lectureCard: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  audioPlayer: {
    marginTop: 10,
    width: '100%',
  },
  chatButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  longTextContainer: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    maxHeight: 250,
    overflow: 'scroll',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  longText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
