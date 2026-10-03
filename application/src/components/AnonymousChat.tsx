import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MessageCircle, Send, User, Shield, X } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: string;
  senderName: string;
}

interface AnonymousChatProps {
  deviceId: string;
  deviceName: string;
  sessionId: string;
  onClose: () => void;
}

export default function AnonymousChat({ deviceId, deviceName, sessionId, onClose }: AnonymousChatProps) {
  const { user } = useAuth();
  const { colors, theme } = useTheme();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [deviceId, sessionId, user]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chats/${sessionId}`);
      if (res.data.success) {
        const loadedMessages = res.data.chats.map((c: any) => ({
          id: c.chat_id.toString(),
          text: c.message,
          senderName: c.sender_username,
          timestamp: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        const finalMessages = loadedMessages.map((msg: any) => ({
          ...msg,
          isMe: msg.senderName === user?.username
        }));
        
        setMessages(finalMessages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await api.post('/chats', {
        deviceid: deviceId,
        session_id: sessionId,
        sender_username: user?.username || 'anonymous',
        receiver_username: 'unknown',
        message: newMessage
      });
      if (res.data.success || res.status === 200 || res.status === 201) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleContainer}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
            <MessageCircle color={colors.sky} size={20} />
          </View>
          <View>
            <Text style={[styles.titleText, { color: colors.text }]}>Anonymous Chat</Text>
            <Text style={[styles.subtitleText, { color: colors.subText }]} numberOfLines={1}>
              Device: {deviceName}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X color={colors.subText} size={24} />
        </TouchableOpacity>
      </View>

      <View style={[styles.noticeBox, { backgroundColor: colors.badgeBg }]}>
        <Shield color={colors.sky} size={14} />
        <Text style={[styles.noticeText, { color: colors.sky }]}>
          This chat is anonymous and secure. Messages are stored locally.
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.isMe ? styles.messageRowMe : styles.messageRowOther
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isMe 
                  ? [styles.bubbleMe, { backgroundColor: colors.primary }] 
                  : [styles.bubbleOther, { backgroundColor: colors.card, borderColor: colors.border }]
              ]}
            >
              <View style={styles.messageMeta}>
                <User color={message.isMe ? 'rgba(255,255,255,0.8)' : colors.subText} size={12} />
                <Text style={[
                  styles.senderName, 
                  { color: message.isMe ? 'rgba(255,255,255,0.9)' : colors.text }
                ]}>
                  {message.senderName}
                </Text>
                <Text style={[
                  styles.timestamp, 
                  { color: message.isMe ? 'rgba(255,255,255,0.6)' : colors.subText }
                ]}>
                  {message.timestamp}
                </Text>
              </View>
              <Text style={[
                styles.messageText, 
                { color: message.isMe ? '#ffffff' : colors.text }
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.subText}
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSendMessage}
        >
          <Send color="#ffffff" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: 200,
  },
  closeBtn: {
    padding: 4,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 10,
    marginLeft: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
