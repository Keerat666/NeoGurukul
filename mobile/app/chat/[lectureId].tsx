import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function LectureChatScreen() {
  const { lectureId, title, description } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const colorScheme = useColorScheme();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const response = await fetch('https://neogurukul-ai.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMsg.text,
          metadata: {
            classId: lectureId,
          },
        }),
      });

      const data = await response.json();
      console.log('Bot response:', data);

      const botMsg: Message = {
        id: Date.now().toString() + 'b',
        sender: 'bot',
        text: data.response || '🤖 Sorry, no answer returned.',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('API error:', error);
      const errorMsg: Message = {
        id: Date.now().toString() + 'b',
        sender: 'bot',
        text: '🤖 Sorry, there was a problem fetching the answer.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText type="default" style={styles.summary}>
          {description}
        </ThemedText>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.messageBubble,
                {
                  backgroundColor:
                    item.sender === 'user' ? '#4C6EF5' : '#3A3A3A',
                  alignSelf:
                    item.sender === 'user' ? 'flex-end' : 'flex-start',
                },
              ]}
            >
              <ThemedText style={{ color: 'white' }}>{item.text}</ThemedText>
            </ThemedView>
          )}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
            style={[
              styles.input,
              {
                backgroundColor:
                  colorScheme === 'dark' ? '#1E1E1E' : '#F2F2F2',
                color: colorScheme === 'dark' ? 'white' : 'black',
              },
            ]}
          />
          <Pressable onPress={sendMessage} style={styles.sendButton}>
            <ThemedText style={{ color: 'white' }}>Send</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 16 },
  summary: { marginBottom: 12 },
  chatContainer: { flexGrow: 1, gap: 10, paddingVertical: 8 },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#4C6EF5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
