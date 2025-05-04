import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'loading';
  text: string;
}

const suggestions = [
  'Generate 5 questions for me',
  'Important takeaways',
  'Teach me like I am 4',
];

export default function LectureChatScreen() {
  const { lectureId, title, description } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showPills, setShowPills] = useState(true);
  const [pillsAnimation] = useState(new Animated.Value(1)); // Animation for pill visibility
  const colorScheme = useColorScheme();
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100); // wait for message render
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (overrideText?: string) => {
    const messageText = overrideText ?? input.trim();
    if (!messageText) return;

    setShowPills(false);

    // Animate pills out
    Animated.timing(pillsAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const loadingMsg: Message = {
      id: 'loading',
      sender: 'loading',
      text: '🧠 NeoGurukul is thinking...',
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const response = await fetch('https://neogurukul-ai.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg.text,
          metadata: { classId: lectureId },
        }),
      });

      const data = await response.json();
      console.log('Bot response:', data);

      const botMsg: Message = {
        id: Date.now().toString() + 'b',
        sender: 'bot',
        text: data.response || '🧠 Sorry, no answer returned.',
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'loading'),
        botMsg,
      ]);
    } catch (error) {
      console.error('API error:', error);
      const errorMsg: Message = {
        id: Date.now().toString() + 'b',
        sender: 'bot',
        text: '🧠 Sorry, there was a problem fetching the answer.',
      };
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'loading'),
        errorMsg,
      ]);
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

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.messageBubble,
                {
                  backgroundColor:
                    item.sender === 'user'
                      ? '#4C6EF5'
                      : item.sender === 'bot'
                      ? '#3A3A3A'
                      : '#555',
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

        {/* Suggested message pills with animation */}
        {showPills && (
          <Animated.View
            style={[
              styles.pillContainer,
              {
                opacity: pillsAnimation, // Apply animation to pill container
                transform: [
                  {
                    translateY: pillsAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0], // Slide pills upwards when they appear
                    }),
                  },
                ],
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillScroll}
            >
              {suggestions.map((text) => (
                <Pressable
                  key={text}
                  onPress={() => sendMessage(text)}
                  style={styles.pill}
                >
                  <Text style={styles.pillText}>{text}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={(val) => {
              setInput(val);
              if (val.length > 0) {
                setShowPills(false);
                Animated.timing(pillsAnimation, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }
            }}
            style={[
              styles.input,
              {
                backgroundColor:
                  colorScheme === 'dark' ? '#1E1E1E' : '#F2F2F2',
                color: colorScheme === 'dark' ? 'white' : 'black',
              },
            ]}
          />
          <Pressable onPress={() => sendMessage()} style={styles.sendButton}>
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
  pillContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pillScroll: {
    marginBottom: 10,
  },
  pill: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    height: 50,
    justifyContent: 'center',
  },
  pillText: {
    color: '#333',
    fontWeight: '500',
  },
});
