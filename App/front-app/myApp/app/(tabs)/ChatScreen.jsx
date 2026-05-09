import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAssistant } from '@/contexts/AssistantContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProtectedBackToLogin } from '@/hooks/useProtectedBackToLogin';
import { colors, space, radius, type } from '@/constants/designTokens';

export default function ChatScreen() {
  const { authReady, checking } = useRequireAuth();
  useProtectedBackToLogin();
  const { messages, sending, sendMessage, clearConversation } = useAssistant();
  const [inputText, setInputText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages, sending]);

  const handleSend = async () => {
    const t = inputText.trim();
    if (!t) return;
    setInputText('');
    await sendMessage(t);
  };

  if (checking) {
    return (
      <View style={[styles.container, styles.authBoot]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!authReady) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>المساعد الأكاديمي</Text>
        <TouchableOpacity onPress={clearConversation} hitSlop={12}>
          <Text style={styles.clearText}>مسح المحادثة</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item._id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              item.isBot ? styles.botMessageRow : styles.userMessageRow,
            ]}>
            <View
              style={[
                styles.messageBubble,
                item.isBot ? styles.botMessageBubble : styles.userMessageBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  item.isBot ? styles.botText : styles.userText,
                ]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          sending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب سؤالك هنا..."
          placeholderTextColor={colors.muted}
          value={inputText}
          onChangeText={setInputText}
          editable={!sending}
          multiline
          maxLength={800}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}>
          <Text style={styles.sendButtonText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  authBoot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  toolbarTitle: { ...type.headline, color: colors.dark },
  clearText: { ...type.caption, color: colors.primary, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { padding: space.md, paddingBottom: space.sm },
  messageRow: { marginBottom: space.sm, flexDirection: 'row' },
  botMessageRow: { justifyContent: 'flex-start' },
  userMessageRow: { justifyContent: 'flex-end' },
  messageBubble: {
    maxWidth: '88%',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
  },
  botMessageBubble: { backgroundColor: colors.bgCard },
  userMessageBubble: { backgroundColor: colors.primary },
  messageText: { ...type.callout, lineHeight: 22 },
  botText: { color: colors.dark },
  userText: { color: colors.white },
  loadingContainer: { paddingVertical: space.sm, alignItems: 'center' },
  inputContainer: {
    flexDirection: 'row',
    padding: space.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    gap: space.sm,
  },
  input: {
    flex: 1,
    ...type.callout,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    maxHeight: 120,
    backgroundColor: colors.bg,
    color: colors.dark,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.45 },
  sendButtonText: { color: colors.white, fontWeight: '700' },
});
