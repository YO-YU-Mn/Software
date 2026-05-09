import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAssistant } from '@/contexts/AssistantContext';
import { colors, space, radius, type, elevationShadow } from '@/constants/designTokens';

export function FloatingAssistant() {
  const insets = useSafeAreaInsets();
  const { messages, sending, sendMessage, clearConversation } = useAssistant();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (open && messages.length) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, open, sending]);

  const onSend = async () => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    await sendMessage(t);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: Math.max(insets.bottom, 12) + 56, right: space.md },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.9}
        accessibilityLabel="فتح المساعد الأكاديمي"
        accessibilityRole="button">
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setOpen(false)}
            accessibilityLabel="إغلاق"
          />
          <KeyboardAvoidingView
            style={styles.sheetWrap}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            pointerEvents="box-none">
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, space.md) },
            ]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>المساعد الأكاديمي</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={clearConversation} hitSlop={12}>
                  <Text style={styles.linkText}>مسح المحادثة</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpen(false)} hitSlop={12}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
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
                    styles.row,
                    item.isBot ? styles.rowBot : styles.rowUser,
                  ]}>
                  <View
                    style={[
                      styles.bubble,
                      item.isBot ? styles.bubbleBot : styles.bubbleUser,
                    ]}>
                    <Text
                      style={[
                        styles.bubbleText,
                        item.isBot ? styles.textBot : styles.textUser,
                      ]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              )}
              ListFooterComponent={
                sending ? (
                  <View style={styles.typing}>
                    <ActivityIndicator color={colors.primary} />
                  </View>
                ) : null
              }
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="اكتب سؤالك..."
                placeholderTextColor={colors.muted}
                multiline
                maxLength={800}
                editable={!sending}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  (!input.trim() || sending) && styles.sendDisabled,
                ]}
                onPress={onSend}
                disabled={!input.trim() || sending}>
                <Text style={styles.sendLabel}>إرسال</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    zIndex: 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevationShadow(3),
  },
  fabIcon: { fontSize: 26 },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.45)',
    zIndex: 0,
  },
  sheetWrap: {
    maxHeight: '85%',
    zIndex: 1,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '78%',
    minHeight: '52%',
    ...elevationShadow(3),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    ...type.headline,
    color: colors.dark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  linkText: {
    ...type.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 22,
    color: colors.muted,
    paddingHorizontal: space.xs,
  },
  list: { flex: 1 },
  listContent: { padding: space.md, paddingBottom: space.sm },
  row: { marginBottom: space.sm, flexDirection: 'row' },
  rowBot: { justifyContent: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '88%',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
  },
  bubbleBot: { backgroundColor: colors.bgCard },
  bubbleUser: { backgroundColor: colors.primary },
  bubbleText: { ...type.callout, lineHeight: 22 },
  textBot: { color: colors.dark },
  textUser: { color: colors.white },
  typing: { paddingVertical: space.sm, alignItems: 'center' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    maxHeight: 100,
    color: colors.dark,
    backgroundColor: colors.bg,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.45 },
  sendLabel: { color: colors.white, fontWeight: '700' },
});
