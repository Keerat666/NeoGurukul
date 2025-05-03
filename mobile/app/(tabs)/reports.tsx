import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Platform, Pressable } from 'react-native';
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
  status: string; // Added this
}

export default function TabThreeScreen() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  const router = useRouter();


  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await fetch('https://neogurukul.onrender.com/api/v1/lecture/all');
        const data = await res.json();
        setLectures(data);
        setLoading(false);
        // For each lecture, also fetch transcription status
        const updatedLectures = await Promise.all(
          data.map(async (lecture: Lecture) => {

            console.log(lecture)
            if(lecture.status === "pending")
            {
              console.log("Triggering Transcribe sync")
              const transcribeStatusRes = await checkTranscriptionStatus(lecture._id);
              console.log(transcribeStatusRes)

              if(transcribeStatusRes?.msg === "complete")
              {
                console.log("Triggering sync with web db")
                await fetch('https://neogurukul.onrender.com/api/v1/lecture/edit', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...lecture,
                    status: 'success',
                    transcription: transcribeStatusRes?.output.data[0], // Replace with real data if needed
                    summary: transcribeStatusRes?.output.summary, // Replace with real data
                    lectureMetaData: lecture.lectureDescription,
                    averageDuration : transcribeStatusRes?.output.average_duration
                  }),
                });
                //changing status for item
                return {
                  ...lecture,
                  status: transcribeStatusRes.msg || lecture.status, // prefer new status if available
                };

                //trigger update call to database


              }
              }
          })
        );
  
        setLectures(updatedLectures);
      } catch (error) {
        console.error('Failed to fetch lectures:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLectures();
  }, []);
  


  const checkTranscriptionStatus = async (lectureId: string) => {
    try {
      const res = await fetch('https://neogurukul-ai.onrender.com/transcribe_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: lectureId }),
      });
  
      if (!res.ok) return null;
  
      const data = await res.json();
      return data; // Assuming it returns { status: "completed" | "pending" | etc. }
    } catch (error) {
      console.error('Failed to fetch transcription status:', error);
      return null;
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
      <ThemedText>Language: {item.language}</ThemedText>
      <ThemedText>By: {item.lecture_createdBy_name}</ThemedText>
      <ThemedText>Date: {new Date(item.lecture_created_at).toLocaleDateString()}</ThemedText>

      <ThemedText>Status: {item.status}</ThemedText>

      {Platform.OS === 'web' && (
        <audio controls style={styles.audioPlayer}>
          <source src={item.lectureLink} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}

<Pressable
  onPress={() => handleStartChat(item)}
  style={[
    styles.chatButton,
    {
      backgroundColor: colorScheme === 'dark' ? 'green' : '#E0E0E0',
    },
  ]}
>
  <ThemedText>Start Chat</ThemedText>
</Pressable>
    </View>
  );

  return (
<ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Lecture List</ThemedText>
      </ThemedView>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={lectures}
          keyExtractor={(item) => item._id}
          renderItem={renderLecture}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
    alignItems: 'center',     // horizontal centering
    justifyContent: 'center', // vertical centering
    paddingVertical: 4,      // optional padding
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
});
