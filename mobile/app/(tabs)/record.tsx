import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LectureForm from '../classForm';
import LectureDetails from '../viewLectureDetails';
import { useRouter } from 'expo-router';
import { createLecture } from '@/services/lectureService';
import { uploadLectureAudio } from '@/services/audioService';

export default function TabTwoScreen() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const isRecording = !!recording;
  const isPlaying = !!sound;
  const [showRecording, setShowRecording] = useState(false);
  const [formDetails, setFormDetails] = useState({});
  const [cloudinaryLink, setCloudinaryLink] = useState("");
  const router = useRouter();

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      console.log("Recording")
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.warn('No recording in progress');
        return;
      }
  
      await recording.stopAndUnloadAsync();
  
      const uri = recording.getURI();
      console.log('Recording stopped. File URI:', uri);
  
      if (!uri) {
        Alert.alert('Error', 'Failed to get recording URI');
        return;
      }
  
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', err.message || 'Failed to stop recording.');
    }
  };
  

  const playSound = async () => {
    if (!recordedUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
    setSound(sound);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        setSound(null);
      }
    });
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const onSubmit = async (values)=>{
    console.log(values)
    console.trace(); // Shows where it's being called from
    try {
      const payload = {
        lecture_createdBy_name: 'Keerat',
        lecture_createdBy_id: '680f604e5108fc349b9ddc5b',
        status: 'pending',
        language: values.language || 'eng',
        lectureTitle: values.lectureTitle,
        lectureDescription: values.lectureDescription,
        lectureMetaData: values.lectureMetaData || '',
        assignedUsers: values.assignedUsers || [
          '680f609d5108fc349b9ddc5d',
          '680f604e5108fc349b9ddc5b',
        ],
        lectureLink : cloudinaryLink
      };
      console.log("Payload looks like : ")
      console.log(payload)
      const result = await createLecture(payload);
      console.log('Lecture created:', result);
      setShowRecording(false);
      setRecordedUri(null);
      router.push('/reports');
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong while creating the lecture.');
    }
  }

  const reset =()=>{
    setFormDetails({})
    setShowRecording(false)
    setRecordedUri(null)

  }

  const uploadAudio =async()=>{

    //upload Audio
    try {
      console.log("Trying but uri is empty")
      if (!recordedUri) return;
  
      const result = await uploadLectureAudio(recordedUri);
      console.log('Uploaded:', result);
  
      Alert.alert('Success', 'Audio uploaded');
      setFormDetails({});
      setShowRecording(false);
      setRecordedUri(null);
      router.push('/reports');
    } catch (err) {
      Alert.alert('Error', err.message || 'Upload failed');
    }

  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>

        {!showRecording&&

        <>
       
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Start Recording a Class</ThemedText>
      </ThemedView>

      <ThemedText type='subtitle'>
        Whenever you are ready, key in the following details and start recording a class :)
      </ThemedText>

      <LectureForm onSubmit={onSubmit} cloudinaryLink={cloudinaryLink} setCloudinaryLink={setCloudinaryLink}></LectureForm>
      </>
      }

     {showRecording && 
     
     <ThemedView style={styles.buttonContainer}>

      <LectureDetails details={formDetails}></LectureDetails>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.button, isRecording && styles.recording]}>
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>

        {recordedUri && (

          <>
        
          <TouchableOpacity
            onPress={isPlaying ? stopSound : playSound}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {isPlaying ? 'Stop Playback' : 'Play Recording'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={uploadAudio}
          style={[styles.successButton]}>
          <Text style={styles.buttonText}>
            {"Finish Lecture"}
          </Text>
        </TouchableOpacity>

          </>
        )}

<TouchableOpacity
          onPress={reset}
          style={[styles.dangerButton]}>
          <Text style={styles.buttonText}>
            {"Abandon Recording"}
          </Text>
        </TouchableOpacity>
      </ThemedView>}
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
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    gap: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
