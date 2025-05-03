import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Text, Checkbox, RadioButton } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as DocumentPicker from 'expo-document-picker'; // for MP3 picking
import { ThemedText } from '@/components/ThemedText';

const LectureForm = ({ onSubmit,cloudinaryLink,setCloudinaryLink  }) => {
  const [audioMode, setAudioMode] = useState('record'); // 'record' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);

  const validationSchema = Yup.object().shape({
    lecture_createdBy_name: Yup.string().required('Required'),
    status: Yup.string().oneOf(['pending', 'success', 'error']),
    language: Yup.string().oneOf(['eng', 'hi']).required('Required'),
    lectureTitle: Yup.string().required('Lecture title is required'),
    lectureDescription: Yup.string().required('Lecture description is required'),
    lectureMetaData: Yup.string(),
    lectureLink: Yup.string().url('Must be a valid URL'),
  });

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/mpeg',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const fileAsset = result.assets[0];
        setSelectedFile(fileAsset);

        const uri = fileAsset.uri;
        const name = fileAsset.name || 'audio.mp3';
        const type = fileAsset.mimeType || 'audio/mpeg';

        try {
          const response = await fetch(uri);
          const blob = await response.blob();

          const formdata = new FormData();
          formdata.append("audio", blob, name); // Append the Blob with the filename

          console.log("FormData before fetch:", formdata);

          const uploadResponse = await fetch("http://localhost:8000/api/v1/users/upload_lecture", {
            method: "POST",
            body: formdata,
            // fetch will likely set the correct Content-Type
          });

          const resultText = await uploadResponse.json();
          console.log("Upload result:", resultText);
          setCloudinaryLink(resultText?.url)

        } catch (fetchError) {
          console.error("Error fetching file as Blob:", fetchError);
        }
      }
    } catch (error) {
      console.error("File picker error:", error);
    }
  };
  

  return (
    <Formik
      initialValues={{
        lecture_createdBy_name: 'Keerat',
        status: 'pending',
        language: 'eng',
        lectureTitle: '',
        lectureDescription: '',
        lectureMetaData: '',
        assignedUsers: [],
        lectureLink: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            placeholder="Created By Name"
            value={`Lecture is being created by : ${values.lecture_createdBy_name}`}
            onChangeText={handleChange('lecture_createdBy_name')}
            onBlur={handleBlur('lecture_createdBy_name')}
            error={touched.lecture_createdBy_name && !!errors.lecture_createdBy_name}
            mode="outlined"
            style={styles.input}
            disabled
          />
          <TextInput
            placeholder="Lecture Title"
            value={values.lectureTitle}
            onChangeText={handleChange('lectureTitle')}
            onBlur={handleBlur('lectureTitle')}
            error={touched.lectureTitle && !!errors.lectureTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            placeholder="Lecture Description"
            value={values.lectureDescription}
            onChangeText={handleChange('lectureDescription')}
            onBlur={handleBlur('lectureDescription')}
            error={touched.lectureDescription && !!errors.lectureDescription}
            mode="outlined"
            multiline
            style={styles.input}
          />
          <TextInput
            placeholder="Lecture Metadata"
            value={values.lectureMetaData}
            onChangeText={handleChange('lectureMetaData')}
            onBlur={handleBlur('lectureMetaData')}
            mode="outlined"
            style={styles.input}
          />

          <ThemedText>Language</ThemedText>
          {[
            { label: 'English', value: 'eng' },
            { label: 'Hindi', value: 'hi' }
          ].map(({ label, value }) => (
            <Checkbox.Item
              key={value}
              label={label}
              status={values.language === value ? 'checked' : 'unchecked'}
              onPress={() => setFieldValue('language', value)}
              labelStyle={{ color: 'white' }}
            />
          ))}

          {errors.language && touched.language && (
            <Text style={{ color: 'red' }}>{errors.language}</Text>
          )}

{!cloudinaryLink &&<>
          <ThemedText>Audio Input Method</ThemedText>

          <RadioButton.Group
            onValueChange={value => setAudioMode(value)}
            value={audioMode}
          >
            <RadioButton.Item label="Record Audio" value="record" labelStyle={{ color: 'white' }} />
            <RadioButton.Item label="Upload MP3" value="upload" labelStyle={{ color: 'white' }} />
          </RadioButton.Group>

          {audioMode === 'upload' && (
            <Button mode="outlined" onPress={handleFilePick} style={{ marginTop: 10 }} disabled={cloudinaryLink.length>0}>
              {selectedFile ? `Uploading: ${selectedFile.name}` : 'Choose MP3 File'}
            </Button>
          )}
</>}

{cloudinaryLink.length>0 &&  <ThemedText>{selectedFile.name} has been uploaded!</ThemedText>}
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Create Lecture
          </Button>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
});

export default LectureForm;
