import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const LectureDetails = ({ details }) => {
  
  console.log(details)
  
  if (!details) return null;
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Lecture for {details.lectureTitle}</ThemedText>

      <ThemedText type='subtitle'>Description:</ThemedText>
      <ThemedText type='default'>{details.lectureDescription}</ThemedText>

      {details.lectureMetaData ? (
        <>
          <ThemedText type='subtitle'>Metadata:</ThemedText>
          <ThemedText type='default'>{details.lectureMetaData}</ThemedText>
        </>
      ) : null}

      <ThemedText type='subtitle'>Language:</ThemedText>
      <ThemedText type='default'>{details.language==="eng" ? "English" : "Hindi"}</ThemedText>

    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2b2b2b',
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default LectureDetails;
