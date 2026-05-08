import {
  Pressable,
  Text,
} from 'react-native';

import { useAuth }
from '../context/AuthContext';

export default function LogoutButton() {

  const { logout } =
    useAuth();

  return (

    <Pressable
      onPress={logout}
      style={{
        backgroundColor: 'red',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
      }}
    >

      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Logout
      </Text>

    </Pressable>
  );
}