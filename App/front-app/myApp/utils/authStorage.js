import AsyncStorage from '@react-native-async-storage/async-storage';

/** Keys written at login / session; cleared on logout */
export const AUTH_SESSION_KEYS = [
  'token',
  'name',
  'role',
  '@academic_assistant_messages_v1',
  '@ai_registration_draft_ids_v1',
];

export async function clearAuthSessionFromStorage() {
  await AsyncStorage.multiRemove(AUTH_SESSION_KEYS);
}
